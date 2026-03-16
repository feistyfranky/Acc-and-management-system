import React, { useState, useMemo } from 'react';
import { Download, Calendar } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const TrialBalance = () => {
  const { accounts } = useAppContext();
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [showOnlyNonZero, setShowOnlyNonZero] = useState(false);

  // Process accounts into debit/credit format based on account type
  const getTrialBalanceData = () => {
    return accounts.map(account => {
      const balance = Math.abs(account.balance);
      let debit = 0;
      let credit = 0;

      // Asset accounts with positive balance are debits
      // Liability, Equity, Income have credit balances (shown as positive)
      // Expense accounts have debit balances
      if (account.category === 'Asset' || account.category === 'Expense') {
        debit = balance;
      } else if (account.category === 'Liability' || account.category === 'Equity' || account.category === 'Income') {
        credit = balance;
      }

      return {
        id: account.id,
        name: account.name,
        category: account.category,
        debit,
        credit
      };
    });
  };

  // Filter and calculate totals
  const trialBalanceData = useMemo(() => {
    let data = getTrialBalanceData();
    
    if (showOnlyNonZero) {
      data = data.filter(item => item.debit > 0 || item.credit > 0);
    }

    const totalDebit = data.reduce((sum, item) => sum + item.debit, 0);
    const totalCredit = data.reduce((sum, item) => sum + item.credit, 0);
    const difference = Math.abs(totalDebit - totalCredit);

    return {
      accounts: data,
      totalDebit,
      totalCredit,
      difference,
      isBalanced: difference < 0.01
    };
  }, [showOnlyNonZero]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'Asset': 'bg-indigo-100/50 text-indigo-700 border border-indigo-200/50',
      'Liability': 'bg-rose-100/50 text-rose-700 border border-rose-200/50',
      'Equity': 'bg-emerald-100/50 text-emerald-700 border border-emerald-200/50',
      'Income': 'bg-purple-100/50 text-purple-700 border border-purple-200/50',
      'Expense': 'bg-orange-100/50 text-orange-700 border border-orange-200/50'
    };
    return colors[category] || 'bg-slate-100 text-slate-800 border border-slate-200/50';
  };

  const handleExport = () => {
    const csvContent = [
      ['TRIAL BALANCE', '', ''],
      [`As of ${reportDate}`, '', ''],
      ['', '', ''],
      ['Account Code', 'Account Name', 'Debit (GHS)', 'Credit (GHS)']
    ];

    trialBalanceData.accounts.forEach(account => {
      csvContent.push([
        account.id,
        account.name,
        account.debit > 0 ? account.debit.toFixed(2) : '',
        account.credit > 0 ? account.credit.toFixed(2) : ''
      ]);
    });

    csvContent.push(['', '', '', '']);
    csvContent.push([
      'TOTALS',
      '',
      trialBalanceData.totalDebit.toFixed(2),
      trialBalanceData.totalCredit.toFixed(2)
    ]);

    const csv = csvContent.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trial-balance-${reportDate}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-8 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="mb-8 pl-2 border-l-4 border-l-indigo-500">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600 mb-2">Trial Balance</h1>
        <p className="text-slate-500 font-medium tracking-wide">Verify that debits equal credits before closing the period</p>
      </div>

      {/* Controls */}
      <div className="glass-card p-6 mb-8 animate-fade-in-delayed">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label htmlFor="reportDate" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Report Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="date"
                id="reportDate"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center h-10">
            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showOnlyNonZero}
                  onChange={(e) => setShowOnlyNonZero(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-10 h-6 border-2 rounded-full transition-colors flex items-center ${showOnlyNonZero ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-200 border-slate-200'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${showOnlyNonZero ? 'translate-x-5' : 'translate-x-1'}`} />
                </div>
              </div>
              <span className="ml-3 text-sm font-bold text-slate-600 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">
                Non-Zero Accounts Only
              </span>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2.5 btn-premium font-bold"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Balance Status */}
      <div className="mb-8 animate-fade-in-delayed-2">
        <div className={`p-5 rounded-2xl font-bold shadow-sm border ${
          trialBalanceData.isBalanced
            ? 'bg-emerald-50/80 border-emerald-200/50 text-emerald-800'
            : 'bg-rose-50/80 border-rose-200/50 text-rose-800'
        }`}>
          {trialBalanceData.isBalanced ? (
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-lg">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-200 text-emerald-700">✓</span> 
                TRIAL BALANCE COMPLETE
              </p>
              <p className="text-sm border-l-2 border-emerald-200 pl-4 py-1">Total Debits = Total Credits <strong className="font-extrabold font-mono ml-2">({formatCurrency(trialBalanceData.totalDebit)})</strong></p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-lg">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-200 text-rose-700">✗</span> 
                OUT OF BALANCE
              </p>
              <p className="text-sm border-l-2 border-rose-200 pl-4 py-1">Difference: <strong className="font-extrabold font-mono ml-2">{formatCurrency(trialBalanceData.difference)}</strong></p>
            </div>
          )}
        </div>
      </div>

      {/* Trial Balance Table */}
      <div className="glass-card overflow-hidden animate-fade-in-delayed-2">
        <div className="overflow-x-auto">
          <table className="table-premium w-full text-sm">
            <thead>
              <tr>
                <th className="text-left">Code</th>
                <th className="text-left">Account Name</th>
                <th className="text-center">Category</th>
                <th className="text-right">Debit (GHS)</th>
                <th className="text-right">Credit (GHS)</th>
              </tr>
            </thead>
            <tbody>
              {trialBalanceData.accounts.map((account) => (
                <tr key={account.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="font-mono font-bold text-indigo-600">{account.id}</td>
                  <td className="font-bold text-slate-700">{account.name}</td>
                  <td className="text-center">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(account.category)}`}>
                      {account.category}
                    </span>
                  </td>
                  <td className="text-right font-mono font-bold">
                    <span className="text-slate-800">
                      {account.debit > 0 ? formatCurrency(account.debit) : '-'}
                    </span>
                  </td>
                  <td className="text-right font-mono font-bold">
                    <span className="text-slate-800">
                      {account.credit > 0 ? formatCurrency(account.credit) : '-'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t-2 border-slate-200">
                <td colSpan="3" className="text-right font-extrabold text-slate-800 py-4 uppercase tracking-wider text-xs">
                  TOTALS
                </td>
                <td className="text-right font-mono font-extrabold text-indigo-700 py-4 text-base">
                  {formatCurrency(trialBalanceData.totalDebit)}
                </td>
                <td className="text-right font-mono font-extrabold text-emerald-700 py-4 text-base">
                  {formatCurrency(trialBalanceData.totalCredit)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Summary Box */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-delayed-2">
        <div className="glass-card p-6 border-b-4 border-b-slate-400">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Accounts</p>
          <p className="text-4xl font-extrabold text-slate-800">{trialBalanceData.accounts.length}</p>
        </div>

        <div className="glass-card p-6 border-b-4 border-b-indigo-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Debits</p>
          <p className="text-4xl font-extrabold text-indigo-600">{formatCurrency(trialBalanceData.totalDebit)}</p>
        </div>

        <div className="glass-card p-6 border-b-4 border-b-emerald-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Credits</p>
          <p className="text-4xl font-extrabold text-emerald-600">{formatCurrency(trialBalanceData.totalCredit)}</p>
        </div>
      </div>
    </div>
  );
};

export default TrialBalance;
