import React from 'react';
import { Trash2, Edit2 } from 'lucide-react';

const InventoryTable = ({ items, onEdit, onDelete, getCategoryColor, getStatusColor }) => {
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Get stock percentage
  const getStockPercentage = (quantity, minimumStock) => {
    if (minimumStock === 0) return 100;
    return Math.min((quantity / (minimumStock * 2)) * 100, 100);
  };

  return (
    <table className="table-premium">
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Category</th>
          <th className="text-right">Quantity</th>
          <th className="text-right">Min Stock</th>
          <th className="text-center">Stock Level</th>
          <th className="text-right">Unit Cost</th>
          <th className="text-right">Total Value</th>
          <th className="text-center">Status</th>
          <th className="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const stockPercentage = getStockPercentage(item.quantity, item.minimumStock);
          const totalValue = item.quantity * item.cost;

          return (
            <tr key={item.id}>
              {/* Item Name */}
              <td>
                <div>
                  <p className="font-bold text-slate-800">{item.itemName}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5 whitespace-nowrap">{item.sku}</p>
                </div>
              </td>

              {/* Category */}
              <td>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
              </td>

              {/* Quantity */}
              <td className="text-right">
                <p className="text-sm font-bold text-slate-800">
                  {item.quantity} <span className="text-xs text-slate-400 font-medium ml-1 uppercase">{item.unit}</span>
                </p>
              </td>

              {/* Minimum Stock */}
              <td className="text-right">
                <p className="text-sm font-medium text-slate-500">
                  {item.minimumStock} <span className="text-xs text-slate-400 font-medium ml-1 uppercase">{item.unit}</span>
                </p>
              </td>

              {/* Stock Level Bar */}
              <td className="align-middle">
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.status === 'Critical'
                        ? 'bg-gradient-to-r from-rose-500 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                        : item.status === 'Low Stock'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                    }`}
                    style={{ width: `${stockPercentage}%` }}
                  ></div>
                </div>
              </td>

              {/* Unit Cost */}
              <td className="text-right font-mono text-sm text-slate-500">
                {formatCurrency(item.cost)}
              </td>

              {/* Total Value */}
              <td className="text-right font-mono font-bold text-slate-800">
                {formatCurrency(totalValue)}
              </td>

              {/* Status */}
              <td className="text-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </td>

              {/* Actions */}
              <td className="text-right">
                <div className="flex gap-1 justify-end">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900 p-1.5 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Edit item"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default InventoryTable;
