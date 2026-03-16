import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddAccountModal = ({ isOpen, onClose, onAddAccount }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Asset',
    subcategory: 'Current Asset',
    description: '',
    currency: 'GHS'
  });

  const [errors, setErrors] = useState({});

  const subcategoryOptions = {
    Asset: ['Current Asset', 'Fixed Asset', 'Contra Asset'],
    Liability: ['Current Liability', 'Long-term Liability'],
    Equity: ["Owner's Capital", 'Retained Earnings'],
    Income: ['Operating Income', 'Non-operating Income'],
    Expense: ['Operating Expense', 'Non-operating Expense']
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset subcategory when category changes
      ...(name === 'category' && { subcategory: subcategoryOptions[value][0] })
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Account name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddAccount(formData);
      // Reset form
      setFormData({
        name: '',
        category: 'Asset',
        subcategory: 'Current Asset',
        description: '',
        currency: 'GHS'
      });
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card w-full max-w-md p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600">
            Add New Account
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Account Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Cash - Petty"
              className={`w-full px-4 py-2.5 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium ${
                errors.name ? 'border-red-500' : 'border-slate-200'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
              >
                <option value="Asset">Asset</option>
                <option value="Liability">Liability</option>
                <option value="Equity">Equity</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label htmlFor="subcategory" className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Subcategory *
              </label>
              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
              >
                {subcategoryOptions[formData.category].map(subcat => (
                  <option key={subcat} value={subcat}>{subcat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Currency */}
          <div>
            <label htmlFor="currency" className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
            >
              <option value="GHS">GHS (Ghana Cedis)</option>
              <option value="USD">USD (US Dollars)</option>
              <option value="EUR">EUR (Euro)</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter account description"
              rows="3"
              className={`w-full px-4 py-2.5 bg-white/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium resize-none ${
                errors.description ? 'border-red-500' : 'border-slate-200'
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 btn-premium font-bold"
            >
              Add Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountModal;
