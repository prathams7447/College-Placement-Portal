from rest_framework import serializers
from .models import User, Student, Interview
from datetime import datetime

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'is_admin', 'is_student', "first_name"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user


class InterviewSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()

    class Meta:
        model = Interview
        fields = ['companyId', 'companyName', 'designation', 'date', 'time', 'status']

    def get_date(self, obj):
        return obj.date.strftime('%d-%m-%Y')

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['date'] = instance.date.strftime('%d-%m-%Y')
        return ret

    def to_internal_value(self, data):
        internal_value = super().to_internal_value(data)
        date_str = data.get('date')
        if date_str:
            try:
                internal_value['date'] = datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S.%fZ')
            except ValueError:
                # Fallback to the original format
                internal_value['date'] = datetime.strptime(date_str, '%d-%m-%Y')
        return internal_value
        
class StudentSerializer(serializers.ModelSerializer):
    companies = InterviewSerializer(many=True, required=False)
    placedCompanies = InterviewSerializer(many=True, required=False)
    class Meta:
        model = Student
        fields = '__all__'


