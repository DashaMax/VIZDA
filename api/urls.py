from django.urls import path

from api.views import (ObjectOfSubjectListView, ObjectSportDetailView,
                       ObjectSportListView, TypeOfSportComplexListView)

urlpatterns = [
    path('sport-objects/', ObjectSportListView.as_view()),
    path('objects-of-subject/<slug>/', ObjectOfSubjectListView.as_view()),
    path('sport-objects/type-of-sport-complex/<slug>/', TypeOfSportComplexListView.as_view()),
    path('sport-object/<slug>/', ObjectSportDetailView.as_view()),
]