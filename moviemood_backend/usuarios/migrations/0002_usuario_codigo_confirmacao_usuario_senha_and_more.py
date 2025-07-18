# Generated by Django 5.2.1 on 2025-05-13 21:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='usuario',
            name='codigo_confirmacao',
            field=models.CharField(blank=True, max_length=36, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='usuario',
            name='senha',
            field=models.CharField(default=1, max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='usuario',
            name='nome',
            field=models.CharField(max_length=255),
        ),
    ]
