# main/urls.py
from django.urls import path, include
from .endpoints import login, add_student, add_interview, get_students, get_companies, update_companies, get_students_by_applied_companyid, update_student_status, get_students_by_reg_id, getAppliedComByStdRegID, getPlacedComByStdRegID, applyInterviewByStdReg, resetPassword
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
# router = DefaultRouter()
# router.register(r'users', UserViewSet)
# router.register(r'add-student', StudentViewSet)
# router.register(r'add-interviews', InterviewViewSet)

urlpatterns = [
    path('login/',login),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('add-student/',add_student),
    path('add-interview/',add_interview),
    path('get-students/',get_students),
    path('get-companies/',get_companies),
    path('update-companies/',update_companies),
    path('get_student_by_applied_companyid/',get_students_by_applied_companyid),
    path('update-students-status/', update_student_status),
    path('get-student-by-reg-id/',get_students_by_reg_id),
    path('get-applied-comp-student-by-reg-id/', getAppliedComByStdRegID),
    path('get-placed-comp-student-by-reg-id/', getPlacedComByStdRegID),
    path('apply-interview-by-student-reg/', applyInterviewByStdReg),
    path('reset-password/', resetPassword)
]
