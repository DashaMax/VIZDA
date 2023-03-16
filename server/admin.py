from django.contrib import admin

from server.models import (ObjectSportModel, SubjectModel,
                           TypeOfSportComplexModel)


@admin.register(TypeOfSportComplexModel)
class TypeOfSportComplexAdmin(admin.ModelAdmin):
    list_display = ('title',)

@admin.register(SubjectModel)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug')

@admin.register(ObjectSportModel)
class ObjectSportAdmin(admin.ModelAdmin):
    list_display = ('title', 'type_of_sport_complex', 'subject', 'action', 'oktmo', 'financing')
