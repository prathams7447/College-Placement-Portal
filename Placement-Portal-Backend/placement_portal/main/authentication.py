from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from datetime import datetime, timedelta
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework_simplejwt.settings import api_settings
from rest_framework import serializers
from rest_framework import generics
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework.decorators import api_view

# class CustomTokenObtainPairView(TokenObtainPairView):
#     def post(self, request, *args, **kwargs):
#         response = super().post(request, *args, **kwargs)
#         refresh = response.data.get('refresh')
#         access = response.data.get('access')

#         if refresh and access:
#             refresh_token = RefreshToken(refresh)
#             refresh_token.access_token.set_exp(lifetime=timedelta(minutes=15))  # Adjust expiration as needed
#             response.data['refresh_expires_at'] = (datetime.fromisoformat(refresh) + timedelta(minutes=15))
#             response.data['access_expires_at'] = (access['exp'].isoformat() + timedelta(minutes=15)).isoformat()

#         return response
    

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        print(f"Username: {username}")
        print(f"Password: {password}")
        if username and password:
            user = authenticate(username=username, password=password)
            print(f"user: {user}")
            if user:
                response = super().post(request, *args, **kwargs)
                refresh = response.data.get('refresh')
                access = response.data.get('access')

                if refresh and access:
                    refresh_token = RefreshToken(refresh)
                    access_token = AccessToken(access)

                    # Set the expiration for the access token
                    access_token.set_exp(lifetime=timedelta(minutes=15))
                    
                    # Get the new expiration times
                    refresh_expires_at = datetime.fromtimestamp(refresh_token['exp'])
                    access_expires_at = datetime.fromtimestamp(access_token['exp'])

                    response.data['refresh_expires_at'] = refresh_expires_at.isoformat()
                    response.data['access_expires_at'] = access_expires_at.isoformat()

                    # Update the access token in the response
                    response.data['access'] = str(access_token)
                    response.data['refresh'] = str(refresh)
                    response.data['is_admin'] = user.is_superuser
                    response.data['is_authenticated'] = True
            else:
                response.data['is_authenticated'] = False

        return response
    
# def authenticate_user(request):
#     if request.method == "POST":
#         print("######## request", request)
#         username = request.get("username")
#         password = request.get("password")

#         if username and password:
#             user = authenticate(username=username, password=password)
#             if user:
#                 payload = api_settings.JWT_PAYLOAD_HANDLER(user)
#                 token = api_settings.JWT_ENCODE_HANDLER(payload)
#                 update_last_login(None, user)
#                 return {
#                     'username': user.username,
#                     'token': token,
#                     'user': {
#                         'username': user.username,
#                         'email': user.email,
#                         'first_name': user.first_name,
#                         'last_name': user.last_name,
#                         'user_type': user.user_type
#                     }
#                 }
#             else:
#                 raise serializers.ValidationError("Invalid username or password.")
#         else:
#             raise serializers.ValidationError("Must include 'username' and 'password'.")


# class LoginView(generics.GenericAPIView):
#     serializer_class = UserSerializer

#     def post(self, request, *args, **kwargs):
#         if request.method == "POST": 
#             username = request.data.get("username")
#             password = request.data.get("password")
#             print(username, " $$$$ ", username)
#             user = authenticate(username=username, password=password)
#             print(user)
#             if user:
#                 refresh = RefreshToken.for_user(user)
#                 return Response({
#                     'refresh': str(refresh),
#                     'access': str(refresh.access_token),
#                     'is_admin':user.is_superuser,
#                     'success':True
#                 })
#             else:
#                 return Response({"error": "Invalid credentials"}, status=400)
            
# @api_view(['POST'])
# def authenticate_user(request):
#     if request.method == "POST": 
#         username = request.data.get("username")
#         password = request.data.get("password")
#         print(username, " $$$$ ", username)
#         user = authenticate(username=username, password=password)
#         print(user)
#         if user:
#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#                 'is_admin':user.is_superuser,
#                 'success':True
#             })
#         else:
#             return Response({"error": "Invalid credentials"}, status=400)