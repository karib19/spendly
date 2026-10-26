from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Transaction
from .serializers import TransactionSerializer
from .categories import INCOME_CATEGORIES, EXPENSE_CATEGORIES
from decimal import Decimal
from django.db.models import Sum
from django.db.models.functions import TruncMonth


class TransactionListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(
            user=self.request.user
        ).order_by("-date", "-created_at")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(
            user=self.request.user
        )



class CategoryListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        category_type = request.query_params.get(
            "type", "expense"
        )

        if category_type == "income":
            categories = INCOME_CATEGORIES

        elif category_type == "expense":
            categories = EXPENSE_CATEGORIES

        else:
            return Response(
                {
                    "error": (
                        "Invalid type. Use 'income' or 'expense'."
                    )
                },
                status=400,
            )

        return Response({
            "type": category_type,
            "categories": categories,
        })



class TransactionReportAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(
            user=request.user
        )

        income_total = (
            transactions.filter(
                transaction_type="income"
            ).aggregate(total=Sum("amount"))["total"]
            or Decimal("0.00")
        )

        expense_total = (
            transactions.filter(
                transaction_type="expense"
            ).aggregate(total=Sum("amount"))["total"]
            or Decimal("0.00")
        )

        balance = income_total - expense_total

        category_spending = (
            transactions.filter(
                transaction_type="expense"
            )
            .values("category")
            .annotate(total=Sum("amount"))
            .order_by("-total")
        )

        monthly_trends = (
            transactions.annotate(
                month=TruncMonth("date")
            )
            .values("month", "transaction_type")
            .annotate(total=Sum("amount"))
            .order_by("month")
        )

        return Response({
            "total_income": income_total,
            "total_expenses": expense_total,
            "balance": balance,
            "spending_by_category": [
                {
                    "category": item["category"],
                    "total": item["total"],
                }
                for item in category_spending
            ],
            "monthly_trends": [
                {
                    "month": item["month"].strftime("%Y-%m"),
                    "type": item["transaction_type"],
                    "total": item["total"],
                }
                for item in monthly_trends
            ],
        })
