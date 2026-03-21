import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, RefreshCw, Plus } from 'lucide-react';
import currencyData from '../../../data/currencyData.json';
import RateUpdaterModal from './RateUpdaterModal';
import ConversionCalculator from './ConversionCalculator';

const CurrencyManagement = () => {
  const [rates, setRates] = useState(currencyData.supportedCurrencies);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState(null);

  const baseCurrency = currencyData.baseCurrency;
  const baseRate = rates.find(c => c.isBase);
  const otherRates = rates.filter(c => !c.isBase);

  // Handle rate update
  const handleUpdateRate = (currencyCode, newRate) => {
    setRates(rates.map(currency =>
      currency.code === currencyCode
        ? { ...currency, rateToBase: newRate, lastUpdated: new Date().toISOString().split('T')[0] }
        : currency
    ));
    setIsRateModalOpen(false);
    setEditingCurrency(null);
  };

  // Calculate average rate change
  const getRateChange = (currency) => {
    const history = currencyData.conversionHistory.filter(h => h.currency === currency.code);
    if (history.length < 2) return null;
    const oldest = history[history.length - 1];
    const newest = history[0];
    return ((newest.rate - oldest.rate) / oldest.rate) * 100;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">Currency Management</h1>
        <p className="text-slate-500">Manage exchange rates and multi-currency settings for Nexus ERP</p>
      </div>

      {/* Base Currency Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden group">
        {/* Decorative background circles */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-0 right-32 -mb-16 w-48 h-48 rounded-full bg-white opacity-5 group-hover:scale-110 transition-transform duration-500 delay-100"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-sm uppercase tracking-wider font-semibold mb-1 tracking-widest">Base Currency</p>
            <h2 className="text-5xl font-bold mb-2 flex items-baseline gap-2">
              <span className="text-indigo-200">{baseCurrency.symbol}</span>
              {baseCurrency.code}
            </h2>
            <p className="text-indigo-100 text-lg">{baseCurrency.name}</p>
            <p className="text-indigo-200/80 text-sm mt-3 pt-3 border-t border-indigo-500/30">All exchange rates calculated from {baseCurrency.name}</p>
          </div>
          <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm border border-white/20">
            <DollarSign size={80} className="text-white drop-shadow-md" />
          </div>
        </div>
      </div>

      {/* Exchange Rates Section */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-800">Exchange Rates</h3>
          <button
            onClick={() => {
              setEditingCurrency(null);
              setIsRateModalOpen(true);
            }}
            className="btn-premium flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Update Rates
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherRates.map((currency) => {
            const rateChange = getRateChange(currency);
            const isPositive = rateChange > 0;

            return (
              <div key={currency.code} className="border border-slate-200 rounded-xl p-6 bg-slate-50/30 hover:shadow-md transition-shadow hover:border-indigo-200 group">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">
                      {baseCurrency.code} to {currency.code}
                    </p>
                    <h4 className="text-2xl font-bold text-slate-800 mt-1">
                      {currency.symbol} {currency.code}
                    </h4>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCurrency(currency);
                      setIsRateModalOpen(true);
                    }}
                    className="p-3 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors group-hover:scale-105"
                    title="Edit rate"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>

                {/* Rate */}
                <div className="mb-4 pb-4 border-b border-slate-200 group-hover:border-indigo-100 transition-colors">
                  <p className="text-3xl font-bold text-indigo-700 bg-clip-text">
                    <span className="text-slate-400 text-2xl">1 {baseCurrency.code} = </span>
                    {currency.rateToBase.toFixed(4)} {currency.code}
                  </p>
                  <p className="text-sm text-slate-500 mt-2 font-mono bg-slate-100/50 p-2 rounded-lg inline-block">
                    1 {currency.code} = {(1 / currency.rateToBase).toFixed(4)} {baseCurrency.code}
                  </p>
                </div>

                {/* Change Info */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <RefreshCw size={12} className="text-slate-400" />
                    Last updated: <span className="font-semibold text-slate-600">{currency.lastUpdated}</span>
                  </p>
                  {rateChange !== null && (
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      <TrendingUp size={16} className={isPositive ? '' : 'transform rotate-180'} />
                      {isPositive ? '+' : ''}{rateChange.toFixed(2)}%
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversion Calculator */}
      <div className="mb-8">
        <ConversionCalculator supportedCurrencies={rates} baseCurrency={baseCurrency} />
      </div>

      {/* Information Box */}
      <div className="glass-card bg-indigo-50/30 border border-indigo-100 p-6 mb-8">
        <h4 className="font-bold text-indigo-900 mb-3">Exchange Rate Information</h4>
        <ul className="text-sm text-indigo-800 space-y-2">
          <li>• Base currency: <strong>{baseCurrency.name} ({baseCurrency.code})</strong></li>
          <li>• All financial reports can be viewed in any supported currency</li>
          <li>• Exchange rates should be updated regularly for accuracy</li>
          <li>• Historical rates are maintained for audit and analysis purposes</li>
          <li>• Transaction rates are locked at the time of posting</li>
        </ul>
      </div>

      {/* Rate History */}
      <div className="glass-card p-6">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Rate History (Last 3 Days)</h3>

        <div className="space-y-8">
          {['USD', 'EUR'].map(currencyCode => {
            const history = currencyData.conversionHistory
              .filter(h => h.currency === currencyCode)
              .sort((a, b) => new Date(b.date) - new Date(a.date));

            const currency = rates.find(c => c.code === currencyCode);

            return (
              <div key={currencyCode} className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <h4 className="text-lg font-bold text-slate-800">
                    <span className="text-indigo-600">{currency.symbol} {currencyCode}</span> to {baseCurrency.code}
                  </h4>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">History</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="table-premium w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left">Date</th>
                        <th className="text-right">Rate</th>
                        <th className="text-right">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((record, idx) => {
                        const nextRecord = history[idx + 1];
                        const change = nextRecord ? record.rate - nextRecord.rate : 0;
                        const changePercent = nextRecord ? (change / nextRecord.rate) * 100 : 0;

                        return (
                          <tr key={`${record.currency}-${record.date}`}>
                            <td className="font-medium text-slate-700">{record.date}</td>
                            <td className="text-right font-mono text-indigo-700 font-bold">
                              {record.rate.toFixed(4)}
                            </td>
                            <td className="text-right">
                              {nextRecord ? (
                                <span className={`inline-flex items-center gap-1 font-bold ${change >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                  {change >= 0 ? '+' : ''}{change.toFixed(4)} ({changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%)
                                </span>
                              ) : (
                                <span className="text-slate-400 font-medium">Initial</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rate Updater Modal */}
      <RateUpdaterModal
        isOpen={isRateModalOpen}
        onClose={() => {
          setIsRateModalOpen(false);
          setEditingCurrency(null);
        }}
        onSave={handleUpdateRate}
        currency={editingCurrency}
        baseCurrency={baseCurrency}
      />
    </div>
  );
};

export default CurrencyManagement;
