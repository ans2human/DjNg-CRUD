# Generated by Django 2.0.6 on 2018-06-18 06:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='mobileNo',
            field=models.IntegerField(),
        ),
    ]
