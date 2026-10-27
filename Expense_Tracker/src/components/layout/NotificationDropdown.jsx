import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Wallet,
  ArrowLeftRight,
  ShieldCheck,
  CalendarDays,
  X,
} from "lucide-react";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
} from "../../utils/notifications";

const notificationIcons = {
  budget: Wallet,
  transaction: ArrowLeftRight,
  security: ShieldCheck,
  monthly: CalendarDays,
};

export default function NotificationDropdown({ open, onClose }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (open) {
      setNotifications(getNotifications());
    }
  }, [open]);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  function handleMarkRead(id) {
    markNotificationAsRead(id);
    setNotifications(getNotifications());
  }

  function handleMarkAllRead() {
    markAllNotificationsAsRead();
    setNotifications(getNotifications());
  }

  function handleClearAll() {
    clearNotifications();
    setNotifications([]);
  }

  function formatDate(date) {
    return new Date(date).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  if (!open) return null;

  const iconButtonClass =
    "rounded-lg p-2 text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400";

  return (
    <>
      <button
        type="button"
        aria-label="Close notifications"
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-default"
      />

      <section
        aria-label="Notifications"
        className="absolute right-0 top-full z-50 mt-3 flex max-h-[min(80dvh,520px)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 animate-in fade-in slide-in-from-top-2 duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-4 dark:border-slate-800">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Notifications
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {unreadCount} unread
            </p>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                title="Mark all as read"
                aria-label="Mark all as read"
                className={iconButtonClass}
              >
                <CheckCheck size={17} />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close notifications"
              className={iconButtonClass}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {notifications.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Bell size={24} />
              </div>

              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                No notifications yet
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Your updates will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = notificationIcons[notification.type] || Bell;

              return (
                <div
                  key={notification.id}
                  className={`flex gap-3 border-b border-slate-100 px-4 py-3 transition-colors duration-200 dark:border-slate-800 ${
                    notification.isRead
                      ? "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      : "bg-indigo-50/70 dark:bg-indigo-950/20"
                  }`}
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    <Icon size={17} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="wrap-break-words text-sm font-medium text-slate-900 dark:text-white">
                      {notification.title}
                    </p>

                    <p className="mt-1 wrap-break-words text-xs leading-5 text-slate-600 dark:text-slate-400">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>

                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(notification.id)}
                      title="Mark as read"
                      aria-label="Mark as read"
                      className="h-fit shrink-0 rounded-lg p-1.5 text-indigo-600 transition-colors duration-200 hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-indigo-400 dark:hover:bg-slate-800"
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {notifications.length > 0 && (
          <div className="flex shrink-0 justify-end border-t border-slate-100 px-4 py-3 dark:border-slate-800">
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition-colors duration-200 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-slate-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
            >
              <Trash2 size={14} />
              Clear all
            </button>
          </div>
        )}
      </section>
    </>
  );
}