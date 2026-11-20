import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell } from 'lucide-react';
import { INITIAL_PRODUCTS } from './data/mockProducts';
import Sidebar from './components/Sidebar';
import ProductFormModal from './components/ProductFormModal';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import ProductDetailPage from './pages/ProductDetailPage';

const PRODUCTS_STORAGE_KEY = 'store_products_v1';
const CATEGORIES_STORAGE_KEY = 'store_categories_v1';

export default function App() {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to INITIAL_PRODUCTS
    }
    return INITIAL_PRODUCTS;
  });

  const [customCategories, setCustomCategories] = useState(() => {
    try {
      const saved = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback to empty custom list
    }
    return [];
  });

  const [mobileOpen, setMobileOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch {
      // Ignore storage errors
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(
        CATEGORIES_STORAGE_KEY,
        JSON.stringify(customCategories)
      );
    } catch {
      // Ignore storage errors
    }
  }, [customCategories]);

  const categories = useMemo(() => {
    const productCategories = products.map((p) => p.category).filter(Boolean);
    return Array.from(new Set([...productCategories, ...customCategories])).sort();
  }, [products, customCategories]);

  const handleAddCategory = (categoryName) => {
    const cleaned = String(categoryName || '').trim();
    if (!cleaned) return false;

    const exists = categories.some(
      (cat) => cat.toLowerCase() === cleaned.toLowerCase()
    );
    if (exists) return false;

    setCustomCategories((prev) => [...prev, cleaned]);
    return true;
  };

  const handleDeleteCategory = (categoryName) => {
    setCustomCategories((prev) => prev.filter((cat) => cat !== categoryName));
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormModalOpen(true);
  };

  const handleSaveProduct = (productData) => {
    if (productData.category) {
      handleAddCategory(productData.category);
    }

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingProduct.id ? { ...item, ...productData } : item
        )
      );
    } else {
      const newProduct = {
        ...productData,
        id: `PRD-${Date.now().toString().slice(-5)}`,
        ordersCount: 0,
        rating: 5.0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
  };

  const handleDeleteProduct = (productId) => {
    setProducts((prev) => prev.filter((item) => item.id !== productId));
  };

  return (
    <div className="flex min-h-screen bg-[#F9F9FB] text-slate-900">
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white px-4 sm:px-6">
          <div className="flex flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="relative hidden w-full max-w-xs sm:block">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-lg border border-slate-200/80 bg-slate-50/70 py-1.5 pr-3 pl-9 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#6938EF] focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <Bell className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6938EF]/10 text-xs font-semibold text-[#6938EF]">
                RA
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold text-slate-900">
                  Rayan Anderson
                </p>
                <p className="text-[11px] text-slate-400">Store owner</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <DashboardPage
                  products={products}
                  categories={categories}
                  onNavigateToProducts={() => navigate('/products')}
                  onViewProduct={(product) => navigate(`/products/${product.id}`)}
                />
              }
            />
            <Route
              path="/products"
              element={
                <ProductsPage
                  products={products}
                  categories={categories}
                  onAddCategory={handleAddCategory}
                  onCreateClick={handleOpenCreate}
                  onViewProduct={(product) => navigate(`/products/${product.id}`)}
                  onEditProduct={handleOpenEdit}
                  onDeleteProduct={handleDeleteProduct}
                />
              }
            />
            <Route
              path="/categories"
              element={
                <CategoriesPage
                  products={products}
                  categories={categories}
                  onAddCategory={handleAddCategory}
                  onDeleteCategory={handleDeleteCategory}
                  onSelectCategoryInProducts={(categoryName) =>
                    navigate('/products', { state: { category: categoryName } })
                  }
                />
              }
            />
            <Route
              path="/products/:id"
              element={
                <ProductDetailPage
                  products={products}
                  onEditProduct={handleOpenEdit}
                  onDeleteProduct={handleDeleteProduct}
                />
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      <ProductFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        categories={categories}
      />
    </div>
  );
}