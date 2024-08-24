from django.db import models

# Tabla Hives
class Hive(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name

# Tabla Colonies
class Colony(models.Model):
    hive = models.ForeignKey(Hive, on_delete=models.CASCADE, related_name='colonies')
    colony_number = models.IntegerField()

    def __str__(self):
        return f'Colony {self.id} in {self.hive.name}'

# Tabla Colony_Status_History
class ColonyStatusHistory(models.Model):
    HEALTH_CHOICES = [
    ('Saludable', 'Saludable'),
    ('Muerta', 'Muerta'),
    ('Débil', 'Débil'),
    ]
    colony = models.ForeignKey(Colony, on_delete=models.CASCADE, related_name='status_history')
    datetime = models.DateTimeField(auto_now_add=True)
    colony_health = models.CharField(max_length=50, choices=HEALTH_CHOICES)
    num_of_bees = models.IntegerField()
    queen_present = models.BooleanField()

    def __str__(self):
        return f'Status on {self.datetime} for {self.colony}'

# Tabla Colony_Monitoring
class ColonyMonitoring(models.Model):
    colony = models.ForeignKey(Colony, on_delete=models.CASCADE, related_name='monitorings')
    datetime = models.DateTimeField()
    colony_temperature = models.FloatField()
    colony_humidity = models.FloatField()
    ambient_temperature = models.FloatField()
    ambient_humidity = models.FloatField()
    weight = models.FloatField()
    colony_status = models.ForeignKey(ColonyStatusHistory, on_delete=models.CASCADE, related_name='monitorings')

    def __str__(self):
        return f'Monitoring on {self.datetime} for {self.colony}'
