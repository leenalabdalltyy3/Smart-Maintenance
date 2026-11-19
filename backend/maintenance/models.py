from django.db import models
from django.contrib.auth.models import User


class Scan(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    problem = models.TextField()

    risk = models.CharField(
        max_length=20
    )

    advice = models.TextField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )


class Appointment(models.Model):

    user = models.ForeignKey(

        User,

        on_delete=models.CASCADE,

        null=True,

        blank=True

    )

    technician = models.CharField(
        max_length=100
    )

    phone = models.CharField(
        max_length=20
    )

    date = models.CharField(
        max_length=50
    )

    time = models.CharField(
        max_length=50
    )

    status = models.CharField(

        max_length=20,

        default="Pending"

    )

    created_at = models.DateTimeField(

        auto_now_add=True

    )

    def __str__(self):

        return (

            f"{self.technician}"

            f" - "

            f"{self.date}"

        )


class Technician(models.Model):

    user = models.OneToOneField(

        User,

        on_delete=models.CASCADE

    )

    phone = models.CharField(

        max_length=20

    )

    specialty = models.CharField(

        max_length=100

    )

    description = models.TextField()

    def __str__(self):

        return self.user.username


class Schedule(models.Model):

    technician = models.ForeignKey(

        User,

        on_delete=models.CASCADE

    )

    day = models.CharField(

        max_length=20

    )

    time = models.CharField(

        max_length=20

    )

    booked = models.BooleanField(

        default=False

    )

    def __str__(self):

        return (

            f"{self.technician.username}"

            f" - "

            f"{self.day}"

            f" - "

            f"{self.time}"

        )

class TechnicianProfile(models.Model):

    user = models.OneToOneField(

        User,

        on_delete=models.CASCADE

    )

    phone = models.CharField(

        max_length=20,

        blank=True

    )

    specialty = models.CharField(

        max_length=100,

        blank=True

    )

    description = models.TextField(

        blank=True

    )

    def __str__(self):

        return self.user.username
class History(models.Model):

    problem = models.TextField()

    risk = models.CharField(

        max_length=100

    )

    advice = models.TextField()

    created_at = models.DateTimeField(

        auto_now_add=True

    )