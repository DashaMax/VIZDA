from django.views.generic import TemplateView

from server.models import (ObjectSportModel, SubjectModel,
                           TypeOfSportComplexModel)


class MainPageView(TemplateView):
    template_name = 'client/index.html'
    extra_context = {
        'title': 'VIZDA - Спортивные объекты'
    }


class ObjectPageView(TemplateView):
    template_name = 'client/object.html'

    def get_context_data(self, **kwargs):
        context = super(ObjectPageView, self).get_context_data(**kwargs)
        context['data'] = ObjectSportModel.objects.get(slug=kwargs['slug'])
        return context


class SubjectPageView(TemplateView):
    template_name = 'client/subject.html'

    def get_context_data(self, **kwargs):
        context = super(SubjectPageView, self).get_context_data(**kwargs)
        subject = SubjectModel.objects.get(slug=kwargs['slug'])
        context['title'] = subject.title
        return context


class TypeOfSportComplexPageView(TemplateView):
    template_name = 'client/complex.html'

    def get_context_data(self, **kwargs):
        context = super(TypeOfSportComplexPageView, self).get_context_data(**kwargs)
        type_of_complex = TypeOfSportComplexModel.objects.get(slug=kwargs['slug'])
        context['title'] = type_of_complex.title
        return context