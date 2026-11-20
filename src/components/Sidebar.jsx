import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Package,
  Tags,
  // ClipboardList,
  // Users,
  // FileText,
  // Landmark,
  // BarChart2,
  // Megaphone,
  // Percent,
  // Store,
  // CreditCard,
  // ShoppingBag,
  ChevronDown,
  PanelLeftClose,
  X,
} from 'lucide-react';

const MAIN_NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: Home },
  { label: 'Products', to: '/products', icon: Package },
  { label: 'Categories', to: '/categories', icon: Tags },
  // { label: 'Orders', to: '/orders', icon: ClipboardList, badge: 1 },
  // { label: 'Customers', to: '/customers', icon: Users },
  // { label: 'Content', to: '/content', icon: FileText },
  // { label: 'Finances', to: '/finances', icon: Landmark },
  // { label: 'Analytics', to: '/analytics', icon: BarChart2 },
  // { label: 'Marketing', to: '/marketing', icon: Megaphone, hasDropdown: true },
  // { label: 'Discounts', to: '/discounts', icon: Percent },
];

// const SALES_CHANNEL_ITEMS = [
//   { label: 'Online Store', to: '/sales/online-store', icon: Store },
//   { label: 'Point of Sale', to: '/sales/pos', icon: CreditCard },
//   { label: 'Shop', to: '/sales/shop', icon: ShoppingBag },
// ];

export default function Sidebar({
  storeName = 'Biosynthesia',
  mobileOpen = false,
  onCloseMobile,
}) {
  const renderNavLink = (item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        onClick={onCloseMobile}
        className={({ isActive }) =>
          `group flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium transition ${
            isActive
              ? 'bg-white text-slate-900 shadow-2xs ring-1 ring-slate-200/80'
              : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span className="flex items-center gap-2.5">
              <Icon
                className={`h-4 w-4 ${
                  isActive
                    ? 'text-[#6938EF]'
                    : 'text-slate-500 group-hover:text-slate-700'
                }`}
              />
              <span>{item.label}</span>
            </span>

            {item.badge > 0 && (
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                {item.badge}
              </span>
            )}

            {item.hasDropdown && !item.badge && (
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            )}
          </>
        )}
      </NavLink>
    );
  };

  const sidebarContent = (
    <aside className="flex h-full w-60 flex-col border-r border-slate-200/80 bg-[#F8F8FA] select-none">
      {/* Store / Brand Header */}
      <div className="flex h-14 items-center justify-between px-3.5">
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 text-left hover:bg-slate-200/50"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6938EF] text-white shadow-2xs">
            <span className="h-3 w-3 rotate-45 rounded-[2px] border-2 border-white" />
          </span>
          <span className="text-sm font-semibold text-slate-900">
            {storeName}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Toggle sidebar"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
        >
          <PanelLeftClose className="hidden h-4 w-4 lg:block" />
          <X className="h-4 w-4 lg:hidden" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        <div>
          <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            MAIN
          </p>
          <nav className="space-y-0.5">{MAIN_NAV_ITEMS.map(renderNavLink)}</nav>
        </div>

        {/* <div>
          <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            SALES CHANNELS
          </p>
          <nav className="space-y-0.5">
            {SALES_CHANNEL_ITEMS.map(renderNavLink)}
          </nav>
        </div> */}
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden shrink-0 lg:block">{sidebarContent}</div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/30"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 flex h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}