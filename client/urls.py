from django.urls import path

from client.views import (MainPageView, ObjectPageView, SubjectPageView,
                          TypeOfSportComplexPageView)

urlpatterns = [
    path('', MainPageView.as_view(), name='main'),
    path('sport-object/<slug>/', ObjectPageView.as_view(), name='object'),
    path('subject/<slug>/', SubjectPageView.as_view(), name='subject'),
    path('type-of-sport-complex/<slug>/', TypeOfSportComplexPageView.as_view(), name='complex')
]