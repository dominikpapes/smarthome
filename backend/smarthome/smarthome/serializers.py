from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Room, AirConditioner, Light


class UserSerializer(serializers.ModelSerializer):
    rooms = serializers.PrimaryKeyRelatedField(many=True, queryset=Room.objects.all())

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'rooms')


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'password']

    def validate(self, data):
        return data

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class LightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Light
        fields = ['id', 'name', 'intensity', 'turned_on', 'room']


class AirConditionerSerializer(serializers.ModelSerializer):
    class Meta:
        model = AirConditioner
        fields = ['id', 'name', 'temperature', 'fan_speed', 'turned_on', 'room']


class RoomSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.id')
    lights = LightSerializer(many=True, required=False)
    airconditioners = AirConditionerSerializer(many=True, required=False)

    class Meta:
        model = Room
        fields = ['id', 'name', 'temperature', 'lights', 'airconditioners', 'owner', 'hour']
