
const STORAGE_KEY = "spendly_notifications";

export function getNotifications() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveNotifications(notifications) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

export function addNotification(notification) {
  const notifications = getNotifications();

  const newNotification = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ...notification,
    read: false,
    createdAt: new Date().toISOString(),
  };

  saveNotifications([newNotification, ...notifications]);

  return newNotification;
}

export function addTransactionNotification(transaction) {
  const isIncome = transaction.transaction_type === "income";

  return addNotification({
    type: "transaction",
    title: isIncome ? "নতুন আয় যোগ হয়েছে" : "নতুন খরচ যোগ হয়েছে",
    message: `${transaction.title} — ৳${Number(
      transaction.amount
    ).toLocaleString("en-BD")}`,
  });
}

export function clearNotifications() {
  localStorage.removeItem(STORAGE_KEY);
}

export function deleteNotification(id) {
  const notifications = getNotifications();
  saveNotifications(
    notifications.filter((notification) => notification.id !== id)
  );
}

export function markNotificationAsRead(id) {
  const notifications = getNotifications();

  saveNotifications(
    notifications.map((notification) =>
      notification.id === id
        ? { ...notification, read: true }
        : notification
    )
  );
}

export function markAllNotificationsAsRead() {
  const notifications = getNotifications();

  saveNotifications(
    notifications.map((notification) => ({
      ...notification,
      read: true,
    }))
  );
}
