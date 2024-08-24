from rest_framework import serializers
from .models import Hive, Colony, ColonyStatusHistory, ColonyMonitoring

class HiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hive
        fields = '__all__'

class ColonyStatusHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ColonyStatusHistory
        fields = ['colony', 'datetime', 'colony_health', 'num_of_bees', 'queen_present']

class ColonySerializer(serializers.ModelSerializer):
    hive_name = serializers.CharField(source='hive.name', read_only=True)
    status_history = ColonyStatusHistorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Colony
        fields = ['id', 'hive', 'colony_number', 'hive_name', 'status_history']

class ColonyMonitoringSerializer(serializers.ModelSerializer):
    colony_status = serializers.PrimaryKeyRelatedField(queryset=ColonyStatusHistory.objects.all())

    class Meta:
        model = ColonyMonitoring
        fields = ['id','colony', 'datetime', 'colony_temperature', 'colony_humidity', 'ambient_temperature', 'ambient_humidity', 'weight', 'colony_status']

    def create(self, validated_data):
        colony_status_data = validated_data.pop('colony_status')
        monitoring = ColonyMonitoring.objects.create(colony_status=colony_status_data, **validated_data)
        return monitoring
