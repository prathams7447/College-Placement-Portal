from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .serializers import UserSerializer, StudentSerializer, InterviewSerializer
from .models import Student, Interview, User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
import json

from .serializers import UserSerializer, StudentSerializer, InterviewSerializer
from .models import Student, Interview, User
from django.core.exceptions import ObjectDoesNotExist

# @csrf_exempt
# @require_http_methods(["POST"])
# def add_student(request):
#     print("##############")
#     student = json.loads(request.body)
#     serializer_class = StudentSerializer(student)
#     print("$$$$$$$$ ",serializer_class)
#     serializer_class.is_valid()
#     serializer_class.save()
#     return JsonResponse({'message': 'Student updated'})

@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def login(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    print (username)
    print (password)
    user = authenticate(username=username, password=password)
    print (user)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    
@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def resetPassword(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    try:
        user = User.objects.get(username=username)
    except ObjectDoesNotExist:
        return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

    user.set_password(password)
    user.save()

    return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)

@csrf_exempt
@require_http_methods(["POST"])
@permission_classes([IsAuthenticated])
def add_student(request):
    try:
        student_data = json.loads(request.body)
        serializer = StudentSerializer(data=student_data)
        if serializer.is_valid():
            password = get_password(serializer.validated_data)
            user = User.objects.create_user(
                username=serializer.validated_data['registerNo'],
                email=serializer.validated_data['email'],
                first_name = serializer.validated_data['name'],
                password=password
            )
            user.is_student = True
            user.save()
            serializer.save(user=user)
            return JsonResponse({'message': 'Student added successfully'}, status=201)
        else:
            return JsonResponse({'errors': serializer.errors}, status=400)
    except json.JSONDecodeError as e:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def get_password(student):
    username = student['name']
    reg_id = student['registerNo']
    
    # Remove spaces and convert to lowercase
    username_processed = username.replace(" ", "").lower()
    
    # Create the password using the first 4 letters of the processed username and the last 3 digits of the register ID
    password = username_processed[:4] + reg_id[-3:]
    
    return password

    

@csrf_exempt
@require_http_methods(["POST"])
@permission_classes([IsAuthenticated])
def add_interview(request):
    try:
        interview_data = json.loads(request.body)
        serializer = InterviewSerializer(data=interview_data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'message': 'Interview sheduled successfully'}, status=201)
        else:
            print("Validation errors: ", serializer.errors)
            return JsonResponse({'errors': serializer.errors}, status=400)
    except json.JSONDecodeError:
        print("JSON decode error: ", str(e))
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        print("Unexpected error: ", str(e))
        return JsonResponse({'error': str(e)}, status=500)
    

@csrf_exempt
@require_http_methods(["GET"])
@permission_classes([IsAuthenticated])
def get_students(request):
    try:
        list_of_students = Student.objects.all().order_by('placed')
        
        student_data = StudentSerializer(list_of_students, many=True)
        return JsonResponse(student_data.data, safe=False, status=200)
    except Exception as e:
        print("Unexpected error: ", str(e))
        return JsonResponse({'error': str(e)}, status=500)
    

@csrf_exempt
@require_http_methods(["GET"])
@permission_classes([IsAuthenticated])
def get_companies(request):
    try:
        list_of_companies = Interview.objects.all().order_by('companyId')
        comapny_data = InterviewSerializer(list_of_companies, many=True)
        return JsonResponse(comapny_data.data, safe=False, status=200)
    except Exception as e:
        print("Unexpected error: ", str(e))
        return JsonResponse({'error': str(e)}, status=500)
    


@csrf_exempt
@require_http_methods(["POST"])
@permission_classes([IsAuthenticated])
def update_companies(request):
    try:
        interview_data = json.loads(request.body)
        company_id = interview_data.get('companyId')
        
        if not company_id:
            return JsonResponse({'error': 'companyId is required for each interview data'}, status=400)
            
        try:
            interview = Interview.objects.get(companyId=company_id)
            serializer = InterviewSerializer(interview, data=interview_data)
                
            if serializer.is_valid():
                serializer.save()
                interview = Interview.objects.get(companyId=company_id)
            else:
                return JsonResponse({'errors': serializer.errors}, status=400)
            
        except Interview.DoesNotExist:
            return JsonResponse({'error': f'Interview with companyId {company_id} does not exist'}, status=404)
        
        return JsonResponse({'message': 'Interviews updated successfully'}, status=200)
    
    except json.JSONDecodeError as e:
        print("JSON decode error: ", str(e))
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        print("Unexpected error: ", str(e))
        return JsonResponse({'error': str(e)}, status=500)
    

@csrf_exempt
@require_http_methods(["POST"])
@permission_classes([IsAuthenticated])
def get_students_by_applied_companyid(request):
    try:
        data = json.loads(request.body)
        company_id = data
        
        if not company_id:
            return JsonResponse({'error': 'companyId is required'}, status=400)
        
        try:
            interview = Interview.objects.get(companyId=company_id)
        except Interview.DoesNotExist:
            return JsonResponse({'error': f'Interview with companyId {company_id} does not exist'}, status=404)
        
        # Fetch all students who have applied for the given interview
        students = Student.objects.filter(appliedCompanies=interview)
        serializer = StudentSerializer(students, many=True)
        
        return JsonResponse(serializer.data, safe=False, status=200)
    
    except json.JSONDecodeError as e:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

    
