import React, { useMemo, useState } from 'react';
import {
  Search,
  FolderPlus,
  Tags,
  Package,
  Boxes,
  DollarSign,
  ArrowRight,
  Trash2,
  X,
} from 'lucide-react';

export default function CategoriesPage({
  products = [],
  categories = [],
  onAddCategory,
  onDeleteCategory,
  onSelectCategoryInProducts,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');

  const categoryStats = useMemo(() => {
    const map = new Map();

    categories.forEach((cat) => {
      if (!cat) return;
      map.set(cat, {
        name: cat,
        productCount: 0,
        totalStock: 0,
        revenue: 0,
        previewImage: null,
      });
    });

    products.forEach((product) => {
      const cat = product.category || 'Uncategorized';
      if (!map.has(cat)) {
        map.set(cat, {
          name: cat,
          productCount: 0,
          totalStock: 0,
          revenue: 0,
          previewImage: null,
        });
      }

      const current = map.get(cat);
      const price = Number(product.price || 0);
      const stock = Number(product.stock || 0);
      const ordersCount = Number(product.ordersCount || 0);

      current.productCount += 1;
      current.totalStock += stock;
      current.revenue += price * ordersCount;
      if (!current.previewImage && product.image) {
        current.previewImage = product.image;
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [categories, products]);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return categoryStats;
    return categoryStats.filter((item) => item.name.toLowerCase().includes(q));
  }, [categoryStats, searchQuery]);

  const totalProductsAcrossCategories = products.length;
  const totalStockAcrossCategories = products.reduce(
    (sum, p) => sum + (Number(p.stock) || 0),
    0
  );

  const handleCreateCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setError('Please enter a category name.');
      return;
    }

    const added = onAddCategory?.(trimmed);
    if (added === false) {
      setError('That category already exists.');
      return;
    }

    setNewCategoryName('');
    setError('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Categories
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Organize product groups, inspect inventory per category, and filter listings
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddForm((prev) => !prev);
            setError('');
          }}
          className="inline-flex items-center gap-1.5 self-start rounded-lg bg-[#6938EF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5925DC]"
        >
          <FolderPlus className="h-4 w-4" />
          Add category
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            <Tags className="h-3.5 w-3.5 text-slate-400" />
            TOTAL CATEGORIES
          </span>
          <div className="mt-2.5 text-2xl font-bold text-slate-900">
            {categoryStats.length.toLocaleString()}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            <Package className="h-3.5 w-3.5 text-slate-400" />
            ASSIGNED PRODUCTS
          </span>
          <div className="mt-2.5 text-2xl font-bold text-slate-900">
            {totalProductsAcrossCategories.toLocaleString()}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            <Boxes className="h-3.5 w-3.5 text-slate-400" />
            TOTAL CATEGORY STOCK
          </span>
          <div className="mt-2.5 text-2xl font-bold text-slate-900">
            {totalStockAcrossCategories.toLocaleString()}
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Create New Category
              </h3>
              <p className="text-xs text-slate-500">
                New categories become available in product forms and filters immediately
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setError('');
              }}
              aria-label="Close form"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form
            onSubmit={handleCreateCategory}
            className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center"
          >
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g., Home Office, Wearables, Accessories"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#6938EF] focus:outline-hidden sm:max-w-xs"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-[#6938EF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5925DC]"
            >
              Save category
            </button>
          </form>

          {error && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#6938EF] focus:outline-hidden"
          />
        </div>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm font-medium text-slate-900">
            No categories found
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Try another search term or click Add category to create one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((cat) => (
            <div
              key={cat.name}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-slate-300"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {cat.previewImage ? (
                      <img
                        src={cat.previewImage}
                        alt={cat.name}
                        className="h-11 w-11 shrink-0 rounded-lg border border-slate-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#F4F3FF] text-[#6938EF]">
                        <Tags className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {cat.productCount}{' '}
                        {cat.productCount === 1 ? 'product' : 'products'}
                      </p>
                    </div>
                  </div>

                  {cat.productCount === 0 && onDeleteCategory && (
                    <button
                      type="button"
                      onClick={() => onDeleteCategory(cat.name)}
                      title="Delete unused category"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-slate-50/80 p-2.5 text-xs">
                  <div>
                    <span className="text-slate-400">Stock</span>
                    <p className="mt-0.5 font-semibold text-slate-800">
                      {cat.totalStock.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-0.5 text-slate-400">
                      <DollarSign className="h-3 w-3" />
                      Revenue
                    </span>
                    <p className="mt-0.5 font-semibold text-slate-800">
                      ${cat.revenue.toLocaleString('en-US', {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => onSelectCategoryInProducts?.(cat.name)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#6938EF] hover:text-[#5925DC]"
                >
                  View products
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}