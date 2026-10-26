from django.db import models
from django.conf import settings
from django.utils import timezone


class Transaction(models.Model):

    class TransactionType(models.TextChoices):
        INCOME = "income", "Income"
        EXPENSE = "expense", "Expense"

    class PaymentMethod(models.TextChoices):
        CASH = "cash", "Cash"
        CARD = "card", "Card"
        BANK = "bank", "Bank Transfer"
        MOBILE_BANKING = "mobile_banking", "Mobile Banking"
        OTHER = "other", "Other"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transactions",
    )

    title = models.CharField(max_length=150)

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    transaction_type = models.CharField(
        max_length=10,
        choices=TransactionType.choices,
    )

    category = models.CharField(max_length=100)

    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        default=PaymentMethod.CASH,
    )

    date = models.DateField(default=timezone.localdate)

    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.title} - {self.amount}"
