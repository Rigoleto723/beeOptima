from django.urls import path
from .views import HiveList, HiveDetail, ColonyList, ColonyDetail, ColonyMonitoringList, ColonyMonitoringDetail, PollenProductionList, PollenProductionDetail

urlpatterns = [
    path('hives/', HiveList.as_view(), name='hive-list'),
    path('hives/<int:pk>/', HiveDetail.as_view(), name='hive-detail'),
    path('colonies/', ColonyList.as_view(), name='colony-list'),
    path('colonies/<int:pk>/', ColonyDetail.as_view(), name='colony-detail'),
    path('colony-monitorings/', ColonyMonitoringList.as_view(), name='colony-monitoring-list'),
    path('colony-monitorings/<int:pk>/', ColonyMonitoringDetail.as_view(), name='colony-monitoring-detail'),
    path('pollen-productions/', PollenProductionList.as_view(), name='pollen-production-list'),
    path('pollen-productions/<int:pk>/', PollenProductionDetail.as_view(), name='pollen-production-detail'),
]
