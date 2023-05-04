#Lavet af Simon Clausen
from django.db import models
from django.contrib.auth.models import User

#Create user profile model
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.username
   

class Aktivitet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, unique=False)
    aktivitet = models.CharField(max_length=100, unique=False)
    beskrivelse = models.CharField(max_length=100, unique=False)
    starttidspunkt = models.DateTimeField(unique=False)
    sluttidspunkt = models.DateTimeField(null=True, blank=True, unique=False)
    antalpersoner = models.IntegerField(default=1, unique=False)
    pris = models.IntegerField(default=0, unique=False)
    oprettelsestidspunkt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.aktivitet

u = User()
