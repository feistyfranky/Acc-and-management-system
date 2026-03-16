import React, { useState, useMemo } from 'react';
import { ArrowRightLeft } from 'lucide-react';

const ConversionCalculator = ({ baseCurrency, supportedCurrencies }) => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('GHS');
  const [toCurrency, setToCurrency] = useState('USD');
  const [history, setHistory] = useState([]);

  // Create a rate map for quick lookups
  const rateMap = useMemo(() => {
    const map = {};
    supportedCurrencies.forEach((curr) => {
      map[curr.code] = curr.rateToBase;
    });
    return map;
  }, [supportedCurrencies]);

  // Calculate conversion
  const convertedAmount = useMemo(() => {
    if (!amount || amount <= 0) return 0;

    const fromRate = rateMap[fromCurrency] || 1;
    const toRate = rateMap[toCurrency] || 1;

    // Convert from source to base (GHS), then base to target
    // If from is GHS and to is USD: amount * (1 GHS rate / USD rate)
    // If from is USD and to is EUR: amount * (USD rate / EUR rate)
    const result = (amount * fromRate) / toRate;
    return result;
  }, [amount, fromCurrency, toCurrency, rateMap]);

  // Get currency object by code
  const getFromCurrency = supportedCurrencies.find((c) => c.code === fromCurrency);
  const getToCurrency = supportedCurrencies.find((c) => c.code === toCurrency);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleAddToHistory = () => {
    if (amount && parseFloat(amount) > 0) {
      const newEntry = {
        id: Date.now(),
        amount: parseFloat(amount),
        from: fromCurrency,
        to: toCurrency,
        result: convertedAmount,
        timestamp: new Date().toLocaleTimeString(),
      };
      setHistory([newEntry, ...history.slice(0, 4)]); // Keep last 5 entries
    }
  };

  const handleClear = () => {
    setAmount('1');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Currency Converter</h3>

      {/* Conversion Form */}
      <div className="space-y-6 mb-8">
        {/* From Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
          <div className="flex gap-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              step="0.01"
              min="0"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
            >
              {supportedCurrencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </option>
              ))}
            </select>
          </div>
          {getFromCurrency && (
            <p className="text-xs text-gray-600 mt-1">{getFromCurrency.name}</p>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            title="Swap currencies"
          >
            <ArrowRightLeft size={20} />
          </button>
        </div>

        {/* To Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
          <div className="flex gap-3">
            <div className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center">
              <span className="text-lg font-semibold text-gray-900">
                {convertedAmount.toFixed(2)}
              </span>
            </div>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[120px]"
            >
              {supportedCurrencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </option>
              ))}
            </select>
          </div>
          {getToCurrency && (
            <p className="text-xs text-gray-600 mt-1">{getToCurrency.name}</p>
          )}
        </div>

        {/* Exchange Rate Info */}
        {amount && parseFloat(amount) > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Exchange Rate:</span> 1 {fromCurrency} = {(convertedAmount / parseFloat(amount)).toFixed(4)} {toCurrency}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={handleAddToHistory}
          disabled={!amount || parseFloat(amount) <= 0}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Save Conversion
        </button>
        <button
          onClick={handleClear}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Conversion History */}
      {history.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-bold text-gray-900 mb-4">Conversion History</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
              >
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    {entry.amount.toFixed(2)} {entry.from} → {entry.result.toFixed(2)} {entry.to}
                  </p>
                  <p className="text-xs text-gray-600">{entry.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionCalculator;
