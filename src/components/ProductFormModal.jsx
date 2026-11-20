import React, { useEffect, useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

const SAMPLE_IMAGES = [
  {
    label: 'Headphones',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Sneakers',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Smartwatch',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Camera',
    url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
  },
];

const NEW_CATEGORY_OPTION = '__NEW_CATEGORY__';

const EMPTY_FORM = {
  name: '',
  sku: '',
  brand: '',
  category: 'Electronics',
  price: '',
  stock: '',
  image: SAMPLE_IMAGES[0].url,
  description: '',
};

export default function ProductFormModal({
  isOpen,
  onClose,
  onSave,
  editingProduct,
  categories = [],
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryValue, setCustomCategoryValue] = useState('');
  const [error, setError] = useState('');

  const availableCategories = Array.from(
    new Set(['Electronics', ...categories].filter(Boolean))
  );

  useEffect(() => {
    if (editingProduct) {
      const initialCat = editingProduct.category || availableCategories[0] || 'Electronics';
      const existsInList = availableCategories.includes(initialCat);

      setForm({
        name: editingProduct.name || '',
        sku: editingProduct.sku || '',
        brand: editingProduct.brand || '',
        category: existsInList ? initialCat : NEW_CATEGORY_OPTION,
        price: String(editingProduct.price ?? ''),
        stock: String(editingProduct.stock ?? ''),
        image: editingProduct.image || SAMPLE_IMAGES[0].url,
        description: editingProduct.description || '',
      });
      setIsCustomCategory(!existsInList);
      setCustomCategoryValue(existsInList ? '' : initialCat);
    } else {
      const defaultCat = availableCategories[0] || 'Electronics';
      setForm({
        ...EMPTY_FORM,
        category: defaultCat,
      });
      setIsCustomCategory(false);
      setCustomCategoryValue('');
    }
    setError('');
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category') {
      if (value === NEW_CATEGORY_OPTION) {
        setIsCustomCategory(true);
        setForm((prev) => ({ ...prev, category: NEW_CATEGORY_OPTION }));
      } else {
        setIsCustomCategory(false);
        setCustomCategoryValue('');
        setForm((prev) => ({ ...prev, category: value }));
      }
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalCategory = isCustomCategory
      ? customCategoryValue.trim()
      : form.category.trim();

    if (!form.name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!form.sku.trim()) {
      setError('SKU / Product ID is required.');
      return;
    }
    if (!finalCategory) {
      setError('Category is required.');
      return;
    }

    const parsedPrice = parseFloat(form.price);
    const parsedStock = parseInt(form.stock, 10);

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Enter a valid price.');
      return;
    }
    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      setError('Enter a valid stock count.');
      return;
    }

    onSave?.({
      ...form,
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      brand: form.brand.trim() || 'Store Brand',
      category: finalCategory,
      price: parsedPrice,
      stock: parsedStock,
      image: form.image.trim() || SAMPLE_IMAGES[0].url,
      description:
        form.description.trim() || 'No description provided for this item.',
    });

    onClose?.();
  };

  const previewSellPrice =
    !Number.isNaN(parseFloat(form.price)) && parseFloat(form.price) > 0
      ? (parseFloat(form.price) * 0.92).toFixed(2)
      : '0.00';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[1px]">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              {editingProduct ? 'Edit product' : 'Add product'}
            </h2>
            <p className="text-xs text-slate-500">
              {editingProduct
                ? 'Update product pricing, stock, and catalog details'
                : 'Create a new product listing in your store catalog'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Airpods Pro Max 2024"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#6938EF] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                ID / SKU *
              </label>
              <input
                type="text"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="KMI662266"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#6938EF] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#6938EF] focus:outline-hidden"
              >
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value={NEW_CATEGORY_OPTION}>+ New category...</option>
              </select>

              {isCustomCategory && (
                <input
                  type="text"
                  value={customCategoryValue}
                  onChange={(e) => setCustomCategoryValue(e.target.value)}
                  placeholder="Enter new category name"
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#6938EF] focus:outline-hidden"
                />
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Store Brand"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#6938EF] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="10120.00"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#6938EF] focus:outline-hidden"
              />
              <p className="mt-1 text-xs text-slate-400">
                Sell Price ${previewSellPrice}
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Stock *
              </label>
              <input
                type="number"
                min="0"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="120"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#6938EF] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#6938EF] focus:outline-hidden"
            />

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">Quick sample:</span>
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, image: sample.url }))
                  }
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  {sample.label}
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3">
              {form.image ? (
                <img
                  src={form.image}
                  alt="Preview"
                  className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-slate-400">
                  <ImageIcon className="h-5 w-5" />
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-slate-800">
                  Thumbnail Preview
                </p>
                <p className="text-xs text-slate-400">
                  Shown in product lists and detail views
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="Write a short description for this product..."
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#6938EF] focus:outline-hidden"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#6938EF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5925DC]"
            >
              {editingProduct ? 'Save changes' : 'Add product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}