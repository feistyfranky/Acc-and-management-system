import React, { useState, useMemo } from 'react';
import { ArrowLeft, Download, Search } from 'lucide-react';

const GLDrilldown = ({ account, onBack, glLines }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Get all transactions for this account
  const accountTransactions = useMemo(() => {
    return glLines.filter((line) => line.accountId === account.accountId);
  }, [account, glLines]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return accountTransactions.filter((trans) =>
      trans.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trans.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [accountTransactions, searchTerm]);

  // Calculate running balance
  const transactionsWithBalance = useMemo(() => {
    let balance = 0;
    return filteredTransactions.map((trans) => {
      if (['Assets', 'Expenses'].includes(account.category)) {
        balance += trans.debit - trans.credit;
      } else {
        balance += trans.credit - trans.debit;
      }
      return { ...trans, runningBalance: balance };
    });
  }, [filteredTransactions, account.category]);

  // Totals
  const totals = useMemo(() => {
    return {
      debit: filteredTransactions.reduce((sum, trans) => sum + trans.debit, 0),
      credit: filteredTransactions.reduce((sum, trans) => sum + trans.credit, 0),
    };
  }, [filteredTransactions]);

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Reference', 'Description', 'Debit', 'Credit', 'Running Balance', 'Type', 'Status'].join(','),
      ...transactionsWithBalance.map((trans) =>
        [
          trans.date,
          trans.reference,
          trans.description,
          trans.debit.toFixed(2),
          trans.credit.toFixed(2),
          trans.runningBalance.toFixed(2),
          trans.transactionType,
          trans.postedStatus,
        ].join(',')
      ),
      '',
      ['TOTALS', '', '', totals.debit.toFixed(2), totals.credit.toFixed(2), ''].join(','),
    ].join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `GL_${account.accountCode}_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-8 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 font-bold transition-colors bg-indigo-50/80 hover:bg-indigo-100 px-4 py-2 rounded-xl w-fit shadow-sm"
        >
          <ArrowLeft size={18} />
          Back to Ledger
        </button>

        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600 mb-2">
            {account.accountCode} - {account.accountName}
          </h1>
          <p className="text-slate-500 font-medium tracking-wide">Category: <span className="font-bold text-slate-700">{account.category}</span></p>
        </div>
      </div>

      {/* Account Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in-delayed">
        <div className="glass-card p-6 border-b-4 border-b-indigo-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Debits</p>
          <p className="text-3xl font-extrabold text-indigo-600">₵{account.totalDebit.toFixed(2)}</p>
        </div>
        <div className="glass-card p-6 border-b-4 border-b-emerald-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Credits</p>
          <p className="text-3xl font-extrabold text-emerald-600">₵{account.totalCredit.toFixed(2)}</p>
        </div>
        <div className="glass-card p-6 border-b-4 border-b-violet-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Account Balance</p>
          <p
            className={`text-3xl font-extrabold ${account.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
          >
            ₵{account.balance.toFixed(2)}
          </p>
        </div>
        <div className="glass-card p-6 border-b-4 border-b-amber-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Transactions</p>
          <p className="text-3xl font-extrabold text-amber-600">{accountTransactions.length}</p>
        </div>
      </div>

      {/* Search & Export */}
      {/* Search & Export */}
      <div className="glass-card p-6 mb-6 animate-fade-in-delayed-2">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by reference or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 transition-all"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 btn-secondary"
          >
            <Download size={18} />
            Export
          </button>
        </div>
        <div className="text-sm text-slate-500 font-medium px-1">
          Showing <span className="font-bold text-slate-700">{filteredTransactions.length}</span> of <span className="font-bold text-slate-700">{accountTransactions.length}</span> transactions
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card overflow-hidden animate-fade-in-delayed-2">
        <table className="table-premium">
          <thead>
            <tr>
              <th>Date</th>
              <th>Reference</th>
              <th>Description</th>
              <th className="text-right">Debit</th>
              <th className="text-right">Credit</th>
              <th className="text-right">Balance</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactionsWithBalance.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-500 text-lg font-bold">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactionsWithBalance.map((trans) => (
                <tr key={trans.id}>
                  <td className="font-mono text-slate-600">{trans.date}</td>
                  <td className="font-bold text-slate-800">{trans.reference}</td>
                  <td className="text-slate-600 font-medium">{trans.description}</td>
                  <td className="text-right font-mono font-medium">
                    {trans.debit > 0 ? <span className="text-indigo-600">{trans.debit.toFixed(2)}</span> : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="text-right font-mono font-medium">
                    {trans.credit > 0 ? <span className="text-emerald-600">{trans.credit.toFixed(2)}</span> : <span className="text-slate-300">-</span>}
                  </td>
                  <td className="text-right">
                    <span
                      className={`font-mono font-bold ${trans.runningBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
                    >
                      {trans.runningBalance.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {trans.transactionType}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        trans.postedStatus === 'Posted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {trans.postedStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Table Footer */}
        {filteredTransactions.length > 0 && (
          <div className="bg-slate-50 border-t-2 border-slate-200 px-6 py-5">
            <div className="flex justify-between text-sm font-extrabold text-slate-900 uppercase tracking-widest">
              <span>SUBTOTALS</span>
              <div className="flex gap-12 font-mono text-lg">
                <span className="text-right w-20 text-indigo-600">
                  {totals.debit.toFixed(2)}
                </span>
                <span className="text-right w-20 text-emerald-600">
                  {totals.credit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Information Box */}
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-6 mt-8 animate-fade-in-delayed-2">
        <h4 className="font-extrabold text-indigo-900 mb-3 tracking-wide">Account Drill-Down Information</h4>
        <ul className="text-sm font-medium text-indigo-800 space-y-2.5">
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">•</span> <strong>Running Balance:</strong> Updated balance after each transaction
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">•</span> <strong>Debit:</strong> Amount entered on the left side of journal entry
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">•</span> <strong>Credit:</strong> Amount entered on the right side of journal entry
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">•</span> <strong>Type:</strong> Shows if transaction was manual or auto-posted (from sales, purchases, etc.)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">•</span> All transactions are listed in chronological order
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GLDrilldown;
