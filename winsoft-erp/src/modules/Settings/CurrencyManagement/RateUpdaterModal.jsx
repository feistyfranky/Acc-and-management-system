import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const RateUpdaterModal = ({ isOpen, onClose, onSave, currency, baseCurrency }) => {
  const [newRate, setNewRate] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currency) {
      setNewRate(currency.rateToBase.toString());
    } else {
      setNewRate('');
    }
    setErrors({});
  }, [currency, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!newRate) {
      newErrors.rate = 'Exchange rate is required';
    } else if (parseFloat(newRate) <= 0) {
      newErrors.rate = 'Exchange rate must be greater than 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (currency) {
      onSave(currency.code, parseFloat(newRate));
      setNewRate('');
    }
  };

  if (!isOpen || !currency) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Update Exchange Rate
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Currency Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Update the exchange rate for:</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {currency.symbol} {currency.code}
            </p>
            <p className="text-xs text-gray-600 mt-1">{currency.name}</p>
          </div>

          {/* Current Rate */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Current Rate</p>
            <p className="text-lg font-semibold text-gray-900">
              1 {baseCurrency.code} = {currency.rateToBase.toFixed(4)} {currency.code}
            </p>
          </div>

          {/* New Rate Input */}
          <div className="mb-6">
            <label htmlFor="newRate" className="block text-sm font-medium text-gray-700 mb-2">
              New Exchange Rate *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">1 {baseCurrency.code} =</span>
              <input
                type="number"
                id="newRate"
                value={newRate}
                onChange={(e) => {
                  setNewRate(e.target.value);
                  if (errors.rate) setErrors({ ...errors, rate: '' });
                }}
                placeholder="0.0000"
                step="0.0001"
                min="0"
                className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.rate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <span className="text-gray-700 font-medium">{currency.code}</span>
            </div>
            {errors.rate && (
              <p className="text-red-500 text-xs mt-1">{errors.rate}</p>
            )}
          </div>

          {/* Inverse Rate Display */}
          {newRate && parseFloat(newRate) > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Inverse Rate</p>
              <p className="text-lg font-semibold text-gray-900">
                1 {currency.code} = {(1 / parseFloat(newRate)).toFixed(4)} {baseCurrency.code}
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <p>Enter the number of {currency.code} equivalent to 1 {baseCurrency.code}</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Update Rate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RateUpdaterModal;
