from rest_framework import serializers
from .models import Hive, Colony, ColonyMonitoring, PollenProduction

class HiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hive
        fields = '__all__'

class ColonySerializer(serializers.ModelSerializer):
    class Meta:
        model = Colony
        fields = '__all__'

class ColonyMonitoringSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColonyMonitoring
        fields = '__all__'

class PollenProductionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollenProduction
        fields = '__all__'
