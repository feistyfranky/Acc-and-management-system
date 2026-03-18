import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import AddAccountModal from './AddAccountModal';

const ChartOfAccounts = () => {
  const { accounts, addAccount, deleteAccount } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get unique categories from accounts
  const categories = ['All', ...new Set(accounts.map(acc => acc.category))];

  // Filter accounts based on search term and category
  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => {
      const matchesSearch =
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || account.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [accounts, searchTerm, selectedCategory]);

  // Handle adding new account
  const handleAddAccount = (newAccount) => {
    addAccount(newAccount);
    setIsModalOpen(false);
  };

  const handleDeleteAccount = (accountId) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      deleteAccount(accountId);
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'Asset': 'bg-blue-100 text-blue-800',
      'Liability': 'bg-red-100 text-red-800',
      'Equity': 'bg-green-100 text-green-800',
      'Income': 'bg-purple-100 text-purple-800',
      'Expense': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-8 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600 mb-2">Chart of Accounts</h1>
          <p className="text-slate-500 font-medium tracking-wide">Manage your company's account structure and settings</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="glass-card mb-6 p-4 flex gap-4 flex-wrap items-center justify-between">
        <div className="flex gap-4 flex-1 min-w-[300px]">
          {/* Search Box */}
          <div className="flex-1 relative shadow-sm rounded-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by account name, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-slate-200 bg-white/80 backdrop-blur-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-slate-700 shadow-inner"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-slate-700 font-medium transition-all"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Account Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 btn-premium px-6 py-2.5"
        >
          <Plus size={20} />
          Add Account
        </button>
      </div>

      {/* Results Info */}
      <div className="mb-4 text-sm text-slate-500 font-medium px-2">
        Showing <span className="font-bold text-slate-700">{filteredAccounts.length}</span> of{' '}
        <span className="font-bold text-slate-700">{accounts.length}</span> accounts
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                <th>Code</th>
                <th>Account Name</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th className="text-right">Balance</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <tr key={account.id}>
                    <td>
                      <span className="font-mono font-bold text-indigo-600">{account.id}</span>
                    </td>
                    <td>
                      <div>
                        <p className="font-bold text-slate-800">{account.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{account.description}</p>
                      </div>
                    </td>
                    <td>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(account.category)}`}>
                        {account.category}
                      </span>
                    </td>
                    <td className="text-sm font-medium text-slate-600">
                      {account.subcategory}
                    </td>
                    <td className="text-right">
                      <span className={`text-sm font-bold font-mono ${account.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {formatCurrency(account.balance)}
                      </span>
                    </td>
                    <td>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        account.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {account.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="btn-secondary text-rose-500 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-200 px-3 py-1.5 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    <p className="text-lg font-bold text-slate-700 mb-1">No accounts found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddAccount={handleAddAccount}
      />
    </div>
  );
};

export default ChartOfAccounts;
