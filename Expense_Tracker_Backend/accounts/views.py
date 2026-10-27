
from django.contrib.auth import update_session_auth_hash
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    PasswordChangeSerializer,
    CustomTokenObtainPairSerializer,
)


class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class LoginAPIView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


class MeAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class PasswordChangeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)

        user = request.user
        user.set_password(
            serializer.validated_data["new_password"]
        )
        user.save(update_fields=["password"])

        update_session_auth_hash(request, user)

        return Response(
            {"detail": "Password changed successfully."},
            status=status.HTTP_200_OK,
        )


class AccountDeleteAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
