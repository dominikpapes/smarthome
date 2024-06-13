from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth import get_user_model


User = get_user_model()


def get_superuser():
    return User.objects.filter(is_superuser=True).first().id


class Room(models.Model):
    owner = models.ForeignKey(User, related_name='rooms', on_delete=models.CASCADE)
    name = models.CharField(max_length=20)
    temperature = models.DecimalField(max_digits=4, decimal_places=2, default=20)
    hour = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(23)], default=12)

    def __str__(self):
        return f"{self.name}"


class Light(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='lights')
    name = models.CharField(max_length=20)
    intensity = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    turned_on = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.intensity} - {self.turned_on}"


class AirConditioner(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='airconditioners')
    name = models.CharField(max_length=20)
    temperature = models.IntegerField(validators=[MinValueValidator(18), MaxValueValidator(30)])
    fan_speed = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    turned_on = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.temperature} - {self.fan_speed} - {self.turned_on}"
