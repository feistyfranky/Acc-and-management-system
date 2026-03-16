import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AddInventoryModal = ({ isOpen, onClose, onSave, editingItem }) => {
  const [formData, setFormData] = useState({
    category: 'Paper',
    itemName: '',
    sku: '',
    gsm: '',
    unit: 'Reams',
    quantity: '',
    minimumStock: '',
    reorderPoint: '',
    cost: '',
    currency: 'GHS',
    supplier: '',
    lastRestocked: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  const categories = {
    'Paper': { units: ['Reams', 'Sheets', 'Kg'] },
    'Ink': { units: ['Liters', 'Cartridges', 'Gallons'] },
    'Plates': { units: ['Pieces', 'Sets'] }
  };

  // Populate form when editing
  useEffect(() => {
    if (editingItem) {
      setFormData({
        category: editingItem.category,
        itemName: editingItem.itemName,
        sku: editingItem.sku,
        gsm: editingItem.gsm || '',
        unit: editingItem.unit,
        quantity: editingItem.quantity,
        minimumStock: editingItem.minimumStock,
        reorderPoint: editingItem.reorderPoint,
        cost: editingItem.cost,
        currency: editingItem.currency,
        supplier: editingItem.supplier,
        lastRestocked: editingItem.lastRestocked
      });
    } else {
      setFormData({
        category: 'Paper',
        itemName: '',
        sku: '',
        gsm: '',
        unit: 'Reams',
        quantity: '',
        minimumStock: '',
        reorderPoint: '',
        cost: '',
        currency: 'GHS',
        supplier: '',
        lastRestocked: new Date().toISOString().split('T')[0]
      });
    }
  }, [editingItem, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' && { unit: categories[value].units[0] })
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Item name is required';
    }
    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    }
    if (!formData.minimumStock) {
      newErrors.minimumStock = 'Minimum stock is required';
    }
    if (!formData.cost) {
      newErrors.cost = 'Cost is required';
    }
    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Supplier is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
      setFormData({
        category: 'Paper',
        itemName: '',
        sku: '',
        gsm: '',
        unit: 'Reams',
        quantity: '',
        minimumStock: '',
        reorderPoint: '',
        cost: '',
        currency: 'GHS',
        supplier: '',
        lastRestocked: new Date().toISOString().split('T')[0]
      });
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-slate-200/50">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-10">
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600">
            {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all"
              >
                <option value="Paper">Paper</option>
                <option value="Ink">Ink</option>
                <option value="Plates">Plates</option>
              </select>
            </div>

            {/* Item Name */}
            <div>
              <label htmlFor="itemName" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Item Name *
              </label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                placeholder="e.g., A4 Copy Paper - 80GSM"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all ${
                  errors.itemName ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-slate-50/50'
                }`}
              />
              {errors.itemName && <p className="text-rose-500 text-xs font-bold mt-2">{errors.itemName}</p>}
            </div>

            {/* SKU */}
            <div>
              <label htmlFor="sku" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                SKU *
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="e.g., A4-80GSM"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all ${
                  errors.sku ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-slate-50/50'
                }`}
              />
              {errors.sku && <p className="text-rose-500 text-xs font-bold mt-2">{errors.sku}</p>}
            </div>

            {/* GSM (only for Paper) */}
            {formData.category === 'Paper' && (
              <div>
                <label htmlFor="gsm" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  GSM
                </label>
                <input
                  type="number"
                  id="gsm"
                  name="gsm"
                  value={formData.gsm}
                  onChange={handleInputChange}
                  placeholder="e.g., 80"
                  className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all"
                />
              </div>
            )}

            {/* Unit */}
            <div>
              <label htmlFor="unit" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Unit *
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all"
              >
                {categories[formData.category].units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Current Quantity *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all ${
                  errors.quantity ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-slate-50/50'
                }`}
              />
              {errors.quantity && <p className="text-rose-500 text-xs font-bold mt-2">{errors.quantity}</p>}
            </div>

            {/* Minimum Stock */}
            <div>
              <label htmlFor="minimumStock" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Minimum Stock *
              </label>
              <input
                type="number"
                id="minimumStock"
                name="minimumStock"
                value={formData.minimumStock}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all ${
                  errors.minimumStock ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-slate-50/50'
                }`}
              />
              {errors.minimumStock && <p className="text-rose-500 text-xs font-bold mt-2">{errors.minimumStock}</p>}
            </div>

            {/* Reorder Point */}
            <div>
              <label htmlFor="reorderPoint" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Reorder Point
              </label>
              <input
                type="number"
                id="reorderPoint"
                name="reorderPoint"
                value={formData.reorderPoint}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all"
              />
            </div>

            {/* Unit Cost */}
            <div>
              <label htmlFor="cost" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Unit Cost *
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  value={formData.cost}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-slate-800 transition-all ${
                    errors.cost ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-slate-50/50'
                  }`}
                />
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all"
                >
                  <option value="GHS">GHS</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              {errors.cost && <p className="text-rose-500 text-xs font-bold mt-2">{errors.cost}</p>}
            </div>

            {/* Supplier */}
            <div>
              <label htmlFor="supplier" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Supplier *
              </label>
              <input
                type="text"
                id="supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                placeholder="e.g., PaperPlus Ltd"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all ${
                  errors.supplier ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200 bg-slate-50/50'
                }`}
              />
              {errors.supplier && <p className="text-rose-500 text-xs font-bold mt-2">{errors.supplier}</p>}
            </div>

            {/* Last Restocked */}
            <div>
              <label htmlFor="lastRestocked" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Last Restocked
              </label>
              <input
                type="date"
                id="lastRestocked"
                name="lastRestocked"
                value={formData.lastRestocked}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 transition-all"
              />
            </div>
          </div>

          {/* Buttons */}
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
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInventoryModal;
