from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/courses/', include('courses.urls')),
    path('api/chatbot/', include('chatbot.urls')),
    path('create-order/', views.create_order),
    path('verify-payment/', views.verify_payment),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)