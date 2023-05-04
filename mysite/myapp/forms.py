#Lavet af Simon Clausen
from django import forms
class AddActivityForm(forms.Form):

    aktivitet = forms.CharField(label='Aktivitet', max_length=100)
    beskrivelse = forms.CharField(label='Beskrivelse', max_length=100)
    starttidspunkt = forms.DateTimeField(label='Starttidspunkt')
    sluttidspunkt = forms.DateTimeField(label='Sluttidspunkt', required=False)
    antalpersoner = forms.IntegerField(label='Antal personer', min_value=1)
    pris = forms.IntegerField(label='Pris', min_value=0)
    
class LoginForm(forms.Form):
    username = forms.CharField(label='Brugernavn', max_length=100)
    password = forms.CharField(label='Kodeord', max_length=100, widget=forms.PasswordInput)