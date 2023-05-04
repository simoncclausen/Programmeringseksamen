#Lavet af Simon Clausen
from django.urls import path
from . import views

# https://www.youtube.com/watch?v=KXunlJgeRcU

urlpatterns = [
    path('', views.home, name='home'),
    path('login/', views.user_login, name='login'),
    path('Api/', views.Api, name='Api'),
    path('add/', views.add, name='add'),
    path('overview/', views.overview, name='overview'),
    path('schedule/', views.schedule, name='schedule'),
]

