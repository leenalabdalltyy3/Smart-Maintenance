from django.contrib import admin
from django.contrib.auth.models import Group

from .models import (
    Schedule,
    Appointment,
    History,
    Technician
)

# Hide Groups from Django Admin
admin.site.unregister(Group)

# Register only the models you want to show
admin.site.register(Schedule)
admin.site.register(Appointment)
admin.site.register(History)
admin.site.register(Technician)