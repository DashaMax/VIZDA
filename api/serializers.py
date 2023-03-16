from rest_framework import serializers

from server.models import (ObjectSportModel, SubjectModel,
                           TypeOfSportComplexModel)


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubjectModel
        fields = '__all__'


class TypeOfSportComplexSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeOfSportComplexModel
        fields = '__all__'


class ObjectSportSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer(read_only=True)
    type_of_sport_complex = TypeOfSportComplexSerializer(read_only=True)

    class Meta:
        model = ObjectSportModel
        fields = '__all__'
        lookup_field = 'slug'
        extra_kwargs = {
            'url': {'lookup_field': 'slug'},
        }