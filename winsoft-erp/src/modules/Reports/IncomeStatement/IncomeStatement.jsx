import React, { useState, useMemo } from 'react';
import { TrendingUp, Download } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const IncomeStatement = () => {
  const { accounts } = useAppContext();
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);

  // Process accounts into income statement format
  const getIncomeStatementData = () => {
    const incomeAccounts = accounts.filter(a => a.category === 'Income');
    const expenseAccounts = accounts.filter(a => a.category === 'Expense');

    const income = incomeAccounts.map(account => ({
      id: account.id,
      name: account.name,
      subcategory: account.subcategory,
      amount: account.balance
    }));

    const expenses = expenseAccounts.map(account => ({
      id: account.id,
      name: account.name,
      subcategory: account.subcategory,
      amount: account.balance
    }));

    return { income, expenses };
  };

  // Calculate statement summary
  const statementData = useMemo(() => {
    const data = getIncomeStatementData();
    
    const totalIncome = data.income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);
    const operatingIncome = totalIncome - totalExpenses;
    const grossMargin = totalIncome > 0 ? (operatingIncome / totalIncome) * 100 : 0;

    return {
      ...data,
      totalIncome,
      totalExpenses,
      operatingIncome,
      grossMargin
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
      ['INCOME STATEMENT', '', ''],
      [`For the period ending ${reportDate}`, '', ''],
      ['', '', ''],
      ['REVENUE', 'Amount', '']
    ];

    statementData.income.forEach(item => {
      csvContent.push([item.name, formatCurrency(item.amount), `(${item.subcategory})`]);
    });

    csvContent.push(['TOTAL REVENUE', formatCurrency(statementData.totalIncome), '']);
    csvContent.push(['', '', '']);
    csvContent.push(['OPERATING EXPENSES', 'Amount', '']);

    statementData.expenses.forEach(item => {
      csvContent.push([item.name, formatCurrency(item.amount), `(${item.subcategory})`]);
    });

    csvContent.push(['TOTAL OPERATING EXPENSES', formatCurrency(statementData.totalExpenses), '']);
    csvContent.push(['', '', '']);
    csvContent.push(['NET INCOME (LOSS)', formatCurrency(statementData.operatingIncome), '']);
    csvContent.push(['Gross Profit Margin (%)', `${statementData.grossMargin.toFixed(2)}%`, '']);

    const csv = csvContent.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `income-statement-${reportDate}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-8 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="mb-8 pl-2 border-l-4 border-l-indigo-500">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600 mb-2">Income Statement</h1>
        <p className="text-slate-500 font-medium tracking-wide">Review revenue, expenses, and profitability for the period</p>
      </div>

      {/* Period Selector */}
      <div className="glass-card p-6 mb-8 flex items-end gap-6 justify-between flex-wrap animate-fade-in-delayed">
        <div>
          <label htmlFor="reportDate" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Period Ending
          </label>
          <input
            type="date"
            id="reportDate"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            className="w-full sm:w-64 px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 transition-all"
          />
        </div>

        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 btn-premium font-bold"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* Main Statement */}
      <div className="glass-card p-8 mb-8 animate-fade-in-delayed-2">
        {/* Title */}
        <div className="mb-8 pb-6 border-b-2 border-slate-200">
          <p className="text-xs font-bold text-center text-slate-500 uppercase tracking-widest">For the period ending {reportDate}</p>
          <h2 className="text-2xl font-extrabold text-center text-slate-800 mt-2 tracking-wide">INCOME STATEMENT</h2>
        </div>

        {/* Revenue Section */}
        <div className="mb-8 pl-4 border-l-2 border-indigo-200">
          <h3 className="text-sm font-extrabold text-indigo-700 mb-4 uppercase tracking-widest">REVENUE</h3>
          <table className="w-full mb-4">
            <tbody>
              {statementData.income.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                  <td className="py-3 text-slate-700 pl-2">
                    <span className="font-bold">{item.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-3 bg-slate-100 px-2 py-1 rounded-full group-hover:bg-white">{item.subcategory}</span>
                  </td>
                  <td className="py-3 text-right text-slate-800 font-mono font-bold pr-2">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
              <tr className="bg-indigo-50/50 font-extrabold text-indigo-900 border-t-2 border-indigo-200">
                <td className="py-4 pl-2 uppercase tracking-wide text-xs">Total Revenue</td>
                <td className="py-4 text-right pr-2 font-mono text-base">{formatCurrency(statementData.totalIncome)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200/50 mb-8 mx-4"></div>

        {/* Expenses Section */}
        <div className="mb-8 pl-4 border-l-2 border-orange-200">
          <h3 className="text-sm font-extrabold text-orange-700 mb-4 uppercase tracking-widest">OPERATING EXPENSES</h3>
          <table className="w-full mb-4">
            <tbody>
              {statementData.expenses.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                  <td className="py-3 text-slate-700 pl-2">
                    <span className="font-bold">{item.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-3 bg-slate-100 px-2 py-1 rounded-full group-hover:bg-white">{item.subcategory}</span>
                  </td>
                  <td className="py-3 text-right text-slate-800 font-mono font-bold pr-2">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
              <tr className="bg-orange-50/50 font-extrabold text-orange-900 border-t-2 border-orange-200">
                <td className="py-4 pl-2 uppercase tracking-wide text-xs">Total Operating Expenses</td>
                <td className="py-4 text-right pr-2 font-mono text-base">{formatCurrency(statementData.totalExpenses)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Divider */}
        <div className="h-0.5 bg-slate-200 mb-8"></div>

        {/* Net Income */}
        <div className="mb-4 bg-slate-50 rounded-2xl border border-slate-200 p-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-extrabold text-slate-800 uppercase tracking-widest">NET INCOME (LOSS)</span>
            <span className={`text-3xl font-extrabold font-mono ${statementData.operatingIncome >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatCurrency(statementData.operatingIncome)}
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-delayed-2 flex-wrap">
        <div className="glass-card p-6 border-b-4 border-b-indigo-500 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-indigo-100 opacity-50 group-hover:scale-110 transition-transform duration-500">
            <TrendingUp size={100} />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Total Revenue</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-2 mb-1">{formatCurrency(statementData.totalIncome)}</p>
            <p className="text-xs font-bold text-slate-400">{statementData.income.length} revenue streams</p>
          </div>
        </div>

        <div className="glass-card p-6 border-b-4 border-b-orange-500 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Total Expenses</p>
            <p className="text-3xl font-extrabold text-slate-800 mt-2 mb-1">{formatCurrency(statementData.totalExpenses)}</p>
            <p className="text-xs font-bold text-slate-400">{statementData.expenses.length} expense categories</p>
          </div>
        </div>

        <div className={`glass-card p-6 border-b-4 relative overflow-hidden group ${statementData.operatingIncome >= 0 ? 'border-b-emerald-500' : 'border-b-rose-500'}`}>
          <div className="relative z-10">
            <p className={`text-xs font-bold uppercase tracking-widest ${statementData.operatingIncome >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              Gross Profit Margin
            </p>
            <p className={`text-4xl font-extrabold mt-2 mb-1 ${statementData.operatingIncome >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {statementData.grossMargin.toFixed(2)}%
            </p>
            <p className="text-xs font-bold text-slate-400">Net profitability ratio</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeStatement;
