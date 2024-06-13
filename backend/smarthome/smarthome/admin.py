from django.contrib import admin

from .models import Room, AirConditioner, Light

# Register your models here.
admin.site.register(Room)
admin.site.register(AirConditioner)
admin.site.register(Light)
