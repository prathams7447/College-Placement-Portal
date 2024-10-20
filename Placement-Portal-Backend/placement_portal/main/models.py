from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from datetime import datetime
from .constants import CompanyStatus


class User(AbstractUser):
    is_admin = models.BooleanField(default=False)
    is_student = models.BooleanField(default=False)
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='main_user_set',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        verbose_name='groups',
    )
    
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='main_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

class Interview(models.Model):
    companyId = models.IntegerField(primary_key=True, default=0)
    companyName = models.CharField(max_length=255, default='')
    designation = models.CharField(max_length=255, default='')
    date = models.DateTimeField(default=datetime.now)
    time = models.CharField(max_length=100, default='9:00 AM')  # Exa1mple default value
    status = models.CharField(max_length=100, default= CompanyStatus.SCHEDULED.value)

    def __str__(self):
        return f"{self.companyName} - {self.designation} - {self.date} - {self.time}"
    

class Student(models.Model):
    registerNo = models.CharField(primary_key=True, max_length=20)
    name = models.TextField(default='')
    department = models.TextField(default='')
    year = models.IntegerField(default=2024)
    cgpa = models.FloatField(default=1.0)
    placed = models.CharField(default='No', max_length=3)
    email = models.EmailField(default='xx.@gmail.com')
    contactNo = models.TextField(default='')
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student', null=True)
    appliedCompanies = models.ManyToManyField(Interview, related_name='applied_students', blank=True)
    placedCompanies = models.ManyToManyField(Interview, related_name='placed_students', blank=True)
    
    def __str__(self):
        return f"Student {self.registerNo}"



# Create your models here.
