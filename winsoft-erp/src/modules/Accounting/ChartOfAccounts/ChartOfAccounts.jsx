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

  // Get category badge style (dark-theme, muted)
  const categoryStyle = (category) => {
    const styles = {
      Asset:     { background: 'rgba(99,102,241,0.1)',  color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' },
      Liability: { background: 'rgba(239,68,68,0.08)',  color: '#fca5a5', border: '1px solid rgba(239,68,68,0.18)' },
      Equity:    { background: 'rgba(16,185,129,0.08)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.18)' },
      Income:    { background: 'rgba(139,92,246,0.08)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.18)' },
      Expense:   { background: 'rgba(249,115,22,0.08)', color: '#fdba74', border: '1px solid rgba(249,115,22,0.18)' },
    };
    return styles[category] || { background: 'rgba(100,116,139,0.08)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.18)' };
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
    <div className="min-h-screen animate-fade-in" style={{ color: '#cbd5e1' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#e2e8f0' }}>Chart of Accounts</h1>
        <p style={{ color: '#475569', fontSize: '0.875rem' }}>Manage your company's account structure and settings</p>
      </div>

      {/* Action Bar */}
      <div className="glass-card mb-5 p-3 flex gap-3 flex-wrap items-center">
        <div className="relative flex-1" style={{ minWidth: '220px' }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={15} style={{ color: '#475569' }} />
          <input
            type="text"
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-9 pr-3 py-2 text-sm"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="form-input px-3 py-2 text-sm"
          style={{ minWidth: '120px' }}
        >
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <button onClick={() => setIsModalOpen(true)} className="btn-premium flex items-center gap-2 px-4 py-2 text-sm ml-auto">
          <Plus size={15} /> Add Account
        </button>
      </div>

      <div className="mb-3 text-xs px-1" style={{ color: '#475569' }}>
        Showing <span style={{ color: '#94a3b8', fontWeight: 600 }}>{filteredAccounts.length}</span> of <span style={{ color: '#94a3b8', fontWeight: 600 }}>{accounts.length}</span> accounts
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
                      <span className="font-mono" style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.8125rem' }}>{account.id}</span>
                    </td>
                    <td>
                      <p style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.875rem' }}>{account.name}</p>
                      <p style={{ color: '#475569', fontSize: '0.75rem', marginTop: '1px' }}>{account.description}</p>
                    </td>
                    <td>
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                        style={categoryStyle(account.category)}
                      >
                        {account.category}
                      </span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.8125rem' }}>{account.subcategory}</td>
                    <td className="text-right">
                      <span className="font-mono" style={{ fontWeight: 600, fontSize: '0.875rem', color: account.balance >= 0 ? '#6ee7b7' : '#fca5a5' }}>
                        {formatCurrency(account.balance)}
                      </span>
                    </td>
                    <td>
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                        style={account.status === 'Active'
                          ? { background: 'rgba(16,185,129,0.08)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.18)' }
                          : { background: 'rgba(100,116,139,0.08)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.18)' }
                        }
                      >
                        {account.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="text-xs px-2.5 py-1 rounded-md transition-all"
                        style={{ color: '#fca5a5', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.08)'}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <p style={{ color: '#64748b', fontWeight: 600 }}>No accounts found</p>
                    <p style={{ color: '#334155', fontSize: '0.8125rem', marginTop: '4px' }}>Try adjusting your search or filters</p>
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
