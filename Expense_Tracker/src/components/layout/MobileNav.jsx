
import {
  BarChart3,
  LayoutDashboard,
  Plus,
  Receipt,
  Settings,
  Wallet,
  Tags,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Transactions",
    path: "/transactions",
    icon: Receipt,
  },
  {
    label: "Budgets",
    path: "/budgets",
    icon: Wallet,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
  {
    label: "Categories",
    path: "/categories",
    icon: Tags,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function MobileNav({ onAddTransaction }) {
  const navLinkClass = ({ isActive }) => `
    group relative flex min-w-0 flex-1 flex-col
    items-center justify-center gap-1 rounded-xl
    px-0.5 py-1.5 text-[9px] font-medium
    transition-colors duration-200
    xs:text-[10px]
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-indigo-500
    ${
      isActive
        ? "text-slate-950 dark:text-white"
        : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
    }
  `;

  const renderNavItem = (item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.end}
        className={navLinkClass}
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <span
                aria-hidden="true"
                className="
                  absolute -top-2 h-0.5 w-5
                  rounded-full bg-indigo-600
                  dark:bg-indigo-400
                "
              />
            )}

            <Icon
              size={19}
              strokeWidth={isActive ? 2.2 : 1.8}
              className="shrink-0 transition-transform duration-200 group-hover:scale-105"
            />

            <span className="w-full truncate text-center">
              {item.label}
            </span>
          </>
        )}
      </NavLink>
    );
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="
        fixed inset-x-0 bottom-0 z-40 border-t
        border-slate-200/90 bg-white/95 px-1 pt-2
        shadow-[0_-8px_30px_rgba(15,23,42,0.06)]
        backdrop-blur-xl dark:border-slate-800/90
        dark:bg-slate-950/95
        dark:shadow-[0_-8px_30px_rgba(0,0,0,0.18)]
        md:hidden
      "
      style={{
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="mx-auto flex max-w-lg items-end justify-between gap-0.5">
        {renderNavItem(menuItems[0])}
        {renderNavItem(menuItems[1])}
        {renderNavItem(menuItems[2])}

        {/* Add transaction button */}
        <div className="flex flex-1 justify-center">
          <button
            type="button"
            onClick={onAddTransaction}
            aria-label="Add transaction"
            title="Add transaction"
            className="
              -mt-7 flex h-12 w-12 shrink-0
              items-center justify-center rounded-full
              border-4 border-white bg-indigo-600
              text-white shadow-[0_8px_25px_rgba(79,70,229,0.28)]
              transition-all duration-200
              hover:-translate-y-0.5 hover:bg-indigo-700
              active:scale-90
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-indigo-500 focus-visible:ring-offset-2
              dark:border-slate-950 dark:bg-indigo-500
              dark:hover:bg-indigo-400
              dark:focus-visible:ring-offset-slate-950
            "
          >
            <Plus size={23} strokeWidth={2.2} />
          </button>
        </div>

        {renderNavItem(menuItems[3])}
        {renderNavItem(menuItems[4])}
        {renderNavItem(menuItems[5])}
      </div>
    </nav>
  );
}

export default MobileNav;
