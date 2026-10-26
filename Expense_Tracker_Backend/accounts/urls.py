from django.urls import path
from .views import RegisterAPIView, LoginAPIView, MeAPIView
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView


urlpatterns = [
    path("register/",RegisterAPIView.as_view(),name="register",),
    path("login/",LoginAPIView.as_view(),name="login",),
    path("token/refresh/",TokenRefreshView.as_view(),name="token_refresh",),
    path("me/",MeAPIView.as_view(),name="me",),
    path("logout/", TokenBlacklistView.as_view(), name="logout"),
]
