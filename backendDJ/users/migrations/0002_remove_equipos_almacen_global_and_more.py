# Generated by Django 5.1.1 on 2024-11-20 04:48

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='equipos',
            name='almacen_global',
        ),
        migrations.AlterField(
            model_name='historialtraspasosequipos',
            name='obra_origen',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='traspasos_origen', to='users.obras'),
        ),
        migrations.DeleteModel(
            name='AlmacenGlobal',
        ),
    ]
