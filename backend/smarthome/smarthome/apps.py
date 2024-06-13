from django.apps import AppConfig
import os


class SmartHomeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'smarthome'

    def ready(self):
        os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
