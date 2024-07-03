import random

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import login, logout, authenticate
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.authtoken.models import Token
from .models import Room, AirConditioner, Light
from .serializers import (RoomSerializer, LightSerializer, AirConditionerSerializer,
                          UserSerializer, UserLoginSerializer, UserRegistrationSerializer)
from datetime import datetime
from .neuralnet_ac import update_model as update_model_ac
from .neuralnet_light import update_model as update_model_light


@csrf_exempt
@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username', None)
    if username and User.objects.filter(username=username).exists():
        return JsonResponse({'username': 'This username is already taken.'}, status=400)
    
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=201)
    return JsonResponse(serializer.errors, status=400)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # Delete any existing token
            Token.objects.filter(user=user).delete()
            # Create a new token
            token = Token.objects.create(user=user)
            return JsonResponse({'token': token.key, 'username': user.username}, status=200)
        return JsonResponse({'error': 'Invalid Credentials'}, status=400)
    return JsonResponse(serializer.errors, status=400)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    request.user.auth_token.delete()
    logout(request)
    return JsonResponse(data=request.data,  status=200)


@csrf_exempt
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def get_all_rooms(request):
    all_rooms = Room.objects.filter(owner=request.user)
    serializer = RoomSerializer(all_rooms, many=True)
    return JsonResponse(serializer.data, safe=False)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_room(request):
    data = JSONParser().parse(request)
    serializer = RoomSerializer(data=data)
    if serializer.is_valid():
        serializer.save(owner=request.user)
        return JsonResponse(serializer.data, status=201)
    return JsonResponse(serializer.errors, status=400)


@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_room(request, room_id):
    try:
        room = Room.objects.get(id=room_id)
    except Room.DoesNotExist:
        return JsonResponse(request.data, status=404)

    room.delete()
    return JsonResponse(request.data, status=204)


@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_ac(request):
    status = 400
    # Update database
    try:
        airconditioner = AirConditioner.objects.get(pk=request.data['id'])
        serializer = AirConditionerSerializer(airconditioner, data=request.data)
    except AirConditioner.DoesNotExist:
        serializer = AirConditionerSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        status = 204

    ac_id = serializer.data.get("id")
    weather_temperature = random.randint(-5, 35)
    current_hour = datetime.now().hour

    turned_on = serializer.data.get("turned_on")
    temperature = serializer.data.get("temperature")
    fan_speed = serializer.data.get("fan_speed")

    update_model_ac(ac_id, weather_temperature, current_hour, turned_on, temperature, fan_speed)

    return JsonResponse(serializer.errors, status=status)


@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_ac(request, pk):
    try:
        ac = AirConditioner.objects.get(id=pk)
    except AirConditioner.DoesNotExist:
        return JsonResponse(request.data, status=404)

    ac.delete()
    return JsonResponse(request.data, status=204)


@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_light(request):
    # Update database
    try:
        light = Light.objects.get(pk=request.data['id'])
        serializer = LightSerializer(light, data=request.data)
    except Light.DoesNotExist:
        serializer = LightSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=204)

    light_id = serializer.data.get("id")
    current_hour = datetime.now().hour

    turned_on = serializer.data.get("turned_on")
    intensity = serializer.data.get("intensity")

    update_model_light(light_id, current_hour, turned_on, intensity)

    return JsonResponse(serializer.errors, status=400)


@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_light(request, pk):
    try:
        light = Light.objects.get(id=pk)
    except Light.DoesNotExist:
        return JsonResponse(request.data, status=404)

    light.delete()
    return JsonResponse(request.data, status=204)
