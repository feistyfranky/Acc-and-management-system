import React, { useState, useMemo } from 'react';
import { PieChart, Download } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const BalanceSheet = () => {
  const { accounts } = useAppContext();
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);

  // Process accounts into balance sheet format
  const getBalanceSheetData = () => {
    const assets = accounts.filter(a => a.category === 'Asset');
    const liabilities = accounts.filter(a => a.category === 'Liability');
    const equity = accounts.filter(a => a.category === 'Equity');

    return {
      assets: assets.map(a => ({
        id: a.id,
        name: a.name,
        subcategory: a.subcategory,
        amount: Math.abs(a.balance)
      })),
      liabilities: liabilities.map(a => ({
        id: a.id,
        name: a.name,
        subcategory: a.subcategory,
        amount: Math.abs(a.balance)
      })),
      equity: equity.map(a => ({
        id: a.id,
        name: a.name,
        subcategory: a.subcategory,
        amount: Math.abs(a.balance)
      }))
    };
  };

  // Calculate balance sheet summary
  const balanceSheetData = useMemo(() => {
    const data = getBalanceSheetData();

    const totalAssets = data.assets.reduce((sum, item) => sum + item.amount, 0);
    const totalLiabilities = data.liabilities.reduce((sum, item) => sum + item.amount, 0);
    const totalEquity = data.equity.reduce((sum, item) => sum + item.amount, 0);
    const liabilitiesAndEquity = totalLiabilities + totalEquity;

    return {
      ...data,
      totalAssets,
      totalLiabilities,
      totalEquity,
      liabilitiesAndEquity,
      isBalanced: Math.abs(totalAssets - liabilitiesAndEquity) < 0.01,
      debtToEquity: totalEquity > 0 ? (totalLiabilities / totalEquity).toFixed(2) : 0,
      assetComposition: {
        currentAssets: data.assets
          .filter(a => a.subcategory === 'Current Asset')
          .reduce((sum, item) => sum + item.amount, 0),
        fixedAssets: data.assets
          .filter(a => a.subcategory === 'Fixed Asset')
          .reduce((sum, item) => sum + item.amount, 0)
      }
    };
  }, []);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2
    }).format(value);
  };

  const handleExport = () => {
    const csvContent = [
      ['BALANCE SHEET', '', ''],
      [`As of ${reportDate}`, '', ''],
      ['', '', ''],
      ['ASSETS', 'Amount', '']
    ];

    balanceSheetData.assets.forEach(item => {
      csvContent.push([item.name, formatCurrency(item.amount), `(${item.subcategory})`]);
    });

    csvContent.push(['TOTAL ASSETS', formatCurrency(balanceSheetData.totalAssets), '']);
    csvContent.push(['', '', '']);
    csvContent.push(['LIABILITIES', 'Amount', '']);

    balanceSheetData.liabilities.forEach(item => {
      csvContent.push([item.name, formatCurrency(item.amount), `(${item.subcategory})`]);
    });

    csvContent.push(['TOTAL LIABILITIES', formatCurrency(balanceSheetData.totalLiabilities), '']);
    csvContent.push(['', '', '']);
    csvContent.push(['EQUITY', 'Amount', '']);

    balanceSheetData.equity.forEach(item => {
      csvContent.push([item.name, formatCurrency(item.amount), '']);
    });

    csvContent.push(['TOTAL EQUITY', formatCurrency(balanceSheetData.totalEquity), '']);
    csvContent.push(['', '', '']);
    csvContent.push(['TOTAL LIABILITIES & EQUITY', formatCurrency(balanceSheetData.liabilitiesAndEquity), '']);
    csvContent.push(['Debt-to-Equity Ratio', balanceSheetData.debtToEquity, '']);

    const csv = csvContent.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `balance-sheet-${reportDate}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-8 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="mb-8 pl-2 border-l-4 border-l-indigo-500">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600 mb-2">Balance Sheet</h1>
        <p className="text-slate-500 font-medium tracking-wide">Financial position: Assets = Liabilities + Equity</p>
      </div>

      {/* Period Selector */}
      <div className="glass-card p-6 mb-8 flex items-end gap-6 justify-between flex-wrap animate-fade-in-delayed">
        <div>
          <label htmlFor="reportDate" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            As of Date
          </label>
          <input
            type="date"
            id="reportDate"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="w-full sm:w-64 px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 transition-all"
          />
        </div>

        <div>
          {balanceSheetData.isBalanced && (
            <div className="px-5 py-2.5 bg-emerald-50/80 border border-emerald-200/50 text-emerald-800 rounded-xl font-bold shadow-sm flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 text-xs">✓</span>
              BALANCED: Assets = Liabilities + Equity
            </div>
          )}
        </div>

        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 btn-premium font-bold"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Balance Sheet Statement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-fade-in-delayed-2">
        {/* Left Side: Assets */}
        <div className="glass-card p-8">
          <h3 className="text-xl font-extrabold text-blue-700 mb-6 pb-3 border-b-2 border-slate-200 uppercase tracking-widest">
            ASSETS
          </h3>

          {/* Current Assets */}
          <div className="mb-8">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Current Assets</h4>
            <table className="w-full text-sm mb-4">
              <tbody>
                {balanceSheetData.assets
                  .filter(a => a.subcategory === 'Current Asset')
                  .map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-3 text-slate-700 pl-2 font-medium">{item.name}</td>
                      <td className="py-3 text-right text-slate-800 font-mono font-bold pr-2">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Fixed Assets */}
          <div className="mb-8">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Fixed Assets</h4>
            <table className="w-full text-sm mb-4">
              <tbody>
                {balanceSheetData.assets
                  .filter(a => a.subcategory === 'Fixed Asset' || a.subcategory === 'Contra Asset')
                  .map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-3 text-slate-700 pl-2 font-medium">{item.name}</td>
                      <td className="py-3 text-right text-slate-800 font-mono font-bold pr-2">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Total Assets */}
          <div className="pt-4 border-t-2 border-blue-200">
            <div className="flex justify-between items-center bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
              <span className="font-extrabold text-blue-900 uppercase tracking-widest">TOTAL ASSETS</span>
              <span className="text-xl font-extrabold font-mono text-blue-700">{formatCurrency(balanceSheetData.totalAssets)}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Liabilities & Equity */}
        <div className="space-y-8">
          {/* Liabilities */}
          <div className="glass-card p-8">
            <h3 className="text-xl font-extrabold text-rose-700 mb-6 pb-3 border-b-2 border-slate-200 uppercase tracking-widest">
              LIABILITIES
            </h3>

            {/* Current Liabilities */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Current Liabilities</h4>
              <table className="w-full text-sm">
                <tbody>
                  {balanceSheetData.liabilities
                    .filter(a => a.subcategory === 'Current Liability')
                    .map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                        <td className="py-3 text-slate-700 pl-2 font-medium">{item.name}</td>
                        <td className="py-3 text-right text-slate-800 font-mono font-bold pr-2">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Long-term Liabilities */}
            <div className="mb-8">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Long-term Liabilities</h4>
              <table className="w-full text-sm">
                <tbody>
                  {balanceSheetData.liabilities
                    .filter(a => a.subcategory === 'Long-term Liability')
                    .map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                        <td className="py-3 text-slate-700 pl-2 font-medium">{item.name}</td>
                        <td className="py-3 text-right text-slate-800 font-mono font-bold pr-2">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Total Liabilities */}
            <div className="pt-4 border-t-2 border-rose-200">
              <div className="flex justify-between items-center bg-rose-50/50 p-4 rounded-xl border border-rose-100/50">
                <span className="font-extrabold text-rose-900 uppercase tracking-widest">TOTAL LIABILITIES</span>
                <span className="text-xl font-extrabold font-mono text-rose-700">{formatCurrency(balanceSheetData.totalLiabilities)}</span>
              </div>
            </div>
          </div>

          {/* Equity */}
          <div className="glass-card p-8">
            <h3 className="text-xl font-extrabold text-emerald-700 mb-6 pb-3 border-b-2 border-slate-200 uppercase tracking-widest">
              EQUITY
            </h3>

            <table className="w-full text-sm mb-6">
              <tbody>
                {balanceSheetData.equity.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                    <td className="py-3 text-slate-700 pl-2 font-medium">{item.name}</td>
                    <td className="py-3 text-right text-slate-800 font-mono font-bold pr-2">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Equity */}
            <div className="pt-4 border-t-2 border-emerald-200">
              <div className="flex justify-between items-center bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                <span className="font-extrabold text-emerald-900 uppercase tracking-widest">TOTAL EQUITY</span>
                <span className="text-xl font-extrabold font-mono text-emerald-700">{formatCurrency(balanceSheetData.totalEquity)}</span>
              </div>
            </div>

            {/* Total Liabilities and Equity */}
            <div className="mt-8 pt-4">
              <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800">
                <span className="font-extrabold text-white uppercase tracking-widest text-sm">TOTAL LIABILITIES & EQUITY</span>
                <span className="text-2xl font-extrabold font-mono text-white">{formatCurrency(balanceSheetData.liabilitiesAndEquity)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-delayed-2 flex-wrap pb-10">
        <div className="glass-card p-6 border-b-4 border-b-blue-500 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Total Assets</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-2 mb-1">{formatCurrency(balanceSheetData.totalAssets)}</p>
            <p className="text-xs font-bold text-slate-400">{balanceSheetData.assets.length} asset accounts</p>
          </div>
        </div>

        <div className="glass-card p-6 border-b-4 border-b-rose-500 relative overflow-hidden group">
          <div className="absolute right-0 top-0 opacity-10 blur-sm pointer-events-none p-4 text-rose-500">
            <PieChart size={64} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-rose-500 uppercase tracking-widest">Total Liabilities</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-2 mb-1">{formatCurrency(balanceSheetData.totalLiabilities)}</p>
            <p className="text-xs font-bold text-slate-800">Debt-to-Equity: <span className="text-rose-600 font-black ml-1">{balanceSheetData.debtToEquity}</span></p>
          </div>
        </div>

        <div className="glass-card p-6 border-b-4 border-b-emerald-500 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Total Equity</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-2 mb-1">{formatCurrency(balanceSheetData.totalEquity)}</p>
            <p className="text-xs font-bold text-slate-400">{balanceSheetData.equity.length} equity accounts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
