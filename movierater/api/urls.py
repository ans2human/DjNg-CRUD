from django.conf.urls import url, include
from rest_framework import routers
from movierater.api import views
from movierater.api.views import CustomObtainAuthToken




router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'employees', views.EmployeeViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^authenticate/', CustomObtainAuthToken.as_view()),
]
