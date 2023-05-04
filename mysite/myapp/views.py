#Lavet af Simon Clausen
from django.http import HttpResponse
import requests
from django.shortcuts import render
from django.template import RequestContext
from django.utils import timezone
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from .models import Aktivitet, Profile
from .forms import AddActivityForm, LoginForm
from django.contrib.auth.decorators import login_required

def home(request):
    return render(request,'home.html',{})

def schedule(request):
    return render(request,'schedule.html',{})

def overview(request):

    if not request.user.is_authenticated:
        return render(request,'login.html',{})
    a = Aktivitet.objects.filter(user=request.user)
    print(a)
    print(request.user)

    return render(request,'overview.html',{'a': a, 'user': request.user})

def user_login(request):
    if request.user.is_authenticated:
        print(f"User {request.user} is already logged in")
    else:
        print("User is not logged in")

    if request.method == 'POST':
        # do stuff https://stackoverflow.com/questions/75023481/django-csrf-protection-issue
        form = LoginForm(request.POST)
        if form.is_valid():
        # check if user exists https://stackoverflow.com/questions/20010108/checking-if-username-exists-in-django
        #https://stackoverflow.com/questions/11714536/check-if-an-object-exists
            if User.objects.filter(username=form.cleaned_data['username']).exists(): 
                bruger = User.objects.get(username=form.cleaned_data['username'])
                if bruger.check_password(form.cleaned_data['password']):
                    login(request, bruger)
                    print(f"{bruger} logged in")
                else:
                    print("Wrong password")
            else:
                bruger = User(username=form.cleaned_data['username'])
                bruger.set_password(form.cleaned_data['password'])
                bruger.save()
                login(request, bruger)
                print(f"{bruger} made and logged in")
        else:
            print("Not saved")
    else:
        form = LoginForm()
    return render(request,'login.html',{"form": form, "user": request.user})


def aktivitet(request, id):
    if not request.user.is_authenticated:
        return render(request,'login.html',{})
    
    a = Aktivitet.objects.get(id=id)
    if request.user != a.user:
        return HttpResponse("Du har ikke adgang til denne side")

    return render(request,'aktivitet.html',{'aktivitet': a}) 

#http://www.boredapi.com/api/activity/
def Api(request):
    svar = requests.get("http://www.boredapi.com/api/activity/")
    svar = svar.json()
    a = Aktivitet(user=request.user,aktivitet=svar['activity'], beskrivelse=svar['type'], starttidspunkt=timezone.now(), antalpersoner=svar["participants"], pris=0)
    a.save()
    return render(request,'Api.html',{'svar': svar})

@login_required(login_url='/login/')
def add(request):
    if len(request.GET) > 0:
        # do stuff
        form = AddActivityForm(request.GET)
        if form.is_valid():
            a = Aktivitet(user=request.user, aktivitet=form.cleaned_data['aktivitet'], beskrivelse=form.cleaned_data['beskrivelse'], starttidspunkt=form.cleaned_data['starttidspunkt'], sluttidspunkt=form.cleaned_data['sluttidspunkt'], antalpersoner=form.cleaned_data['antalpersoner'], pris=form.cleaned_data['pris'])
            print("Saved")
            a.save()
        else:
            print("Not saved")
    else:
        form = AddActivityForm()
    return render(request,'add.html',{"form": form})
