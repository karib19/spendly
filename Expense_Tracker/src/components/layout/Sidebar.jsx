import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Receipt,
  Settings,
  Tags,
  WalletCards,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    label: "Transactions",
    icon: Receipt,
    path: "/transactions",
  },
  {
    label: "Budgets",
    icon: WalletCards,
    path: "/budgets",
  },
  {
    label: "Reports",
    icon: BarChart3,
    path: "/reports",
  },
  {
    label: "Categories",
    icon: Tags,
    path: "/categories",
  },
];

function Sidebar({
  isCollapsed,
  isMobileOpen,
  onClose,
  onMenuToggle,
}) {
  const navLinkClass = ({ isActive }) => `
    group relative flex w-full items-center gap-3
    rounded-xl px-3 py-2.5 text-sm font-medium
    transition-all duration-200 ease-out
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-indigo-500 focus-visible:ring-offset-2
    dark:focus-visible:ring-offset-slate-950
    ${
      isActive
        ? "bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
    }
  `;

  return (
    <>
      {/* Mobile overlay */}
      <button
        type="button"
        aria-label="Close navigation menu"
        aria-hidden={!isMobileOpen}
        tabIndex={isMobileOpen ? 0 : -1}
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm
          transition-opacity duration-300 md:hidden
          ${
            isMobileOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* Sidebar */}
      <aside
        aria-label="Sidebar navigation"
        className={`
          fixed inset-y-0 left-0 z-50 flex h-dvh flex-col
          border-r border-slate-200/80 bg-white
          shadow-xl shadow-slate-900/5
          transition-[width,transform] duration-300 ease-in-out
          dark:border-slate-800 dark:bg-slate-950
          md:shadow-none
          ${isCollapsed ? "md:w-20" : "md:w-64"}
          w-64
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div
          className={`
            flex h-20 shrink-0 items-center border-b
            border-slate-200/80 dark:border-slate-800
            ${
              isCollapsed
                ? "justify-center px-2"
                : "justify-between px-4"
            }
          `}
        >
          <NavLink
            to="/"
            onClick={onClose}
            aria-label="Spendly home"
            className={`
              flex min-w-0 items-center rounded-lg
              text-xl font-bold tracking-tight
              text-slate-950 dark:text-white
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-indigo-500
              ${isCollapsed ? "hidden" : "flex-1"}
            `}
          >
            <span className="mr-2.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/20">
              <WalletCards size={20} strokeWidth={2.2} />
            </span>
            <span className="truncate">Spendly</span>
          </NavLink>

          {/* Desktop collapse */}
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label={
              isCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            title={
              isCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            className="
              hidden h-9 w-9 shrink-0 items-center justify-center
              rounded-lg border border-slate-200 bg-white
              text-slate-500 transition-all duration-200
              hover:border-slate-300 hover:bg-slate-100
              hover:text-slate-900 active:scale-95 md:flex
              dark:border-slate-700 dark:bg-slate-900
              dark:text-slate-400 dark:hover:bg-slate-800
              dark:hover:text-white
            "
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-lg text-slate-500 transition-colors
              hover:bg-slate-100 hover:text-slate-900 md:hidden
              dark:text-slate-400 dark:hover:bg-slate-800
              dark:hover:text-white
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 overflow-y-auto px-3 py-6"
          aria-label="Main navigation"
        >
          <p
            className={`
              mb-3 px-3 text-[10px] font-bold uppercase
              tracking-[0.16em] text-slate-400
              dark:text-slate-500
              ${isCollapsed ? "hidden" : "block"}
            `}
          >
            Menu
          </p>

          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={onClose}
                  title={isCollapsed ? item.label : undefined}
                  aria-label={item.label}
                  className={({ isActive }) => `
                    ${navLinkClass({ isActive })}
                    ${isCollapsed ? "justify-center px-2" : ""}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="
                            absolute left-0 top-1/2 h-6 w-0.75
                            -translate-y-1/2 rounded-r-full
                            bg-indigo-400
                          "
                        />
                      )}

                      <span
                        className={`
                          flex h-9 w-9 shrink-0 items-center
                          justify-center rounded-lg
                          transition-all duration-200
                          ${
                            isActive
                              ? "bg-white/10 dark:bg-slate-900/10"
                              : "bg-transparent group-hover:bg-white dark:group-hover:bg-slate-700"
                          }
                        `}
                      >
                        <Icon
                          size={19}
                          strokeWidth={isActive ? 2.2 : 1.8}
                          className="transition-transform duration-200 group-hover:scale-105"
                        />
                      </span>

                      <span
                        className={`
                          truncate whitespace-nowrap
                          ${isCollapsed ? "hidden" : "block"}
                        `}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Settings */}
        <div className="shrink-0 border-t border-slate-200/80 p-3 dark:border-slate-800">
          <NavLink
            to="/settings"
            onClick={onClose}
            title={isCollapsed ? "Settings" : undefined}
            aria-label="Settings"
            className={({ isActive }) => `
              ${navLinkClass({ isActive })}
              ${isCollapsed ? "justify-center px-2" : ""}
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="
                      absolute left-0 top-1/2 h-6 w-0.75
                      -translate-y-1/2 rounded-r-full bg-indigo-400
                    "
                  />
                )}

                <span
                  className={`
                    flex h-9 w-9 shrink-0 items-center
                    justify-center rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-white/10 dark:bg-slate-900/10"
                        : "group-hover:bg-white dark:group-hover:bg-slate-700"
                    }
                  `}
                >
                  <Settings
                    size={19}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className="transition-transform duration-200 group-hover:rotate-12"
                  />
                </span>

                <span
                  className={isCollapsed ? "hidden" : "block"}
                >
                  Settings
                </span>
              </>
            )}
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
