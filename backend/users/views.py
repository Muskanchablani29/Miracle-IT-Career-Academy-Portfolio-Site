from rest_framework import generics, permissions
from .models import CustomUser, Category, Course
from .serializers import RegisterSerializer, UserSerializer, CategorySerializer, CourseSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import viewsets

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class ProfileView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        category_id = self.request.query_params.get('category', None)
        if category_id is not None:
            return self.queryset.filter(category_id=category_id)
        return self.queryset
