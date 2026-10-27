
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import MobileNav from "./components/layout/MobileNav";
import PageContainer from "./components/layout/PageContainer";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Reports from "./pages/Reports";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import TransactionForm from "./components/transactions/TransactionForm";
import ConfirmDialog from "./components/common/ConfirmDialog";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import { useExpense } from "./context/ExpenseContext";

function App() {
  const { deleteTransaction, settings } = useExpense();
  const location = useLocation();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const isAuthPage = ["/login", "/register"].includes(
    location.pathname
  );

  // Apply the selected theme.
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      settings.theme === "dark"
    );
  }, [settings.theme]);

  // Sidebar controls.
  const handleMenuToggle = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  // Add transaction.
  const openTransactionForm = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  // Edit transaction.
  const openEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const closeTransactionForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  // Delete transaction.
  const openDeleteConfirmation = (transaction) => {
    setTransactionToDelete(transaction);
  };

  const closeDeleteConfirmation = () => {
    setTransactionToDelete(null);
  };

  const confirmDeleteTransaction = () => {
    if (!transactionToDelete) return;

    deleteTransaction(transactionToDelete.id);
    setTransactionToDelete(null);
  };

  const deleteTitle =
    transactionToDelete?.title?.trim() || "Untitled";

  const deleteMessage = transactionToDelete
    ? `Are you sure you want to delete "${deleteTitle}"? This action cannot be undone.`
    : "";

  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        text-slate-900
        transition-colors duration-200
        dark:bg-slate-950
        dark:text-slate-100
      "
    >
      {isAuthPage ? (
        // Public authentication pages.
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      ) : (
        // Main application layout.
        <>
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onMenuToggle={handleMenuToggle}
          />

          <Navbar isSidebarCollapsed={isSidebarCollapsed} />

          <PageContainer sidebarCollapsed={isSidebarCollapsed}>
            <Routes>
              {/* All application pages require authentication. */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/"
                  element={
                    <Dashboard
                      onAddTransaction={openTransactionForm}
                      onEditTransaction={openEditTransaction}
                      onDeleteTransaction={openDeleteConfirmation}
                    />
                  }
                />

                <Route
                  path="/transactions"
                  element={
                    <Transactions
                      onAddTransaction={openTransactionForm}
                      onEditTransaction={openEditTransaction}
                      onDeleteTransaction={openDeleteConfirmation}
                    />
                  }
                />

                <Route path="/budgets" element={<Budgets />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              {/* Unknown paths return to the dashboard route. */}
              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />
            </Routes>
          </PageContainer>

          <MobileNav onAddTransaction={openTransactionForm} />

          <TransactionForm
            isOpen={isFormOpen}
            onClose={closeTransactionForm}
            editingTransaction={editingTransaction}
          />

          <ConfirmDialog
            isOpen={Boolean(transactionToDelete)}
            title="Delete transaction"
            message={deleteMessage}
            onCancel={closeDeleteConfirmation}
            onConfirm={confirmDeleteTransaction}
          />
        </>
      )}
    </div>
  );
}

export default App;
