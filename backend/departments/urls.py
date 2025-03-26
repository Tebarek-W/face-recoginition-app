from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r'departments', DepartmentViewSet, basename='department')

# Custom endpoints
department_urls = [
    path('departments/<uuid:id>/set-head', 
         DepartmentViewSet.as_view({'patch': 'set_head'}), 
         name='department-set-head'),
    path('departments/<uuid:id>/remove-head', 
         DepartmentViewSet.as_view({'delete': 'remove_head'}), 
         name='department-remove-head'),
]

urlpatterns = [
    *router.urls,
    *department_urls,
]