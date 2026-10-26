from django.urls import path
from .views import TransactionListCreateAPIView, TransactionDetailAPIView, CategoryListAPIView, TransactionReportAPIView


urlpatterns = [
    path("", TransactionListCreateAPIView.as_view(),
         name="transaction-list-create"),

    path("<int:pk>/", TransactionDetailAPIView.as_view(),
         name="transaction-detail"),

    path("categories/", CategoryListAPIView.as_view(),
         name="category-list"),
    path("reports/",TransactionReportAPIView.as_view(),
         name="transaction-reports",
),
]