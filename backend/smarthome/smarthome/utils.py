import pandas as pd
import numpy as np
import random
import os
import django
from django.apps import apps
from .neuralnet_ac import predict as predict_ac
from .neuralnet_light import predict as predict_light
# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Initialize Django
django.setup()


def generate_room_temperature(hour):
    # now = datetime.now()
    # hour = now.hour
    if 5 <= hour < 8:  # Early morning
        base_temp = 15
        temp_range = 5
    elif 8 <= hour < 12:  # Late morning
        base_temp = 20
        temp_range = 5
    elif 12 <= hour < 16:  # Afternoon
        base_temp = 25
        temp_range = 5
    elif 16 <= hour < 20:  # Evening
        base_temp = 22
        temp_range = 4
    elif 20 <= hour < 24:  # Night
        base_temp = 18
        temp_range = 3
    else:  # Late night
        base_temp = 12
        temp_range = 4

    temperature = base_temp + random.uniform(-temp_range, temp_range)
    return round(temperature)


# assigns a random temperature to all the rooms
def assign_temperatures_and_hours():
    Room = apps.get_model('smarthome', 'Room')
    all_rooms = Room.objects.all()
    for room in all_rooms:
        temperature = generate_room_temperature(room.hour)
        room.temperature = temperature
        room.hour = (room.hour + 1) % 24
        print(f"Room {room.name} new temperature: {room.temperature}; new hour: {room.hour}")
        room.save()


def assign_predicted_values_acs():
    AirConditioner = apps.get_model('smarthome', 'AirConditioner')

    acs = AirConditioner.objects.all()
    ids = []
    room_temps = []
    hours = []

    for ac in acs:
        ids.append(ac.id)
        room_temps.append(ac.room.temperature)
        hours.append(ac.room.hour)

    # Perform batch prediction
    turned_on, temperatures, fan_speeds = predict_ac(ids, room_temps, hours)

    # Update the AirConditioner instances
    for ac, turned_on_value, temperature_value, fan_speed_value in zip(acs, turned_on, temperatures, fan_speeds):
        print("Predicted values for AC ID {}: Turned On: {}, Temperature: {}, Fan Speed: {}".format(
            ac.id, turned_on_value, temperature_value, fan_speed_value))
        ac.turned_on = turned_on_value
        ac.temperature = temperature_value
        ac.fan_speed = fan_speed_value
        ac.save()

    return


def assign_predicted_values_lights():
    Light = apps.get_model('smarthome', 'Light')

    lights = Light.objects.all()
    ids = []
    hours = []

    for light in lights:
        ids.append(light.id)
        hours.append(light.room.hour)

    # Perform batch prediction
    turned_on, intensities = predict_light(ids, hours)

    # Update the AirConditioner instances
    for light, turned_on_value, intensity_value in zip(lights, turned_on, intensities):
        print("Predicted values for Light ID {}: Turned On: {}, Intensity: {}".format(
            light.id, turned_on_value, intensity_value))
        light.turned_on = turned_on_value
        light.intensity = intensity_value
        light.save()

    return


def assign_predicted_values():
    assign_predicted_values_acs()
    assign_predicted_values_lights()


def create_dataset_ac(filepath, num_samples=1000):
    # Get the AirConditioner model from the 'smarthome' app
    AirConditioner = apps.get_model('smarthome', 'AirConditioner')
    Room = apps.get_model('smarthome', 'Room')

    # Fetch all AC IDs from the database
    ac_ids = list(AirConditioner.objects.values_list('id', flat=True))

    # Define ranges for room temperature and hour
    room_temp_range = (-10, 40)  # Temperature in Celsius
    hour_range = (0, 23)  # 24-hour format

    # Initialize lists to store data
    ids = []
    room_temps = []
    hours = []
    turned_ons = []
    temperatures = []
    fan_speeds = []

    ac_id_counter = 0

    # Generate data for each sample
    for _ in range(num_samples):
        # Generate random values for id, room_temp, and hour
        ac_id = ac_ids[ac_id_counter]
        ac_id_counter = (ac_id_counter + 1) % len(ac_ids)
        ac = AirConditioner.objects.get(pk=ac_id)
        room = Room.objects.get(pk=ac.room_id)
        hour = room.hour
        room_temp = generate_room_temperature(hour)
        room.hour = (hour + 1) % 24
        room.temperature = room_temp
        room.save()

        # Determine if the air conditioner is turned on based on room_temp and hour
        turned_on = 1 if (room_temp >= 25 or room_temp < 20) else 0

        # Determine temperature setting based on room_temp and hour
        temperature = 20  # Default temperature
        if room_temp < 20:
            temperature += 2
        elif room_temp > 30:
            temperature -= 2
        if hour < 10 or hour > 20:
            temperature += 1

        # Determine fan speed based on room_temp and hour
        fan_speed = 3  # Default fan speed
        if 10 <= hour <= 18:
            if room_temp > 25:
                fan_speed = int(min(5, round((room_temp - 25) / 3) + 3))
            else:
                fan_speed = int(max(1, min(3, round((25 - room_temp) / 3))))

        # Append data to lists
        ids.append(ac_id)
        room_temps.append(room_temp)
        hours.append(hour)
        turned_ons.append(turned_on)
        temperatures.append(temperature)
        fan_speeds.append(fan_speed)

    # Convert lists to numpy arrays
    ids = np.array(ids)
    room_temps = np.array(room_temps)
    hours = np.array(hours)
    turned_ons = np.array(turned_ons)
    temperatures = np.array(temperatures)
    fan_speeds = np.array(fan_speeds)

    # Save data to CSV for inspection (optional)
    data = pd.DataFrame({
        'id': ids,
        'room_temp': room_temps,
        'hour': hours,
        'turned_on': turned_ons,
        'temperature': temperatures,
        'fan_speed': fan_speeds
    })

    data.to_csv(filepath, index=False)


def create_dataset_light(filepath, num_samples=1000):
    # Get the Light model from the 'smarthome' app
    Light = apps.get_model('smarthome', 'Light')

    # Fetch all Light IDs from the database
    light_ids = list(Light.objects.values_list('id', flat=True))

    # Define the range for hour
    hour_range = (0, 23)  # 24-hour format

    # Initialize lists to store data
    ids = []
    hours = []
    turned_ons = []
    intensities = []

    light_id_counter = 0


    # Generate data for each sample
    for _ in range(num_samples):
        # Generate random values for id and hour
        light_id = light_ids[light_id_counter]
        light_id_counter = (light_id_counter + 1) % len(light_ids)
        hour = random.randint(*hour_range)

        # Determine if the light is turned on based on the hour
        turned_on = 1 if (hour >= 18 or hour <= 6) else 0

        # Determine light intensity based on the hour
        if turned_on:
            if hour < 6:
                intensity = 5  # Highest intensity in early morning hours
            elif hour < 12:
                intensity = 3  # Medium intensity in the morning
            elif hour < 18:
                intensity = 1  # Lowest intensity during the day
            else:
                intensity = 4  # High intensity in the evening
        else:
            intensity = 1

        # Append data to lists
        ids.append(light_id)
        hours.append(hour)
        turned_ons.append(turned_on)
        intensities.append(intensity)

    # Convert lists to numpy arrays
    ids = np.array(ids)
    hours = np.array(hours)
    turned_ons = np.array(turned_ons)
    intensities = np.array(intensities)

    # Save data to CSV for inspection (optional)
    data = pd.DataFrame({
        'id': ids,
        'hour': hours,
        'turned_on': turned_ons,
        'intensity': intensities
    })

    data.to_csv(filepath, index=False)



