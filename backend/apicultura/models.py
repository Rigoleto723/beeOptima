from django.db import models

# Tabla Hives
class Hive(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100, blank=True, null=True)  # Opcional

    def __str__(self):
        return self.name

# Tabla Colonies
class Colony(models.Model):
    hive = models.ForeignKey(Hive, on_delete=models.CASCADE, related_name='colonies')
    colony_number = models.IntegerField()
    colony_health = models.CharField(max_length=50)
    num_of_bees = models.IntegerField()
    queen_present = models.BooleanField()

    def __str__(self):
        return f'Colony {self.id} in {self.hive.name}'

# Tabla Colony_Monitoring
class ColonyMonitoring(models.Model):
    colony = models.ForeignKey(Colony, on_delete=models.CASCADE, related_name='monitorings')
    datetime = models.DateTimeField()
    temperature = models.FloatField()
    relative_humidity = models.FloatField()
    apparent_temperature = models.FloatField()
    ambient_temperature = models.FloatField()
    ambient_humidity = models.FloatField()
    temperature_difference = models.FloatField()
    apparent_temperature_difference = models.FloatField()

    def __str__(self):
        return f'Monitoring on {self.datetime} for {self.colony}'

# Tabla Pollen_Production
class PollenProduction(models.Model):
    colony = models.ForeignKey(Colony, on_delete=models.CASCADE, related_name='productions')
    year = models.IntegerField()
    season = models.CharField(max_length=50)
    total_pollen = models.FloatField()  # en kg
    pollen_quality = models.CharField(max_length=50)
    stocks = models.FloatField()  # en kg
    price_per_kg = models.FloatField()
    production_value = models.FloatField()

    def __str__(self):
        return f'Production {self.year} for {self.colony}'
