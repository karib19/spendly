
import { Bell, Search, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import { useLanguage } from "../../context/LanguageContext";

function Navbar({ isSidebarCollapsed }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const logoutButtonClass = `
    flex
    h-10
    items-center
    justify-center
    gap-2
    rounded-xl
    px-3
    text-sm
    font-medium
    text-red-600
    transition-all
    duration-200
    hover:bg-red-50
    active:scale-95
    disabled:cursor-not-allowed
    disabled:opacity-60
    dark:text-red-400
    dark:hover:bg-red-950/50
  `;

  return (
    <header
      className={`
        sticky
        top-0
        z-30
        flex
        h-20
        items-center
        gap-3
        border-b
        border-slate-200/90
        bg-white/90
        px-4
        backdrop-blur-xl
        transition-all
        duration-300
        dark:border-slate-800/90
        dark:bg-slate-950/90
        md:px-6
        ${isSidebarCollapsed ? "md:ml-20" : "md:ml-64"}
      `}
    >
      {/* Desktop + Tablet Search */}
      <div className="relative hidden min-w-0 flex-1 sm:block">
        <Search
          size={18}
          strokeWidth={1.9}
          className="
            pointer-events-none
            absolute
            left-3.5
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />

        <input
          type="search"
          placeholder={t("transactions.searchPlaceholder")}
          aria-label={t("transactions.searchPlaceholder")}
          className="
            w-full
            max-w-2xl
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            py-2.5
            pl-10
            pr-4
            text-sm
            text-slate-900
            outline-none
            transition-all
            duration-200
            placeholder:text-slate-400
            hover:border-slate-300
            hover:bg-white
            focus:border-slate-400
            focus:bg-white
            focus:ring-4
            focus:ring-slate-900/5
            dark:border-slate-700
            dark:bg-slate-900
            dark:text-white
            dark:hover:border-slate-600
            dark:hover:bg-slate-800
            dark:focus:border-slate-500
            dark:focus:bg-slate-800
            dark:focus:ring-white/5
          "
        />
      </div>

      {/* Mobile Search */}
      <div className="sm:hidden">
        {isMobileSearchOpen ? (
          <div
            className="
              fixed
              inset-x-0
              top-0
              z-50
              flex
              h-20
              items-center
              gap-2
              border-b
              border-slate-200
              bg-white
              px-4
              dark:border-slate-800
              dark:bg-slate-950
            "
          >
            <div className="relative flex-1">
              <Search
                size={18}
                strokeWidth={1.9}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="search"
                autoFocus
                placeholder={t("transactions.searchPlaceholder")}
                aria-label={t("transactions.searchPlaceholder")}
                className="
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  py-2.5
                  pl-10
                  pr-4
                  text-sm
                  text-slate-900
                  outline-none
                  focus:border-slate-400
                  focus:ring-4
                  focus:ring-slate-900/5
                  dark:border-slate-700
                  dark:bg-slate-900
                  dark:text-white
                "
              />
            </div>

            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                text-slate-500
                hover:bg-slate-100
                hover:text-slate-900
                dark:text-slate-400
                dark:hover:bg-slate-800
                dark:hover:text-white
              "
              aria-label="Close search"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(true)}
            aria-label={t("transactions.searchPlaceholder")}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition-all
              duration-200
              hover:bg-slate-100
              hover:text-slate-900
              active:scale-95
              dark:text-slate-400
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
          >
            <Search size={21} strokeWidth={1.9} />
          </button>
        )}
      </div>

      {/* Right Actions */}
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-3">
        {/* Notifications */}
        <button
          type="button"
          className="
            relative
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            text-slate-500
            transition-all
            duration-200
            hover:bg-slate-100
            hover:text-slate-900
            active:scale-95
            dark:text-slate-400
            dark:hover:bg-slate-800
            dark:hover:text-white
          "
          aria-label="Notifications"
        >
          <Bell size={19} strokeWidth={1.9} />

          <span
            className="
              absolute
              right-2.5
              top-2.5
              h-1.5
              w-1.5
              rounded-full
              bg-rose-500
              ring-2
              ring-white
              dark:ring-slate-950
            "
          />
        </button>

        {/* Divider */}
        <div
          className="
            hidden
            h-7
            w-px
            bg-slate-200
            sm:block
            dark:bg-slate-800
          "
        />

        {/* Avatar */}
        <button
          type="button"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-slate-900
            text-sm
            font-bold
            text-white
            shadow-sm
            ring-2
            ring-transparent
            transition-all
            duration-200
            hover:scale-105
            hover:ring-slate-200
            active:scale-95
            dark:bg-slate-100
            dark:text-slate-900
            dark:hover:ring-slate-700
          "
          aria-label="Profile"
        >
          K
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={logoutButtonClass}
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
