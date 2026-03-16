import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, TrendingUp, AlertCircle, DollarSign, Users } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import customerData from '../../../data/customerData.json';
import AddCustomerModal from './AddCustomerModal';
import CustomerDetailView from './CustomerDetailView';
import ARAging from './ARAging';

const CustomerManagement = () => {
  const { customers, setCustomers } = useAppContext();
  const [transactions, setTransactions] = useState(customerData.customerTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewType, setViewType] = useState('list'); // list, detail, aging

  // Filter customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filterCategory === 'all' || customer.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [customers, searchTerm, filterCategory, filterStatus]);

  // Calculate AR per customer
  const customerARMap = useMemo(() => {
    const arMap = {};
    transactions.forEach((txn) => {
      if (!arMap[txn.customerId]) {
        arMap[txn.customerId] = 0;
      }
      if (txn.type === 'invoice') {
        arMap[txn.customerId] += txn.amount;
      } else if (txn.type === 'payment') {
        arMap[txn.customerId] += txn.amount; // Already negative
      }
    });
    return arMap;
  }, [transactions]);

  // Summary metrics
  const metrics = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c) => c.status === 'Active').length;
    const totalAR = Object.values(customerARMap).reduce((sum, ar) => sum + ar, 0);
    const totalCreditLimit = customers.reduce((sum, c) => sum + c.creditLimit, 0);

    return {
      totalCustomers,
      activeCustomers,
      totalAR,
      totalCreditLimit,
    };
  }, [customers, customerARMap]);

  const handleAddCustomer = (newCustomer) => {
    const customer = {
      id: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      ...newCustomer,
      registrationDate: new Date().toISOString().split('T')[0],
    };
    setCustomers([...customers, customer]);
    setShowAddModal(false);
  };

  const handleDeleteCustomer = (customerId) => {
    setCustomers(customers.filter((c) => c.id !== customerId));
  };

  if (viewType === 'detail' && selectedCustomer) {
    return (
      <CustomerDetailView
        customer={selectedCustomer}
        transactions={transactions.filter((t) => t.customerId === selectedCustomer.id)}
        ar={customerARMap[selectedCustomer.id] || 0}
        onBack={() => {
          setViewType('list');
          setSelectedCustomer(null);
        }}
      />
    );
  }

  if (viewType === 'aging') {
    return (
      <ARAging
        customers={customers}
        transactions={transactions}
        customerARMap={customerARMap}
        onBack={() => setViewType('list')}
      />
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-8 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600 mb-2">Customer Management</h1>
        <p className="text-slate-500 font-medium tracking-wide">Manage customers, track receivables, and view sales history</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in-delayed">
        <div className="glass-card p-6 border-b-4 border-b-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Customers</p>
              <p className="text-3xl font-extrabold text-indigo-600">{metrics.totalCustomers}</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <Users size={32} className="text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-b-4 border-b-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active</p>
              <p className="text-3xl font-extrabold text-emerald-600">{metrics.activeCustomers}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <TrendingUp size={32} className="text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-b-4 border-b-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total A/R</p>
              <p className="text-3xl font-extrabold text-amber-600">₵{metrics.totalAR.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl">
              <AlertCircle size={32} className="text-amber-400" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border-b-4 border-b-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Credit Limit</p>
              <p className="text-3xl font-extrabold text-purple-600">₵{metrics.totalCreditLimit.toFixed(0)}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-2xl">
              <DollarSign size={32} className="text-purple-400" />
            </div>
          </div>
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
              placeholder="Search by company, contact, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 transition-all"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 transition-all"
          >
            <option value="all">All Categories</option>
            <option value="Retail">Retail</option>
            <option value="Wholesale">Wholesale</option>
            <option value="Corporate">Corporate</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-slate-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 transition-all"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 btn-premium flex-1 md:flex-none justify-center"
          >
            <Plus size={18} />
            Add Customer
          </button>
          <button
            onClick={() => setViewType('aging')}
            className="flex items-center gap-2 px-6 py-3 btn-secondary flex-1 md:flex-none justify-center"
          >
            <TrendingUp size={18} />
            AR Aging Report
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="glass-card overflow-hidden animate-fade-in-delayed-2">
        <table className="table-premium">
          <thead>
            <tr>
              <th>Company</th>
              <th>Contact</th>
              <th>Category</th>
              <th className="text-center">Status</th>
              <th className="text-right">A/R Balance</th>
              <th className="text-right">Credit Limit</th>
              <th className="text-center w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-500 font-bold text-lg">
                  No customers found
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => {
                const ar = customerARMap[customer.id] || 0;
                const utilizationPercent = (ar / customer.creditLimit) * 100;

                return (
                  <tr key={customer.id}>
                    <td>
                      <span className="font-bold text-slate-800">{customer.companyName}</span>
                    </td>
                    <td>
                      <div className="font-bold text-slate-700">{customer.contactPerson}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{customer.email}</div>
                    </td>
                    <td>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          customer.category === 'Corporate'
                            ? 'bg-blue-100 text-blue-800'
                            : customer.category === 'Wholesale'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {customer.category}
                      </span>
                    </td>
                    <td className="text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          customer.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="text-right align-middle">
                      <div className="text-sm font-mono font-bold text-slate-800">
                        ₵{ar.toFixed(2)}
                      </div>
                      <div className="w-full max-w-[100px] ml-auto bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            utilizationPercent > 80
                              ? 'bg-gradient-to-r from-rose-500 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                              : utilizationPercent > 50
                                ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                                : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                          }`}
                          style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="text-right font-mono font-medium text-slate-600">
                      ₵{customer.creditLimit.toFixed(0)}
                    </td>
                    <td className="text-center">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setViewType('detail');
                          }}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${customer.companyName}?`)) {
                              handleDeleteCustomer(customer.id);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddCustomer}
      />

      {/* Information Box */}
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-6 mt-8 animate-fade-in-delayed-2">
        <h4 className="font-extrabold text-indigo-900 mb-3 tracking-wide">Customer Management Information</h4>
        <ul className="text-sm font-medium text-indigo-800 space-y-2.5">
          <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span> Click the edit icon to view customer details, transaction history, and sales trends</li>
          <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span> A/R Balance shows outstanding amount vs credit limit (green = safe, orange = warning, red = over limit)</li>
          <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span> Filter customers by category (Retail/Wholesale/Corporate) and status (Active/Inactive)</li>
          <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span> Use AR Aging Report to monitor overdue invoices and collection priorities</li>
          <li className="flex items-start gap-2"><span className="text-indigo-400 mt-0.5">•</span> Customer registration date helps track relationship tenure</li>
        </ul>
      </div>
    </div>
  );
};

export default CustomerManagement;
