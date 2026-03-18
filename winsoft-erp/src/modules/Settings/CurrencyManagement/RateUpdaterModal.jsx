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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 pt-16 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shrink-0">
          <h2 className="text-xl font-bold">
            Update Exchange Rate
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto custom-scrollbar">
          {/* Currency Info */}
          <div className="mb-6 p-5 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-700 shrink-0">
              {currency.symbol}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Target Currency</p>
              <p className="text-xl font-bold text-slate-800 leading-none">
                {currency.name} <span className="text-indigo-600">({currency.code})</span>
              </p>
            </div>
          </div>

          {/* Current Rate */}
          <div className="mb-8 p-5 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Current Rate</p>
            <p className="text-2xl font-bold text-slate-800 font-mono flex items-center gap-3">
              <span className="text-slate-400 text-lg">1 {baseCurrency.code} =</span>
              <span className="text-indigo-600">{currency.rateToBase.toFixed(4)}</span>
              <span className="text-slate-500 text-lg">{currency.code}</span>
            </p>
          </div>

          {/* New Rate Input */}
          <div className="mb-8 relative">
            <label htmlFor="newRate" className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
              New Exchange Rate <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-3 bg-white border-2 border-indigo-100 rounded-xl p-3 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all shadow-sm">
              <span className="text-slate-500 font-bold whitespace-nowrap bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                1 {baseCurrency.code} =
              </span>
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
                className="flex-1 w-full bg-transparent focus:outline-none font-mono text-xl font-bold text-indigo-700 placeholder:text-slate-300 min-w-0"
              />
              <span className="text-slate-400 font-bold pr-2">{currency.code}</span>
            </div>
            {errors.rate && (
              <p className="text-rose-500 text-sm font-medium mt-2 absolute -bottom-6 left-0">{errors.rate}</p>
            )}
          </div>

          {/* Inverse Rate Display */}
          {newRate && parseFloat(newRate) > 0 && (
            <div className="mb-8 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
              <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Inverse Rate</p>
              <p className="text-lg font-bold text-emerald-700 font-mono">
                <span className="text-emerald-600/60 text-base">1 {currency.code} =</span> {(1 / parseFloat(newRate)).toFixed(4)} {baseCurrency.code}
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="mb-8 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl text-sm text-indigo-800 font-medium text-center">
            <p>Enter the number of {currency.code} equivalent to 1 {baseCurrency.code}</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1 justify-center py-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-premium flex-1 justify-center py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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
