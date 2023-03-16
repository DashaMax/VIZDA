from csv import DictReader

from django.core.management import BaseCommand
from django.db.models.functions import datetime
from pytils.translit import slugify

from server.models import (ObjectSportModel, SubjectModel,
                           TypeOfSportComplexModel)


class Command(BaseCommand):
    def handle(self, *args, **options):
        with open('data.csv') as file:
            for row in DictReader(file):
                if row['Тип спортивного комплекса:'] not in [x.title for x in TypeOfSportComplexModel.objects.all()]:
                    object_ = TypeOfSportComplexModel(title=row['Тип спортивного комплекса:'],
                                                      slug=slugify(row['Тип спортивного комплекса:']))
                    object_.save()

                if row['Субъект федерации:'] not in [x.title for x in SubjectModel.objects.all()]:
                    object_ = SubjectModel(title=row['Субъект федерации:'],
                                           slug=slugify(row['Субъект федерации:']))
                    object_.save()

        with open('data.csv') as file:
            i = 0
            for row in DictReader(file):
                if row['Название:']:
                    i += 1

                    if row['Название (in english):']:
                        row['Название (in english):'] = slugify(row['Название (in english):'] + '-' + str(i))
                    else:
                        row['Название (in english):'] = slugify('object-' + str(i))

                    if not row['Яндекс координата объекта X:']:
                        row['Яндекс координата объекта X:'] = 0

                    if not row['Яндекс координата объекта Y:']:
                        row['Яндекс координата объекта Y:'] = 0

                    if not row['ОКТМО:']:
                        row['ОКТМО:'] = 0

                    if not row['Общий объём финансирования:']:
                        row['Общий объём финансирования:'] = 0

                    if row['Дата начала строительства / реконструкции:']:
                        row['Дата начала строительства / реконструкции:'] = datetime.datetime.strptime(row['Дата начала строительства / реконструкции:'], '%d.%m.%Y').date()
                    else:
                        row['Дата начала строительства / реконструкции:'] = None

                    if row['Дата завершения строительства / реконструкции:']:
                        row['Дата завершения строительства / реконструкции:'] = datetime.datetime.strptime(row['Дата завершения строительства / реконструкции:'], '%d.%m.%Y').date()
                    else:
                        row['Дата завершения строительства / реконструкции:'] = None

                    object_ = ObjectSportModel(title=row['Название:'],
                                               slug=row['Название (in english):'],
                                               type_of_sport_complex=TypeOfSportComplexModel.objects.get(title=row['Тип спортивного комплекса:']),
                                               short_description=row['Краткое описание:'],
                                               long_description=row['Детальное описание:'],
                                               subject=SubjectModel.objects.get(title=row['Субъект федерации:']),
                                               address=row['Адрес:'],
                                               action=row['Действия с объектом:'],
                                               oktmo=row['ОКТМО:'],
                                               financing=row['Общий объём финансирования:'],
                                               date_start=row['Дата начала строительства / реконструкции:'],
                                               date_end=row['Дата завершения строительства / реконструкции:'],
                                               telephone=row['Телефон курирующего органа:'],
                                               email=row['E-mail:'],
                                               coordX=row['Яндекс координата объекта X:'],
                                               coordY=row['Яндекс координата объекта Y:'])
                    object_.save()
