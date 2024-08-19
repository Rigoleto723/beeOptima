from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Hive, Colony, ColonyMonitoring, PollenProduction
from .serializers import HiveSerializer, ColonySerializer, ColonyMonitoringSerializer, PollenProductionSerializer

class HiveList(APIView):
    def get(self, request):
        hives = Hive.objects.all()
        serializer = HiveSerializer(hives, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = HiveSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HiveDetail(APIView):
    def get(self, request, pk):
        try:
            hive = Hive.objects.get(pk=pk)
        except Hive.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = HiveSerializer(hive)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            hive = Hive.objects.get(pk=pk)
        except Hive.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = HiveSerializer(hive, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            hive = Hive.objects.get(pk=pk)
        except Hive.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        hive.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ColonyList(APIView):
    def get(self, request):
        colonies = Colony.objects.all()
        serializer = ColonySerializer(colonies, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ColonySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ColonyDetail(APIView):
    def get(self, request, pk):
        try:
            colony = Colony.objects.get(pk=pk)
        except Colony.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ColonySerializer(colony)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            colony = Colony.objects.get(pk=pk)
        except Colony.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ColonySerializer(colony, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            colony = Colony.objects.get(pk=pk)
        except Colony.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        colony.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ColonyMonitoringList(APIView):
    def get(self, request):
        monitorings = ColonyMonitoring.objects.all()
        serializer = ColonyMonitoringSerializer(monitorings, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ColonyMonitoringSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ColonyMonitoringDetail(APIView):
    def get(self, request, pk):
        try:
            monitoring = ColonyMonitoring.objects.get(pk=pk)
        except ColonyMonitoring.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ColonyMonitoringSerializer(monitoring)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            monitoring = ColonyMonitoring.objects.get(pk=pk)
        except ColonyMonitoring.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = ColonyMonitoringSerializer(monitoring, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            monitoring = ColonyMonitoring.objects.get(pk=pk)
        except ColonyMonitoring.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        monitoring.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PollenProductionList(APIView):
    def get(self, request):
        productions = PollenProduction.objects.all()
        serializer = PollenProductionSerializer(productions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PollenProductionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PollenProductionDetail(APIView):
    def get(self, request, pk):
        try:
            production = PollenProduction.objects.get(pk=pk)
        except PollenProduction.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PollenProductionSerializer(production)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            production = PollenProduction.objects.get(pk=pk)
        except PollenProduction.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = PollenProductionSerializer(production, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            production = PollenProduction.objects.get(pk=pk)
        except PollenProduction.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        production.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
