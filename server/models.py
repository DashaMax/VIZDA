from django.db import models

from vizda.settings import ACTION


class TypeOfSportComplexModel(models.Model):
    title = models.CharField(max_length=128, unique=True, verbose_name='Тип спортивного комплекса')
    slug = models.SlugField(max_length=128, unique=True, verbose_name='Slug')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Тип'
        verbose_name_plural = 'Тип'


class SubjectModel(models.Model):
    title = models.CharField(max_length=128, unique=True, verbose_name='Субъект федерации')
    slug = models.SlugField(max_length=128, unique=True, verbose_name='Slug')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Субъект'
        verbose_name_plural = 'Субъекты'


class ObjectSportModel(models.Model):
    title = models.CharField(max_length=128, verbose_name='Название')
    slug = models.SlugField(max_length=128, unique=True, verbose_name='Slug')
    type_of_sport_complex = models.ForeignKey(to=TypeOfSportComplexModel, on_delete=models.CASCADE, verbose_name='Тип спортивного комплекса')
    short_description = models.TextField(verbose_name='Краткое описание')
    long_description = models.TextField(verbose_name='Детальное описание')
    subject = models.ForeignKey(to=SubjectModel, on_delete=models.CASCADE, verbose_name='Субъект федерации')
    address = models.CharField(max_length=128, verbose_name='Адрес')
    action = models.CharField(choices=ACTION, max_length=32, verbose_name='Действие с объектом')
    oktmo = models.PositiveBigIntegerField(verbose_name='ОКТМО')
    financing = models.PositiveIntegerField(verbose_name='Финансирование')
    date_start = models.DateField(null=True, blank=True, verbose_name='Дата начала')
    date_end = models.DateField(null=True, blank=True, verbose_name='Дата завершения')
    telephone = models.CharField(max_length=32, verbose_name='Телефон курирующего органа')
    email = models.EmailField(max_length=128, verbose_name='Email')
    coordX = models.FloatField(verbose_name='Координата объекта X')
    coordY = models.FloatField(verbose_name='Координата объекта Y')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Спортивный объект'
        verbose_name_plural = 'Спортивные объекты'
