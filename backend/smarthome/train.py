import os
import django
from smarthome.neuralnet_ac import tune_model as tune_model_ac
from smarthome.neuralnet_light import tune_model as tune_model_light
from smarthome.utils import create_dataset_ac, create_dataset_light
from django.apps import apps


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Initialize Django
django.setup()


AirConditioner = apps.get_model('smarthome', 'AirConditioner')
Light = apps.get_model('smarthome', 'Light')

acs = AirConditioner.objects.all()
lights = Light.objects.all()

if acs:
    create_dataset_ac(filepath='data_train_ac.csv', num_samples=10000)
    create_dataset_ac(filepath='data_test_ac.csv', num_samples=10000)
    tune_model_ac()
else:
    print("No air conditioners created, create some air conditioners first.")

if lights:
    create_dataset_light(filepath='data_train_light.csv')
    create_dataset_light(filepath='data_test_light.csv')
    tune_model_light()
else:
    print("No lights created, create some lights first.")
