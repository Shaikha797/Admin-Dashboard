import React from 'react';

export default function StatusBadge({ stock = 0, status }) {
  const normalizedStatus = status ? String(status).toUpperCase() : null;
  const stockCount = Number(stock) || 0;

  if (normalizedStatus === 'INACTIVE' || normalizedStatus === 'ARCHIVED') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-600">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
        Inactive
      </span>
    );
  }

  if (normalizedStatus === 'DRAFT' || (stockCount > 0 && stockCount <= 15)) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
        Draft
      </span>
    );
  }

  if (normalizedStatus === 'OUT_OF_STOCK' || stockCount === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        out Stock
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      Published
    </span>
  );
}