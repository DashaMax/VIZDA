from rest_framework.generics import ListAPIView, RetrieveAPIView

from api.serializers import ObjectSportSerializer
from server.models import (ObjectSportModel, SubjectModel,
                           TypeOfSportComplexModel)


class ObjectSportListView(ListAPIView):
    queryset = ObjectSportModel.objects.all()
    serializer_class = ObjectSportSerializer


class ObjectSportDetailView(RetrieveAPIView):
    queryset = ObjectSportModel.objects.all()
    serializer_class = ObjectSportSerializer
    lookup_field = 'slug'


class ObjectOfSubjectListView(ListAPIView):
    serializer_class = ObjectSportSerializer

    def get_queryset(self):
        slug = self.kwargs['slug']
        subject = SubjectModel.objects.get(slug=slug)
        return ObjectSportModel.objects.filter(subject=subject)


class TypeOfSportComplexListView(ListAPIView):
    serializer_class = ObjectSportSerializer

    def get_queryset(self):
        slug = self.kwargs['slug']
        type_complex = TypeOfSportComplexModel.objects.get(slug=slug)
        return ObjectSportModel.objects.filter(type_of_sport_complex=type_complex)

