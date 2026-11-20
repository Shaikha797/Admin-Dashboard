import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Star,
  Tag,
  Layers,
  ShoppingBag,
  Calendar,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function ProductDetailPage({
  products,
  onEditProduct,
  onDeleteProduct,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((item) => String(item.id) === String(id));

  if (!product) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-2xs">
        <h2 className="text-lg font-semibold text-slate-900">
          Product not found
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          This product could not be found in your catalog.
        </p>
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#6938EF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5925DC]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </button>
      </div>
    );
  }

  const sellPrice = (Number(product.price) * 0.92).toFixed(2);
  const stockValue = (Number(product.price) * Number(product.stock)).toFixed(2);
  const totalSales = (
    Number(product.price) * (Number(product.ordersCount) || 0)
  ).toFixed(2);

  const metrics = [
    {
      label: 'STOCK UNITS',
      value: `${Number(product.stock).toLocaleString()} units`,
      icon: Layers,
    },
    {
      label: 'TOTAL ORDERS',
      value: `${Number(product.ordersCount ?? 0).toLocaleString()} orders`,
      icon: ShoppingBag,
    },
    {
      label: 'STOCK VALUE',
      value: `$${Number(stockValue).toLocaleString()}`,
      icon: Tag,
    },
    {
      label: 'CREATED DATE',
      value: product.createdAt,
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {product.name}
            </h2>
            <p className="text-sm text-slate-500">
              #{product.sku || product.id} • {product.category}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              onDeleteProduct(product.id);
              navigate('/products');
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3.5 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>

          <button
            type="button"
            onClick={() => onEditProduct(product)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#6938EF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5925DC]"
          >
            <Pencil className="h-4 w-4" />
            Edit product
          </button>
        </div>
      </div>

      {/* Main Product Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <img
                src={product.image}
                alt={product.name}
                className="h-72 w-full object-cover sm:h-88"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between space-y-5 lg:col-span-7">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <StatusBadge stock={product.stock} />
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {product.brand || 'Store Brand'}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {product.rating ?? '4.5'}
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-3 border-b border-slate-100 pb-4">
                <span className="text-3xl font-bold text-slate-900">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="text-sm text-slate-400">
                  Sell Price ${sellPrice}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-slate-600">
                {product.description}
              </p>
            </div>

            {/* 4 Metric Tiles */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {metrics.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5"
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                      <Icon className="h-3.5 w-3.5 text-slate-400" />
                      {item.label}
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-slate-900">
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-[#F9F8FF] px-4 py-3 text-xs">
              <span className="font-medium text-slate-600">
                Estimated Product Revenue
              </span>
              <span className="text-sm font-bold text-[#6938EF]">
                ${Number(totalSales).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}