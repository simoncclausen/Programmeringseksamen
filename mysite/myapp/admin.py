from django.contrib import admin
from django.contrib.auth.models import Group, User
from .models import Profile, Aktivitet

#unregister the Groups
admin.site.unregister(Group) 

#register Aktivitet
admin.site.register(Aktivitet)

#extend user model
class UserAdmin(admin.ModelAdmin):
    def __init__(self):
#Just display username and staff status fields on admin page
        fields = ['username']
        inlines = [ProfileInline]

        #unregister user
        admin.site.unregister(User)
        #register user and profile
        admin.site.register(User, self)
        

 
 #mix profile info into user
class ProfileInline(admin.StackedInline):
        model = Profile
   

