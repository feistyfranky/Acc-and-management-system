import React, { useState, useMemo } from 'react';
import { Search, Download, ChevronRight, Filter, X } from 'lucide-react';
import generalLedgerData from '../../../data/generalLedgerData.json';
import accountsData from '../../../data/accountsData.json';
import GLDrilldown from './GLDrilldown';

const GeneralLedger = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, assets, liabilities, equity, income, expenses

  // Calculate running balances per account
  const accountBalances = useMemo(() => {
    const balances = {};

    generalLedgerData.glLines.forEach((line) => {
      if (!balances[line.accountId]) {
        balances[line.accountId] = {
          accountId: line.accountId,
          accountCode: line.accountCode,
          accountName: line.accountName,
          category: line.category,
          totalDebit: 0,
          totalCredit: 0,
          balance: 0,
          currency: line.currency,
          transactionCount: 0,
        };
      }

      balances[line.accountId].totalDebit += line.debit;
      balances[line.accountId].totalCredit += line.credit;
      balances[line.accountId].transactionCount += 1;
    });

    // Calculate net balance (Debit - Credit for assets/expenses, Credit - Debit for others)
    Object.keys(balances).forEach((accountId) => {
      const account = balances[accountId];
      const category = account.category;

      if (['Assets', 'Expenses'].includes(category)) {
        account.balance = account.totalDebit - account.totalCredit;
      } else {
        account.balance = account.totalCredit - account.totalDebit;
      }
    });

    return Object.values(balances);
  }, []);

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return accountBalances.filter((account) => {
      const matchesSearch =
        account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.accountCode.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterType === 'all') {
        return matchesSearch;
      }

      const categoryMap = {
        assets: 'Assets',
        liabilities: 'Liabilities',
        equity: 'Equity',
        income: 'Income',
        expenses: 'Expenses',
      };

      return matchesSearch && account.category === categoryMap[filterType];
    });
  }, [accountBalances, searchTerm, filterType]);

  // Summary totals
  const totals = useMemo(() => {
    return {
      totalDebit: accountBalances.reduce((sum, acc) => sum + acc.totalDebit, 0),
      totalCredit: accountBalances.reduce((sum, acc) => sum + acc.totalCredit, 0),
      totalTransactions: generalLedgerData.glLines.length,
    };
  }, [accountBalances]);

  const handleExportGL = () => {
    const csvContent = [
      ['Account Code', 'Account Name', 'Category', 'Total Debit', 'Total Credit', 'Balance', 'Transactions'].join(
        ','
      ),
      ...filteredAccounts.map((acc) =>
        [
          acc.accountCode,
          acc.accountName,
          acc.category,
          acc.totalDebit.toFixed(2),
          acc.totalCredit.toFixed(2),
          acc.balance.toFixed(2),
          acc.transactionCount,
        ].join(',')
      ),
      '',
      ['TOTALS', '', '', totals.totalDebit.toFixed(2), totals.totalCredit.toFixed(2), ''].join(','),
    ].join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `GeneralLedger_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (selectedAccount) {
    return (
      <GLDrilldown
        account={selectedAccount}
        onBack={() => setSelectedAccount(null)}
        glLines={generalLedgerData.glLines}
      />
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-8 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600 mb-2">General Ledger</h1>
        <p className="text-slate-500 font-medium tracking-wide">View account balances and drill down to transaction details</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-delayed">
        <div className="glass-card p-6 border-b-4 border-b-indigo-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Debits</p>
          <p className="text-3xl font-extrabold text-indigo-600">₵{totals.totalDebit.toFixed(2)}</p>
        </div>
        <div className="glass-card p-6 border-b-4 border-b-emerald-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Credits</p>
          <p className="text-3xl font-extrabold text-emerald-600">₵{totals.totalCredit.toFixed(2)}</p>
        </div>
        <div className="glass-card p-6 border-b-4 border-b-purple-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Transactions</p>
          <p className="text-3xl font-extrabold text-purple-600">{totals.totalTransactions}</p>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="glass-card p-6 mb-6 animate-fade-in-delayed-2">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by account name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 transition-all"
            />
          </div>

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 transition-all"
          >
            <option value="all">All Categories</option>
            <option value="assets">Assets</option>
            <option value="liabilities">Liabilities</option>
            <option value="equity">Equity</option>
            <option value="income">Income</option>
            <option value="expenses">Expenses</option>
          </select>

          {/* Export */}
          <button
            onClick={handleExportGL}
            className="flex items-center gap-2 px-6 py-3 btn-secondary"
          >
            <Download size={18} />
            Export
          </button>
        </div>

        {/* Clear filters info */}
        {(searchTerm || filterType !== 'all') && (
          <div className="text-sm text-slate-500 font-medium px-1">
            Showing <span className="font-bold text-slate-700">{filteredAccounts.length}</span> of <span className="font-bold text-slate-700">{accountBalances.length}</span> accounts
          </div>
        )}
      </div>

      {/* Accounts Table */}
      <div className="glass-card overflow-hidden animate-fade-in-delayed-2">
        <table className="table-premium">
          <thead>
            <tr>
              <th>Account Code</th>
              <th>Account Name</th>
              <th>Category</th>
              <th className="text-right">Total Debit</th>
              <th className="text-right">Total Credit</th>
              <th className="text-right">Balance</th>
              <th className="text-center">Txns</th>
              <th className="text-center w-16">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-500 text-lg font-bold">
                  No accounts found
                </td>
              </tr>
            ) : (
              filteredAccounts.map((account) => (
                <tr key={account.accountId}>
                  <td>
                    <span className="font-mono font-bold text-indigo-600">{account.accountCode}</span>
                  </td>
                  <td className="font-bold text-slate-800">{account.accountName}</td>
                  <td>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        account.category === 'Assets'
                          ? 'bg-blue-100 text-blue-800'
                          : account.category === 'Liabilities'
                            ? 'bg-rose-100 text-rose-800'
                            : account.category === 'Equity'
                              ? 'bg-purple-100 text-purple-800'
                              : account.category === 'Income'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {account.category}
                    </span>
                  </td>
                  <td className="text-right font-mono font-medium text-slate-600">
                    {account.totalDebit.toFixed(2)}
                  </td>
                  <td className="text-right font-mono font-medium text-slate-600">
                    {account.totalCredit.toFixed(2)}
                  </td>
                  <td className="text-right">
                    <span
                      className={`font-mono font-bold ${
                        account.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {account.balance.toFixed(2)}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                      {account.transactionCount}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => setSelectedAccount(account)}
                      className="inline-flex items-center justify-center p-2 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 rounded-lg transition-colors"
                      title="View transactions"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Table Footer with Totals */}
        {filteredAccounts.length > 0 && (
          <div className="bg-slate-50 border-t-2 border-slate-200 px-6 py-5">
            <div className="flex justify-between text-sm font-extrabold text-slate-900 uppercase tracking-widest">
              <span>TOTALS</span>
              <div className="flex gap-12">
                <span className="text-right w-24 font-mono text-lg text-indigo-600">
                  {filteredAccounts.reduce((sum, acc) => sum + acc.totalDebit, 0).toFixed(2)}
                </span>
                <span className="text-right w-24 font-mono text-lg text-indigo-600">
                  {filteredAccounts.reduce((sum, acc) => sum + acc.totalCredit, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Information Box */}
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-6 mt-8 animate-fade-in-delayed-2">
        <h4 className="font-extrabold text-indigo-900 mb-3 tracking-wide">General Ledger Information</h4>
        <ul className="text-sm font-medium text-indigo-800 space-y-2.5">
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">•</span> Click any account row to view detailed transactions (drill-down view)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">•</span> Debit and credit totals should balance in a balanced ledger
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">•</span> Balance column shows Account Balance = Total Debits - Total Credits (Assets/Expenses) or Credit - Debit (Liabilities/Equity/Income)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">•</span> Filter by category or search by account name/code to find specific accounts
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 mt-0.5">•</span> Export button generates CSV file with all displayed accounts
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GeneralLedger;
