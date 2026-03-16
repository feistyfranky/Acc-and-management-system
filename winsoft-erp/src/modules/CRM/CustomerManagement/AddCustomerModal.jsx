import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddCustomerModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    taxId: '',
    category: 'Retail',
    creditLimit: 5000,
    paymentTerms: 'Net 30',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'creditLimit' ? parseFloat(value) || 0 : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (formData.creditLimit <= 0) newErrors.creditLimit = 'Credit limit must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      // Reset form
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        taxId: '',
        category: 'Retail',
        creditLimit: 5000,
        paymentTerms: 'Net 30',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-slate-200/50">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-5 flex items-center justify-between z-10">
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600">Add New Customer</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all ${
                  errors.companyName ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-slate-50/50'
                }`}
                placeholder="Enter company name"
              />
              {errors.companyName && <p className="text-rose-500 text-xs font-bold mt-2">{errors.companyName}</p>}
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all ${
                  errors.contactPerson ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-slate-50/50'
                }`}
                placeholder="Enter contact person name"
              />
              {errors.contactPerson && (
                <p className="text-rose-500 text-xs font-bold mt-2">{errors.contactPerson}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all ${
                  errors.email ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-slate-50/50'
                }`}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-rose-500 text-xs font-bold mt-2">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all ${
                  errors.phone ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-slate-50/50'
                }`}
                placeholder="Enter phone number"
              />
              {errors.phone && <p className="text-rose-500 text-xs font-bold mt-2">{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all ${
                  errors.address ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-slate-50/50'
                }`}
                placeholder="Enter address"
              />
              {errors.address && <p className="text-rose-500 text-xs font-bold mt-2">{errors.address}</p>}
            </div>

            {/* Tax ID */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tax ID</label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all"
                placeholder="Enter tax ID (optional)"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all ${
                  errors.city ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-slate-50/50'
                }`}
                placeholder="Enter city"
              />
              {errors.city && <p className="text-rose-500 text-xs font-bold mt-2">{errors.city}</p>}
            </div>

            {/* Country */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Country *</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all ${
                  errors.country ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-slate-50/50'
                }`}
                placeholder="Enter country"
              />
              {errors.country && <p className="text-rose-500 text-xs font-bold mt-2">{errors.country}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all"
              >
                <option value="Retail">Retail</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>

            {/* Credit Limit */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Credit Limit (₵) *
              </label>
              <input
                type="number"
                name="creditLimit"
                value={formData.creditLimit}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-800 transition-all ${
                  errors.creditLimit ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-slate-50/50'
                }`}
                placeholder="Enter credit limit"
                min="0"
                step="100"
              />
              {errors.creditLimit && (
                <p className="text-rose-500 text-xs font-bold mt-2">{errors.creditLimit}</p>
              )}
            </div>

            {/* Payment Terms */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Payment Terms
              </label>
              <select
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all"
              >
                <option value="Net 15">Net 15</option>
                <option value="Net 30">Net 30</option>
                <option value="Net 45">Net 45</option>
                <option value="Net 60">Net 60</option>
                <option value="2/10 Net 30">2/10 Net 30</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end mt-8 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 btn-premium font-bold"
            >
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;
