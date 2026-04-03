import React from 'react';
import { Trash2, Edit2 } from 'lucide-react';

const categoryStyle = (cat) => ({
  Paper:  { background: 'rgba(99,102,241,0.08)',  color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.18)' },
  Ink:    { background: 'rgba(139,92,246,0.08)',  color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.18)' },
  Plates: { background: 'rgba(249,115,22,0.08)', color: '#fdba74', border: '1px solid rgba(249,115,22,0.18)' },
}[cat] || { background: 'rgba(100,116,139,0.08)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.18)' });

const statusStyle = (s) => ({
  'In Stock':  { background: 'rgba(16,185,129,0.08)',  color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.18)' },
  'Low Stock': { background: 'rgba(245,158,11,0.08)',  color: '#fcd34d', border: '1px solid rgba(245,158,11,0.18)' },
  Critical:    { background: 'rgba(239,68,68,0.08)',   color: '#fca5a5', border: '1px solid rgba(239,68,68,0.18)' },
}[s] || { background: 'rgba(100,116,139,0.08)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.18)' });

const InventoryTable = ({ items, onEdit, onDelete }) => {
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
                <p style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.875rem' }}>{item.itemName}</p>
                <p style={{ color: '#475569', fontSize: '0.7rem', fontFamily: 'monospace', marginTop: '1px' }}>{item.sku}</p>
              </td>

              {/* Category */}
              <td>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  style={categoryStyle(item.category)}
                >
                  {item.category}
                </span>
              </td>

              {/* Quantity */}
              <td className="text-right">
                <span style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.875rem' }}>{item.quantity}</span>
                <span style={{ color: '#475569', fontSize: '0.7rem', marginLeft: '4px', textTransform: 'uppercase' }}>{item.unit}</span>
              </td>

              {/* Minimum Stock */}
              <td className="text-right">
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{item.minimumStock}</span>
                <span style={{ color: '#475569', fontSize: '0.7rem', marginLeft: '4px', textTransform: 'uppercase' }}>{item.unit}</span>
              </td>

              {/* Stock Level Bar */}
              <td className="align-middle">
                <div className="w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)', height: '4px' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${stockPercentage}%`,
                      background: item.status === 'Critical' ? '#fca5a5'
                        : item.status === 'Low Stock' ? '#fcd34d'
                        : '#6ee7b7',
                    }}
                  />
                </div>
              </td>

              {/* Unit Cost */}
              <td className="text-right font-mono" style={{ color: '#64748b', fontSize: '0.875rem' }}>
                {formatCurrency(item.cost)}
              </td>

              {/* Total Value */}
              <td className="text-right font-mono" style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.875rem' }}>
                {formatCurrency(totalValue)}
              </td>

              {/* Status */}
              <td className="text-center">
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                  style={statusStyle(item.status)}
                >
                  {item.status}
                </span>
              </td>

              {/* Actions */}
              <td className="text-right">
                <div className="flex gap-1 justify-end">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: '#818cf8' }}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(99,102,241,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}
                    title="Edit"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: '#fca5a5' }}
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}
                    title="Delete"
                  >
                    <Trash2 size={15} />
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
