import { Bell, Search, X, LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import NotificationDropdown from "./NotificationDropdown";
import { getNotifications } from "../../utils/notifications";

function Navbar({ isSidebarCollapsed }) {
  const navigate = useNavigate();

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(
    () => getNotifications().filter((notification) => !notification.isRead).length
  );

  const refreshUnreadCount = () => {
    setUnreadCount(
      getNotifications().filter((notification) => !notification.isRead).length
    );
  };

  const handleNotificationToggle = () => {
    if (notificationsOpen) {
      setNotificationsOpen(false);
      refreshUnreadCount();
      return;
    }

    refreshUnreadCount();
    setNotificationsOpen(true);
  };

  const handleNotificationClose = () => {
    setNotificationsOpen(false);
    refreshUnreadCount();
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    const refreshToken = localStorage.getItem("spendly_refresh");

    try {
      if (refreshToken) {
        await api.post("/accounts/logout/", {
          refresh: refreshToken,
        });
      }
    } catch (error) {
      console.error("Logout API request failed:", error);
    } finally {
      localStorage.removeItem("spendly_access");
      localStorage.removeItem("spendly_refresh");
      setIsLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  const searchPlaceholder = "Search transactions...";

  const iconButtonClass = `
    relative flex h-10 w-10 shrink-0 items-center justify-center
    rounded-xl text-slate-500
    transition-colors duration-200
    hover:bg-slate-100 hover:text-slate-900
    active:scale-95
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-indigo-500
    dark:text-slate-400 dark:hover:bg-slate-800
    dark:hover:text-white
  `;

  const searchInputClass = `
    w-full rounded-xl border border-slate-200
    bg-slate-50 py-2.5 pl-10 pr-4 text-sm
    text-slate-900 outline-none
    transition-all duration-200
    placeholder:text-slate-400
    hover:border-slate-300 hover:bg-white
    focus:border-indigo-400 focus:bg-white
    focus:ring-4 focus:ring-indigo-500/10
    dark:border-slate-700 dark:bg-slate-900
    dark:text-white dark:placeholder:text-slate-500
    dark:hover:border-slate-600 dark:hover:bg-slate-800
    dark:focus:border-indigo-400 dark:focus:bg-slate-800
  `;

  const renderSearchIcon = () => (
    <Search
      size={18}
      strokeWidth={1.9}
      className="
        pointer-events-none absolute left-3.5 top-1/2
        -translate-y-1/2 text-slate-400
      "
    />
  );

  return (
    <header
      className={`
        sticky top-0 z-30 flex h-20 min-w-0 items-center gap-3
        border-b border-slate-200/80 bg-white/90 px-4
        backdrop-blur-xl transition-[margin] duration-300
        dark:border-slate-800 dark:bg-slate-950/90
        md:px-6
        ${isSidebarCollapsed ? "md:ml-20" : "md:ml-64"}
      `}
    >
      {/* Desktop and tablet search */}
      <div className="relative hidden min-w-0 flex-1 sm:block">
        <div className="relative max-w-2xl">
          {renderSearchIcon()}
          <input
            type="search"
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className={searchInputClass}
          />
        </div>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden">
        {isMobileSearchOpen ? (
          <div
            className="
              fixed inset-x-0 top-0 z-50 flex h-20 items-center
              gap-2 border-b border-slate-200 bg-white px-4
              shadow-sm dark:border-slate-800 dark:bg-slate-950
            "
          >
            <div className="relative min-w-0 flex-1">
              {renderSearchIcon()}
              <input
                type="search"
                autoFocus
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className={searchInputClass}
              />
            </div>

            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              className={iconButtonClass}
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(true)}
            aria-label={searchPlaceholder}
            className={iconButtonClass}
          >
            <Search size={21} strokeWidth={1.9} />
          </button>
        )}
      </div>

      {/* Right-side actions */}
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={handleNotificationToggle}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            className={iconButtonClass}
          >
            <Bell size={19} strokeWidth={1.9} />

            {unreadCount > 0 && (
              <span
                aria-label={`${unreadCount} unread notifications`}
                className="
                  absolute -right-0.5 -top-0.5 flex h-5 min-w-5
                  items-center justify-center rounded-full
                  bg-rose-500 px-1 text-[10px] font-semibold
                  text-white ring-2 ring-white
                  dark:ring-slate-950
                "
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          <NotificationDropdown
            open={notificationsOpen}
            onClose={handleNotificationClose}
          />
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="hidden h-7 w-px bg-slate-200 sm:block dark:bg-slate-800"
        />

        {/* Profile */}
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className={iconButtonClass}
          title="My Profile"
          aria-label="My Profile"
        >
          <UserRound size={20} />
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="
            flex h-10 items-center justify-center gap-2 rounded-xl
            px-2.5 text-sm font-medium text-red-600
            transition-all duration-200
            hover:bg-red-50 active:scale-95
            disabled:cursor-not-allowed disabled:opacity-60
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-red-500
            dark:text-red-400 dark:hover:bg-red-950/50
            sm:px-3
          "
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={18} strokeWidth={2} />
          <span className="hidden sm:inline">
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
