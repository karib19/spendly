from django.db import models
from django.conf import settings


class Budget(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="budgets",
    )

    category = models.CharField(max_length=100)

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    month = models.DateField(
        help_text="Use the first day of the budget month, e.g. 2026-10-01",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-month", "category"]

        constraints = [
            models.UniqueConstraint(
                fields=["user", "category", "month"],
                name="unique_user_category_month_budget",
            )
        ]

    def __str__(self):
        return (
            f"{self.user} - {self.category} - "
            f"{self.month:%Y-%m} - {self.amount}"
        )