@csrf_exempt
@require_http_methods(["POST"])
@permission_classes([IsAuthenticated])
def update_student_status(request):
    try:
        # Parse the request body as JSON
        data = json.loads(request.body)
        student_data = data.get('students', [])
        company_id = data.get('companyId')
        
        if not isinstance(student_data, list):
            return JsonResponse({'error': 'Expected a list of student data'}, status=400)

        for student in student_data:
            student_id = student.get('registerNo')
            if not student_id:
                return JsonResponse({'error': 'registerNo is required for each student data'}, status=400)

            try:
                student_instance = Student.objects.get(registerNo=student_id)
                company_instance = Interview.objects.get(companyId=company_id)  # Assuming company_id is a valid Interview id

                if student.get('placed') == 'Yes':
                    student_instance.placed = 'Yes'
                    student_instance.placedCompanies.add(company_instance)  # Add the company instance
                elif student.get('placed') == 'No':
                    if student_instance.placedCompanies.filter(companyId=company_id).exists():
                        student_instance.placedCompanies.remove(company_instance)  # Remove the company instance

                student_instance.save()
                print("Succcess")
            except Student.DoesNotExist:
                print("Student.DoesNotExist:")
                return JsonResponse({'error': f'Student with registerNo {student_id} does not exist'}, status=404)
            except Interview.DoesNotExist:
                print("Interview.DoesNotExist:")
                return JsonResponse({'error': f'Interview with id {company_id} does not exist'}, status=404)
            except Exception as e:
                print("###",str(e))
                return JsonResponse({'error': str(e)}, status=500)

        return JsonResponse({'message': 'Students updated successfully'}, status=200)
    
    except json.JSONDecodeError as e:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

    
@csrf_exempt
@require_http_methods(["POST"])
@permission_classes([IsAuthenticated])
def get_students_by_reg_id(request):
    try:
        data = json.loads(request.body)
        reg_id = data
        
        if not reg_id:
            return JsonResponse({'error': 'reg_id is required'}, status=400)
        
        try:
            student = Student.objects.get(registerNo=reg_id)
        except Interview.DoesNotExist:
            return JsonResponse({'error': f'Student with reg {reg_id} does not exist'}, status=404)
        
        serializer = StudentSerializer(student)
        return JsonResponse(serializer.data, safe=False, status=200)
    
    except json.JSONDecodeError as e:
        print("JSON decode error: ", str(e))
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        print("Unexpected error: ", str(e))
        return JsonResponse({'error': str(e)}, status=500)
    


@csrf_exempt
@require_http_methods(["POST"])
@permission_classes([IsAuthenticated])
def getAppliedComByStdRegID(request):
    try:
        data = json.loads(request.body)
        register_no = data
        
        if not register_no:
            return JsonResponse({'error': 'registerNo is required'}, status=400)

        try:
            student = Student.objects.get(registerNo=register_no)
        except Student.DoesNotExist:
            return JsonResponse({'error': f'Student with registerNo {register_no} does not exist'}, status=404)

        applied_companies = student.appliedCompanies.all()
        serializer = InterviewSerializer(applied_companies, many=True)

        return JsonResponse(serializer.data, safe=False, status=200)
    
    except json.JSONDecodeError as e:
        print("JSON decode error: ", str(e))
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        print("Unexpected error: ", str(e))
        return JsonResponse({'error': str(e)}, status=500)
    

@csrf_exempt
@require_http_methods(["POST"])
@permission_classes([IsAuthenticated])
def getPlacedComByStdRegID(request):
    try:
        data = json.loads(request.body)
        register_no = data
        
        if not register_no:
            return JsonResponse({'error': 'registerNo is required'}, status=400)

        try:
            student = Student.objects.get(registerNo=register_no)
        except Student.DoesNotExist:
            return JsonResponse({'error': f'Student with registerNo {register_no} does not exist'}, status=404)

        applied_companies = student.placedCompanies.all()
        serializer = InterviewSerializer(applied_companies, many=True)

        return JsonResponse(serializer.data, safe=False, status=200)
    
    except json.JSONDecodeError as e:
        print("JSON decode error: ", str(e))
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        print("Unexpected error: ", str(e))
        return JsonResponse({'error': str(e)}, status=500)
    


    
@csrf_exempt
@require_http_methods(["POST"])
@permission_classes([IsAuthenticated])
def applyInterviewByStdReg(request):
    try:
        data = json.loads(request.body)
        student_reg = data.get('studentReg')
        company_id = data.get('companyId')
        
        try:
            student_instance = Student.objects.get(registerNo=student_reg)
            student_instance.appliedCompanies.add(company_id)  # Set the new company ID
            student_instance.save()

        except Student.DoesNotExist:
            return JsonResponse({'error': f'Student with registerNo {student_reg} does not exist'}, status=404)
        except Exception as e:
            print(f"Unexpected error for registerNo {student_reg}: ", str(e))
            return JsonResponse({'error': str(e)}, status=500)

        return JsonResponse({'message': 'Students updated successfully'}, status=200)
    
    except json.JSONDecodeError as e:
        print("JSON decode error: ", str(e))
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        print("Unexpected error: ", str(e))
        return JsonResponse({'error': str(e)}, status=500)

    

