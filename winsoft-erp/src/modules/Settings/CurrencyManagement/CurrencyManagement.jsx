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
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Currency Management</h1>
        <p className="text-gray-600">Manage exchange rates and multi-currency settings for WinSoft ERP</p>
      </div>

      {/* Base Currency Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm uppercase tracking-wide">Base Currency</p>
            <h2 className="text-4xl font-bold mb-2">{baseCurrency.symbol} {baseCurrency.code}</h2>
            <p className="text-blue-100">{baseCurrency.name}</p>
            <p className="text-blue-200 text-sm mt-2">All exchange rates calculated from {baseCurrency.name}</p>
          </div>
          <DollarSign size={100} className="text-blue-100" />
        </div>
      </div>

      {/* Exchange Rates Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Exchange Rates</h3>
          <button
            onClick={() => {
              setEditingCurrency(null);
              setIsRateModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
              <div key={currency.code} className="border border-gray-200 rounded-lg p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">
                      {baseCurrency.code} to {currency.code}
                    </p>
                    <h4 className="text-xl font-bold text-gray-900 mt-1">
                      {currency.symbol} {currency.code}
                    </h4>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCurrency(currency);
                      setIsRateModalOpen(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit rate"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>

                {/* Rate */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-3xl font-bold text-gray-900">
                    1 {baseCurrency.code} = {currency.rateToBase.toFixed(4)} {currency.code}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    1 {currency.code} = {(1 / currency.rateToBase).toFixed(4)} {baseCurrency.code}
                  </p>
                </div>

                {/* Change Info */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">
                    Last updated: {currency.lastUpdated}
                  </p>
                  {rateChange !== null && (
                    <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h4 className="font-bold text-blue-900 mb-3">Exchange Rate Information</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Base currency: <strong>{baseCurrency.name} ({baseCurrency.code})</strong></li>
          <li>• All financial reports can be viewed in any supported currency</li>
          <li>• Exchange rates should be updated regularly for accuracy</li>
          <li>• Historical rates are maintained for audit and analysis purposes</li>
          <li>• Transaction rates are locked at the time of posting</li>
        </ul>
      </div>

      {/* Rate History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Rate History (Last 3 Days)</h3>

        <div className="space-y-6">
          {['USD', 'EUR'].map(currencyCode => {
            const history = currencyData.conversionHistory
              .filter(h => h.currency === currencyCode)
              .sort((a, b) => new Date(b.date) - new Date(a.date));

            const currency = rates.find(c => c.code === currencyCode);

            return (
              <div key={currencyCode}>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  {currency.symbol} {currencyCode} to {baseCurrency.code}
                </h4>
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase">
                        Rate
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-700 uppercase">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((record, idx) => {
                      const nextRecord = history[idx + 1];
                      const change = nextRecord ? record.rate - nextRecord.rate : 0;
                      const changePercent = nextRecord ? (change / nextRecord.rate) * 100 : 0;

                      return (
                        <tr key={`${record.currency}-${record.date}`} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{record.date}</td>
                          <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                            {record.rate.toFixed(4)}
                          </td>
                          <td className="px-4 py-3 text-right text-sm">
                            {nextRecord ? (
                              <span className={change >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                {change >= 0 ? '+' : ''}{change.toFixed(4)} ({changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%)
                              </span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
