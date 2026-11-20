import React, { useMemo, useState } from 'react';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Plus,
  Eye,
  Pencil,
  Trash2,
  FolderPlus,
  X,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const STATUS_TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'DRAFTS', label: 'Drafts' },
  { key: 'ARCHIVED', label: 'Archived' },
];

function getProductStatus(product) {
  if (product.status) return String(product.status).toUpperCase();
  const stock = Number(product.stock) || 0;
  if (stock === 0) return 'OUT_OF_STOCK';
  if (stock <= 15) return 'DRAFT';
  return 'PUBLISHED';
}

export default function ProductsPage({
  products = [],
  categories = [],
  onAddCategory,
  onCreateClick,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [statusTab, setStatusTab] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [selectedIds, setSelectedIds] = useState([]);

  // Add Category UI state
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setCategoryError('Please enter a category name.');
      return;
    }

    const added = onAddCategory?.(trimmed);
    if (added === false) {
      setCategoryError('That category already exists.');
      return;
    }

    setNewCategoryName('');
    setCategoryError('');
    setShowAddCategory(false);
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !q ||
        product.name?.toLowerCase().includes(q) ||
        String(product.id)?.toLowerCase().includes(q) ||
        product.sku?.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === 'ALL' || product.category === selectedCategory;

      const state = getProductStatus(product);
      const matchesTab =
        statusTab === 'ALL' ||
        (statusTab === 'ACTIVE' && state !== 'ARCHIVED' && state !== 'DRAFT') ||
        (statusTab === 'DRAFTS' && state === 'DRAFT') ||
        (statusTab === 'ARCHIVED' && state === 'ARCHIVED');

      return matchesSearch && matchesCategory && matchesTab;
    });
  }, [products, searchQuery, selectedCategory, statusTab]);

  const allVisibleSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p.id));
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
            Products
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Manage inventory, pricing and availability across your store
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Export
          </button>

          <button
            type="button"
            onClick={() => {
              setShowAddCategory((prev) => !prev);
              setCategoryError('');
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <FolderPlus className="h-4 w-4 text-[#6938EF]" />
            Add category
          </button>

          <button
            type="button"
            onClick={onCreateClick}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#6938EF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5925DC]"
          >
            <Plus className="h-4 w-4" />
            Add product
          </button>
        </div>
      </div>

      {/* Inline Add Category Card */}
      {showAddCategory && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Add New Category
              </h3>
              <p className="text-xs text-slate-500">
                Create a category to organize products and filter your catalog
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowAddCategory(false);
                setCategoryError('');
              }}
              aria-label="Close category panel"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form
            onSubmit={handleCategorySubmit}
            className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center"
          >
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                if (categoryError) setCategoryError('');
              }}
              placeholder="e.g., Smart Home, Accessories, Audio"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#6938EF] focus:outline-hidden sm:max-w-xs"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#6938EF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5925DC]"
            >
              Save category
            </button>
          </form>

          {categoryError && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">
              {categoryError}
            </p>
          )}

          {categories.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
              <span className="mr-1 text-xs text-slate-400">
                Existing ({categories.length}):
              </span>
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filter Toolbar & Status Tabs */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name or ID"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#6938EF] focus:outline-hidden"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium ${
              showFilters || selectedCategory !== 'ALL'
                ? 'border-[#6938EF]/40 bg-[#F4F3FF] text-[#6938EF]'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>

          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`rounded-md p-1.5 ${
                viewMode === 'grid'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`rounded-md p-1.5 ${
                viewMode === 'list'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Segmented Status Tabs */}
        <div className="inline-flex self-start rounded-lg border border-slate-200 bg-slate-100/80 p-1">
          {STATUS_TABS.map((tab) => {
            const active = statusTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusTab(tab.key)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  active
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expandable Category Filter Bar */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm">
          <span className="text-xs font-medium text-slate-500">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 focus:border-[#6938EF] focus:outline-hidden"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {selectedCategory !== 'ALL' && (
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className="text-xs font-medium text-[#6938EF] hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Grid View or List Table View */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-sm font-medium text-slate-900">
            No products found
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Try clearing your search or switching status tabs.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const sellPrice = (Number(product.price || 0) * 0.92).toFixed(2);
            return (
              <div
                key={product.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <StatusBadge stock={product.stock} />
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-900">
                      ${Number(product.price || 0).toFixed(2)}
                    </span>
                    <span className="ml-2 text-slate-400">
                      Sell Price ${sellPrice}
                    </span>
                  </div>
                  <span className="text-slate-500">
                    {Number(product.stock || 0).toLocaleString()}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-end gap-1.5 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => onViewProduct?.(product)}
                    className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditProduct?.(product)}
                    className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteProduct?.(product.id)}
                    className="rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-medium text-slate-500">
                <tr>
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      aria-label="Select all products"
                      className="h-4 w-4 rounded border-slate-300 accent-[#6938EF]"
                    />
                  </th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">ID &amp; Create Date</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => {
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
                        <div className="inline-flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onViewProduct?.(product)}
                            title="View"
                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onEditProduct?.(product)}
                            title="Edit"
                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteProduct?.(product.id)}
                            title="Delete"
                            className="rounded-md p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}