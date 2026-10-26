
from django.urls import path

from .views import BudgetListCreateAPIView, BudgetDetailAPIView


urlpatterns = [
    path(
        "",
        BudgetListCreateAPIView.as_view(),
        name="budget-list-create",
    ),
    path(
        "<int:pk>/",
        BudgetDetailAPIView.as_view(),
        name="budget-detail",
    ),
]
