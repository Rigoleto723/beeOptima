from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Hive, Colony, ColonyMonitoring, ColonyStatusHistory
from .serializers import HiveSerializer, ColonySerializer, ColonyMonitoringSerializer, ColonyStatusHistorySerializer

class HiveList(APIView):
    #permission_classes = [IsAuthenticated]
    
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
    #permission_classes = [IsAuthenticated]

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
    #permission_classes = [IsAuthenticated]

    def get(self, request):
        colonies = Colony.objects.all()
        serializer = ColonySerializer(colonies, many=True)
        return Response(serializer.data)

    def post(self, request):
        print("Datos de solicitud:", request.data) 
        serializer = ColonySerializer(data=request.data)
        if serializer.is_valid():
            colony = serializer.save()
            print("Colonia guardada:", colony)
            
            # Crear un nuevo estado inicial de la colonia al crearla
            initial_status_data = {
                "colony": colony.id,
                "colony_health": request.data.get('colony_health'),
                "num_of_bees": request.data.get('num_of_bees'),
                "queen_present": request.data.get('queen_present')
            }
            print("Datos de estado inicial:", initial_status_data)
            initial_status_serializer = ColonyStatusHistorySerializer(data=initial_status_data)
            if initial_status_serializer.is_valid():
                initial_status_serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print("Errores de serializador de estado inicial:", initial_status_serializer.errors)  # Registro de depuración
                return Response(initial_status_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        print("Errores de serializador de colonia:", serializer.errors)  # Registro de depuración
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ColonyDetail(APIView):
    #permission_classes = [IsAuthenticated]

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

class ColonyStatusHistoryCreateView(APIView):
    #permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ColonyStatusHistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ColonyMonitoringList(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request):
        colony_id = request.query_params.get('colony')  # Obtener el parámetro de consulta 'colony'
        if colony_id:
            # Filtrar por colony_id si está presente en los parámetros de consulta
            monitorings = ColonyMonitoring.objects.filter(colony_id=colony_id)
        else:
            # Si no hay un parámetro de consulta, devolver todos los monitoreos
            monitorings = ColonyMonitoring.objects.all()
        
        serializer = ColonyMonitoringSerializer(monitorings, many=True)
        return Response(serializer.data)

    def post(self, request):
        colony = Colony.objects.get(id=request.data['colony'])
        latest_status = ColonyStatusHistory.objects.filter(colony=colony).latest('datetime')
        data_with_status = {
            **request.data,
            "colony_status": latest_status.id  # Solo el ID, en lugar de todo el objeto
        }
        serializer = ColonyMonitoringSerializer(data=data_with_status)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ColonyMonitoringDetail(APIView):
    #permission_classes = [IsAuthenticated]

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

class RegisterUser(generics.CreateAPIView):
    #permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        if username and password:
            user = User.objects.create_user(username=username, password=password)
            return Response({"status": "User created"}, status=status.HTTP_201_CREATED)
        return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
