
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

    def validate_email(self, value):
        value = value.strip()

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]
        read_only_fields = ["id"]

    def validate_email(self, value):
        value = value.strip()

        existing_users = User.objects.filter(
            email__iexact=value
        ).exclude(pk=self.instance.pk)

        if existing_users.exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value


class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(
        write_only=True,
        trim_whitespace=False,
    )
    new_password = serializers.CharField(
        write_only=True,
        min_length=8,
        trim_whitespace=False,
    )

    def validate_current_password(self, value):
        user = self.context["request"].user

        if not user.check_password(value):
            raise serializers.ValidationError(
                "Current password is incorrect."
            )

        return value

    def validate_new_password(self, value):
        from django.contrib.auth.password_validation import (
            validate_password,
        )

        validate_password(value, self.context["request"].user)
        return value


class CustomTokenObtainPairSerializer(
    TokenObtainPairSerializer
):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data
