from django.shortcuts import render
from rest_framework import viewsets
from django.contrib.auth import authenticate
from .models import User, Student, Interview
from .serializers import UserSerializer, StudentSerializer, InterviewSerializer

class UserViewSet(viewsets.ModelViewSet):
    #print("##########", User.objects,all)
    queryset = User.objects.all()
    serializer_class = UserSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


class InterviewViewSet(viewsets.ModelViewSet):
    queryset = Interview.objects.all()
    serializer_class = InterviewSerializer


# Create your views here.
