import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Eye,
  MoreVertical,
  Package,
  DollarSign,
  ShoppingCart,
  Tags,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const CATEGORY_COLORS = [
  '#6938EF',
  '#10B981',
  '#F59E0B',
  '#3B82F6',
  '#EC4899',
  '#8B5CF6',
];

export default function DashboardPage({
  products = [],
  categories = [],
  onNavigateToProducts,
  onViewProduct,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [chartMetric, setChartMetric] = useState('revenue');
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  const totalProductsCount = products.length;
  const totalRevenue = products.reduce(
    (sum, p) => sum + Number(p.price || 0) * (Number(p.ordersCount) || 0),
    0
  );
  const totalOrders = products.reduce(
    (sum, p) => sum + (Number(p.ordersCount) || 0),
    0
  );

  const totalCategoriesCount = useMemo(() => {
    if (categories.length > 0) return categories.length;
    return new Set(products.map((p) => p.category).filter(Boolean)).size;
  }, [categories, products]);

  const kpiCards = [
    {
      title: 'TOTAL PRODUCTS',
      value: totalProductsCount.toLocaleString(),
      delta: '+4.2%',
      positive: true,
      icon: Package,
    },
    {
      title: 'TOTAL REVENUE',
      value: `$${totalRevenue.toLocaleString('en-US', {
        maximumFractionDigits: 0,
      })}`,
      delta: '+12.5%',
      positive: true,
      icon: DollarSign,
    },
    {
      title: 'TOTAL ORDERS',
      value: totalOrders.toLocaleString(),
      delta: '-1.4%',
      positive: false,
      icon: ShoppingCart,
    },
    {
      title: 'TOTAL CATEGORIES',
      value: totalCategoriesCount.toLocaleString(),
      delta: '+2.1%',
      positive: true,
      icon: Tags,
    },
  ];

  // 7-Day Performance Series scaled from live store totals
  const weeklySeries = useMemo(() => {
    const baseRevenue = Math.max(totalRevenue, 14000);
    const baseOrders = Math.max(totalOrders, 140);
    const weights = [0.11, 0.14, 0.12, 0.16, 0.15, 0.18, 0.14];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return days.map((day, idx) => ({
      day,
      revenue: Math.round(baseRevenue * weights[idx]),
      orders: Math.max(1, Math.round(baseOrders * weights[idx])),
    }));
  }, [totalRevenue, totalOrders]);

  const maxChartValue = useMemo(() => {
    const values = weeklySeries.map((d) =>
      chartMetric === 'revenue' ? d.revenue : d.orders
    );
    return Math.max(...values, 1);
  }, [weeklySeries, chartMetric]);

  // Live Category Distribution for Donut Chart
  const categoryBreakdown = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const cat = p.category || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const entries = Object.entries(counts)
      .map(([name, count], idx) => ({
        name,
        count,
        percentage:
          totalProductsCount > 0
            ? Math.round((count / totalProductsCount) * 100)
            : 0,
        color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
      }))
      .sort((a, b) => b.count - a.count);

    return entries;
  }, [products, totalProductsCount]);

  // SVG Donut Circle Segments
  const donutSegments = useMemo(() => {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    let cumulativePercent = 0;

    return categoryBreakdown.map((item) => {
      const fraction =
        totalProductsCount > 0 ? item.count / totalProductsCount : 0;
      const strokeDasharray = `${fraction * circumference} ${circumference}`;
      const strokeDashoffset = -cumulativePercent * circumference;
      cumulativePercent += fraction;

      return {
        ...item,
        radius,
        strokeDasharray,
        strokeDashoffset,
      };
    });
  }, [categoryBreakdown, totalProductsCount]);

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const allVisibleSelected =
    recentProducts.length > 0 &&
    recentProducts.every((p) => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(recentProducts.map((p) => p.id));
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Overview of your store performance, inventory, and recent listings
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToProducts}
          className="inline-flex items-center gap-1.5 self-start rounded-lg bg-[#6938EF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5925DC]"
        >
          Manage Products
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const TrendIcon = card.positive ? TrendingUp : TrendingDown;
          return (
            <div
              key={card.title}
              className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  <Icon className="h-3.5 w-3.5 text-slate-400" />
                  {card.title}
                </span>
                <MoreVertical className="h-4 w-4 text-slate-400" />
              </div>

              <div className="mt-3 text-2xl font-bold text-slate-900">
                {card.value}
              </div>

              <div className="mt-2.5 flex items-center justify-between text-xs">
                <span
                  className={`inline-flex items-center gap-1 font-medium ${
                    card.positive ? 'text-emerald-600' : 'text-rose-500'
                  }`}
                >
                  <TrendIcon className="h-3.5 w-3.5" />
                  {card.delta}
                </span>
                <span className="text-slate-400">Last 7 days</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Graphs Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* 7-Day Revenue / Orders Bar Chart (2 Columns) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Performance Overview
              </h3>
              <p className="text-xs text-slate-500">
                Daily {chartMetric === 'revenue' ? 'revenue' : 'orders'} trend
                across the last 7 days
              </p>
            </div>

            <div className="inline-flex self-start rounded-lg border border-slate-200 bg-slate-100/80 p-1">
              <button
                type="button"
                onClick={() => setChartMetric('revenue')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  chartMetric === 'revenue'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Revenue
              </button>
              <button
                type="button"
                onClick={() => setChartMetric('orders')}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  chartMetric === 'orders'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Orders
              </button>
            </div>
          </div>

          {/* Bar Chart Area */}
          <div className="mt-6">
            <div className="relative flex h-52 items-end justify-between gap-3 border-b border-slate-200/80 px-2 pb-2">
              {/* Subtle Horizontal Grid Lines */}
              <div className="pointer-events-none absolute inset-x-0 top-0 flex h-full flex-col justify-between pb-2">
                <div className="border-t border-dashed border-slate-100" />
                <div className="border-t border-dashed border-slate-100" />
                <div className="border-t border-dashed border-slate-100" />
                <div className="border-t border-dashed border-slate-100" />
              </div>

              {weeklySeries.map((item, idx) => {
                const rawVal =
                  chartMetric === 'revenue' ? item.revenue : item.orders;
                const heightPercent = Math.max(
                  12,
                  Math.round((rawVal / maxChartValue) * 100)
                );
                const isHovered = hoveredBarIndex === idx;
                const formattedLabel =
                  chartMetric === 'revenue'
                    ? `$${rawVal.toLocaleString()}`
                    : `${rawVal.toLocaleString()} orders`;

                return (
                  <div
                    key={item.day}
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                    className="relative z-10 flex h-full flex-1 flex-col items-center justify-end"
                  >
                    {/* Hover Tooltip */}
                    {isHovered && (
                      <div className="mb-2 rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium whitespace-nowrap text-white shadow-sm">
                        {formattedLabel}
                      </div>
                    )}

                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-10 rounded-t-lg transition-all duration-200 ${
                        isHovered || idx === 5
                          ? 'bg-[#6938EF]'
                          : 'bg-[#6938EF]/20 hover:bg-[#6938EF]/80'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-Axis Labels */}
            <div className="mt-2.5 flex items-center justify-between px-2">
              {weeklySeries.map((item) => (
                <span
                  key={item.day}
                  className="flex-1 text-center text-xs font-medium text-slate-500"
                >
                  {item.day}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Products by Category Donut Chart (1 Column) */}
        <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Products by Category
            </h3>
            <p className="text-xs text-slate-500">
              Catalog share across active categories
            </p>
          </div>

          {categoryBreakdown.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              No category data available yet
            </div>
          ) : (
            <>
              {/* SVG Donut */}
              <div className="relative my-4 flex items-center justify-center">
                <svg className="h-36 w-36 -rotate-90" viewBox="0 0 130 130">
                  <circle
                    cx="65"
                    cy="65"
                    r="52"
                    fill="transparent"
                    stroke="#F1F5F9"
                    strokeWidth="14"
                  />
                  {donutSegments.map((seg) => (
                    <circle
                      key={seg.name}
                      cx="65"
                      cy="65"
                      r={seg.radius}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth="14"
                      strokeDasharray={seg.strokeDasharray}
                      strokeDashoffset={seg.strokeDashoffset}
                      strokeLinecap="butt"
                    />
                  ))}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-bold text-slate-900">
                    {totalProductsCount}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    Products
                  </span>
                </div>
              </div>

              {/* Category Legend */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                {categoryBreakdown.slice(0, 4).map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="truncate">{cat.name}</span>
                    </span>
                    <span className="text-slate-500">
                      {cat.count} ({cat.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recently Added Products Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Recently Added Products
            </h3>
            <p className="text-xs text-slate-500">
              Latest products added across your catalog
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToProducts}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            View All
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-medium text-slate-500">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all recent products"
                    className="h-4 w-4 rounded border-slate-300 accent-[#6938EF]"
                  />
                </th>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">ID &amp; Create Date</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentProducts.map((product) => {
                const isSelected = selectedIds.includes(product.id);
                const sellPrice = (Number(product.price || 0) * 0.92).toFixed(2);
                return (
                  <tr
                    key={product.id}
                    className={
                      isSelected ? 'bg-[#F9F8FF]' : 'hover:bg-slate-50/70'
                    }
                  >
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(product.id)}
                        aria-label={`Select ${product.name}`}
                        className="h-4 w-4 rounded border-slate-300 accent-[#6938EF]"
                      />
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 object-cover"
                        />
                        <div>
                          <p className="font-medium text-slate-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {product.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="text-xs font-medium text-slate-800">
                        #{product.sku || product.id}
                      </p>
                      <p className="text-xs text-slate-400">
                        {product.createdAt}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="text-xs font-semibold text-slate-900">
                        ${Number(product.price || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-400">
                        Sell Price ${sellPrice}
                      </p>
                    </td>

                    <td className="px-4 py-3.5 text-xs font-medium text-slate-800">
                      {Number(product.stock || 0).toLocaleString()}
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge stock={product.stock} />
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => onViewProduct?.(product)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        <Eye className="h-3.5 w-3.5 text-[#6938EF]" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}