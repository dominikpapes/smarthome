import time
import os
import django
import argparse
from django.conf import settings
from smarthome.utils import assign_temperatures_and_hours, assign_predicted_values

# Set up the Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
django.setup()

parser = argparse.ArgumentParser()
parser.add_argument("single", type=bool)

args = parser.parse_args()
single = args.single

if single:
    assign_temperatures_and_hours()
    print("Assigned new temperatures and hours")
    assign_predicted_values()
    print("Assigned new predicted values")

else:
    while True:
        assign_temperatures_and_hours()
        print("Assigned new temperatures and hours")
        assign_predicted_values()
        print("Assigned new predicted values")
        time.sleep(10)
