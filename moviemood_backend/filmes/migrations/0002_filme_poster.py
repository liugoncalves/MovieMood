# Generated by Django 5.2.1 on 2025-05-23 03:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('filmes', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='filme',
            name='poster',
            field=models.ImageField(blank=True, null=True, upload_to='posters/'),
        ),
    ]
