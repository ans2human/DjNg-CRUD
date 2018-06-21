from django.db import models



class Employee(models.Model):
    name = models.CharField(max_length=32)
    mobileNo = models.IntegerField()
    position = models.CharField(max_length=32)
    objects = models.Manager()


    def __str__(self):
        return self.name

