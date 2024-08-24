from django.urls import path
from .views import HiveList, HiveDetail, ColonyList, ColonyDetail, ColonyMonitoringList, ColonyMonitoringDetail 
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('hives/', HiveList.as_view(), name='hive-list'),
    path('hives/<int:pk>/', HiveDetail.as_view(), name='hive-detail'),
    path('colonies/', ColonyList.as_view(), name='colony-list'),
    path('colonies/<int:pk>/', ColonyDetail.as_view(), name='colony-detail'),
    path('colony-monitorings/', ColonyMonitoringList.as_view(), name='colony-monitoring-list'),
    path('colony-monitorings/<int:pk>/', ColonyMonitoringDetail.as_view(), name='colony-monitoring-detail'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
