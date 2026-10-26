from rest_framework import serializers
from .models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = [
            "id",
            "user",
            "category",
            "amount",
            "month",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "user",
            "created_at",
            "updated_at",
        ]

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Budget amount must be greater than zero."
            )

        return value

    def validate_month(self, value):
        if value.day != 1:
            raise serializers.ValidationError(
                "Month must be the first day of the month."
            )

        return value
