import React from 'react';
import { Trash2 } from 'lucide-react';

const JournalEntryRow = ({ row, accounts, onRowChange, onRemove, canRemove }) => {
  // Get account category color
  const getCategoryColor = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return '';
    
    const colors = {
      'Asset': 'text-blue-600',
      'Liability': 'text-red-600',
      'Equity': 'text-green-600',
      'Income': 'text-purple-600',
      'Expense': 'text-orange-600'
    };
    return colors[account.category] || '';
  };

  // Get account category
  const getAccountCategory = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.category : '';
  };

  const selectedAccountCategory = getAccountCategory(row.accountId);

  return (
    <tr className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-b-0">
      {/* Account Selector */}
      <td className="px-4 py-3 align-top">
        <select
          value={row.accountId}
          onChange={(e) => onRowChange('accountId', e.target.value)}
          className="w-full px-4 py-2 border border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 transition-all text-sm"
        >
          <option value="">Select Account...</option>
          {/* Group by Category */}
          {['Asset', 'Liability', 'Equity', 'Income', 'Expense'].map(category => (
            <optgroup key={category} label={category}>
              {accounts
                .filter(acc => acc.category === category)
                .map(account => (
                  <option key={account.id} value={account.id}>
                    {account.id} - {account.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        
        {/* Account Type Indicator */}
        {row.accountId && selectedAccountCategory && (
          <p className={`text-[10px] mt-1.5 font-bold uppercase tracking-wider ${getCategoryColor(row.accountId)}`}>
            {selectedAccountCategory}
          </p>
        )}
      </td>

      {/* Debit Column */}
      <td className="px-4 py-3 align-top">
        <input
          type="number"
          placeholder="0.00"
          value={row.debit}
          onChange={(e) => onRowChange('debit', e.target.value)}
          step="0.01"
          min="0"
          className="w-full px-4 py-2 border border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right font-mono font-medium text-slate-700 transition-all text-sm"
        />
      </td>

      {/* Credit Column */}
      <td className="px-4 py-3 align-top">
        <input
          type="number"
          placeholder="0.00"
          value={row.credit}
          onChange={(e) => onRowChange('credit', e.target.value)}
          step="0.01"
          min="0"
          className="w-full px-4 py-2 border border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right font-mono font-medium text-slate-700 transition-all text-sm"
        />
      </td>

      {/* Delete Button */}
      <td className="px-4 py-3 align-top text-center">
        <button
          onClick={onRemove}
          disabled={!canRemove}
          className={`p-2 rounded-xl transition-all shadow-sm ${
            canRemove
              ? 'text-rose-500 bg-rose-50 border border-rose-100 hover:bg-rose-100 hover:text-rose-600'
              : 'text-slate-300 bg-slate-50 border border-slate-100 cursor-not-allowed shadow-none'
          }`}
          title={canRemove ? 'Delete row' : 'Cannot delete - minimum 2 rows required'}
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
};

export default JournalEntryRow;
