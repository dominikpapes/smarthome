from django.urls import path
from . import views


app_name = 'smarthome'
urlpatterns = [
    path('register/', views.register_user, name='register_user'),
    path('login/', views.login_user, name='login_user'),
    path('logout/', views.logout_user, name='logout_user'),
    path('get-users/', views.get_all_users, name='get-users'),
    path('get-rooms/', views.get_all_rooms, name='rooms'),
    path('create-room/', views.create_room, name='create=room'),
    path('delete-room/<int:room_id>/', views.delete_room, name='delete-room'),
    path('update-ac/', views.update_ac, name='update-ac'),
    path('delete-ac/<int:pk>/', views.delete_ac, name='delete-ac'),
    path('update-light/', views.update_light, name='update-light'),
    path('delete-light/<int:pk>/', views.delete_light, name='delete-light')
]
