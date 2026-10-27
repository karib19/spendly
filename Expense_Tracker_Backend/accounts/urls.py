from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenBlacklistView,
)

from .views import (
    RegisterAPIView,
    LoginAPIView,
    MeAPIView,
    PasswordChangeAPIView,
    AccountDeleteAPIView,
)

urlpatterns = [
    path("register/", RegisterAPIView.as_view(), name="register"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", MeAPIView.as_view(), name="me"),
    path("password/change/", PasswordChangeAPIView.as_view(), name="password_change"),
    path("delete/", AccountDeleteAPIView.as_view(), name="account_delete"),
    path("logout/", TokenBlacklistView.as_view(), name="logout"),
]
