import numpy as np
import pandas as pd
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import tensorflow as tf
import keras_tuner as kt
import random
import keras
from keras.src.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras import Model
from tensorflow.keras.layers import Dense, Input, Dropout, BatchNormalization, Embedding, Flatten, concatenate
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.regularizers import l2

# Setting seeds for reproducibility
seed_value = 42
np.random.seed(seed_value)
tf.random.set_seed(seed_value)
random.seed(seed_value)
os.environ['TF_DETERMINISTIC_OPS'] = '1'

# Constants for the range of each feature and label
NUM_IDS = 100
TEMP_RANGE = 51  # from -10 to 40 inclusive
HOUR_RANGE = 24  # from 0 to 23 inclusive
TEMP_LABEL_RANGE = 13  # from 18 to 30 inclusive
FAN_SPEED_RANGE = 5  # from 1 to 5 inclusive

# Sample data
# Number of samples
num_samples = 1000

model_file = "model_ac.keras"
train_file = "data_train_ac.csv"
test_file = "data_test_ac.csv"


def preprocess_input(ids, room_temps, hours):
    return np.array(ids), np.array(room_temps), np.array(hours)


def postprocess_output(pred):
    # Split the concatenated predictions
    turned_on_pred = pred[:, :2]
    temperatures_pred = pred[:, 2:2 + TEMP_LABEL_RANGE]
    fan_speeds_pred = pred[:, 2 + TEMP_LABEL_RANGE:]

    # Decode one-hot encoded predictions
    turned_on = np.argmax(turned_on_pred, axis=1)
    temperatures = np.argmax(temperatures_pred, axis=1) + 18
    fan_speeds = np.argmax(fan_speeds_pred, axis=1) + 1

    return turned_on, temperatures, fan_speeds


def load_data(csv_file):
    data = pd.read_csv(csv_file)

    # Extract features and labels
    ids = data['id'].values
    room_temps = data['room_temp'].values
    hours = data['hour'].values
    turned_on = data['turned_on'].values
    temperatures = data['temperature'].values
    fan_speeds = data['fan_speed'].values

    return ids, room_temps, hours, turned_on, temperatures, fan_speeds


def evaluate_model(test_csv_file):
    # Load test data
    ids, room_temps, hours, turned_on, temperatures, fan_speeds = load_data(test_csv_file)

    # Preprocess input data
    X = preprocess_input(ids, room_temps, hours)

    # One-hot encode labels
    turned_on_encoded = keras.utils.to_categorical(turned_on, 2)
    temperatures_encoded = keras.utils.to_categorical(temperatures - 18, TEMP_LABEL_RANGE)
    fan_speeds_encoded = keras.utils.to_categorical(fan_speeds - 1, FAN_SPEED_RANGE)

    # Combine all labels into a single array
    y = np.concatenate([turned_on_encoded, temperatures_encoded, fan_speeds_encoded], axis=1)

    # Load the trained model
    model = keras.saving.load_model(model_file)

    # Evaluate the model
    loss, accuracy = model.evaluate(X, y, batch_size=32)
    print(f"Test Loss: {loss}, Test Accuracy: {accuracy}")


def build_model(hp):
    id_input = Input(shape=(1,), name='id_input')
    temp_input = Input(shape=(1,), name='temp_input')
    hour_input = Input(shape=(1,), name='hour_input')

    id_embedding = Embedding(NUM_IDS, hp.Int('id_embedding', min_value=4, max_value=16, step=4), input_length=1)(
        id_input)
    temp_embedding = Embedding(TEMP_RANGE, hp.Int('temp_embedding', min_value=2, max_value=8, step=2),
                               input_length=1)(temp_input)
    hour_embedding = Embedding(HOUR_RANGE, hp.Int('hour_embedding', min_value=2, max_value=6, step=2),
                               input_length=1)(hour_input)

    id_flatten = Flatten()(id_embedding)
    temp_flatten = Flatten()(temp_embedding)
    hour_flatten = Flatten()(hour_embedding)

    concatenated = concatenate([id_flatten, temp_flatten, hour_flatten])

    x = Dense(hp.Int('units1', min_value=32, max_value=256, step=32), activation='relu',
              kernel_regularizer=l2(0.01))(concatenated)
    x = BatchNormalization()(x)
    x = Dropout(hp.Float('dropout1', min_value=0.2, max_value=0.5, step=0.1))(x)
    x = Dense(hp.Int('units2', min_value=16, max_value=128, step=16), activation='relu',
              kernel_regularizer=l2(0.01))(x)
    x = BatchNormalization()(x)
    x = Dropout(hp.Float('dropout2', min_value=0.2, max_value=0.5, step=0.1))(x)
    output = Dense(2 + TEMP_LABEL_RANGE + FAN_SPEED_RANGE, activation='softmax')(x)

    model = Model(inputs=[id_input, temp_input, hour_input], outputs=output)

    model.compile(
        optimizer=Adam(learning_rate=hp.Float('learning_rate', min_value=1e-5, max_value=1e-2, sampling='LOG')),
        loss='categorical_crossentropy', metrics=['accuracy'])

    return model


def tune_model():
    csv_file = train_file
    ids, room_temps, hours, turned_on, temperatures, fan_speeds = load_data(csv_file)
    ids, room_temps, hours = preprocess_input(ids, room_temps, hours)
    turned_on_encoded = keras.utils.to_categorical(turned_on, 2)
    temperatures_encoded = keras.utils.to_categorical(temperatures - 18, TEMP_LABEL_RANGE)
    fan_speeds_encoded = keras.utils.to_categorical(fan_speeds - 1, FAN_SPEED_RANGE)
    y = np.concatenate([turned_on_encoded, temperatures_encoded, fan_speeds_encoded], axis=1)

    tuner = kt.Hyperband(
        build_model,
        objective='val_accuracy',
        max_epochs=50,
        factor=3,
        directory='kt_dir',
        project_name='ac_control'
    )

    early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
    reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=1e-6)

    tuner.search([ids, room_temps, hours], y, epochs=100, validation_split=0.2, callbacks=[early_stopping, reduce_lr])

    best_model = tuner.get_best_models(num_models=1)[0]
    best_hyperparameters = tuner.get_best_hyperparameters(num_trials=1)[0]

    print(f"Best Hyperparameters: {best_hyperparameters.values}")

    best_model.save(model_file)
    best_model.summary()

    # Evaluate
    evaluate_model(test_file)


def predict(ids, room_temps, hours):
    model = keras.models.load_model(model_file)
    # Ensure inputs are of type float and reshape
    ids = np.array(ids, dtype=np.float32).reshape(-1, 1)
    room_temps = np.array(room_temps, dtype=np.float32).reshape(-1, 1)
    hours = np.array(hours, dtype=np.float32).reshape(-1, 1)
    # Predict
    pred = model.predict([ids, room_temps, hours])
    return postprocess_output(pred)


def update_model(id, room_temp, hour, turned_on, temperature, fan_speed):
    model = keras.models.load_model(model_file)
    id, room_temp, hour = preprocess_input([id], [room_temp], [hour])

    # Prepare the labels (outputs)
    turned_on_encoded = keras.utils.to_categorical([turned_on], 2)
    temperature_encoded = keras.utils.to_categorical([temperature - 18], TEMP_LABEL_RANGE)
    fan_speed_encoded = keras.utils.to_categorical([fan_speed - 1], FAN_SPEED_RANGE)
    y = np.concatenate([turned_on_encoded, temperature_encoded, fan_speed_encoded], axis=1)

    model.fit([id, room_temp, hour], y, epochs=1, batch_size=1, verbose=0)
    model.save(model_file)
