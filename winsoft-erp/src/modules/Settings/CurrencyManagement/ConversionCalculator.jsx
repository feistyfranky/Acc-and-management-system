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
    <div className="glass-card p-6">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Currency Converter</h3>

      {/* Conversion Form */}
      <div className="space-y-6 mb-8">
        {/* From Currency */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">From</label>
          <div className="flex gap-3">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              step="0.01"
              min="0"
              className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 bg-white shadow-sm font-mono text-lg transition-all"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 min-w-[140px] font-bold text-slate-800 shadow-sm cursor-pointer transition-all hover:bg-white"
            >
              {supportedCurrencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </option>
              ))}
            </select>
          </div>
          {getFromCurrency && (
            <p className="text-sm font-medium text-slate-500 mt-2 ml-1">{getFromCurrency.name}</p>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={handleSwap}
            className="p-3 border-2 border-white rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-md transform hover:scale-110"
            title="Swap currencies"
          >
            <ArrowRightLeft size={20} />
          </button>
        </div>

        {/* To Currency */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">To</label>
          <div className="flex gap-3">
            <div className="flex-1 px-4 py-3 border-2 border-transparent bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl flex items-center shadow-inner">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent font-mono">
                {convertedAmount.toFixed(2)}
              </span>
            </div>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 min-w-[140px] font-bold text-slate-800 shadow-sm cursor-pointer transition-all hover:bg-white"
            >
              {supportedCurrencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </option>
              ))}
            </select>
          </div>
          {getToCurrency && (
            <p className="text-sm font-medium text-slate-500 mt-2 ml-1">{getToCurrency.name}</p>
          )}
        </div>

        {/* Exchange Rate Info */}
        {amount && parseFloat(amount) > 0 && (
          <div className="p-4 bg-emerald-50/80 border border-emerald-100 rounded-xl flex items-center gap-3 w-max">
            <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg font-bold">i</div>
            <p className="text-sm text-emerald-900 font-medium">
              1 {fromCurrency} = <span className="font-bold text-emerald-700 text-base">{(convertedAmount / parseFloat(amount)).toFixed(4)}</span> {toCurrency}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={handleAddToHistory}
          disabled={!amount || parseFloat(amount) <= 0}
          className="btn-premium flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Conversion
        </button>
        <button
          onClick={handleClear}
          className="btn-secondary flex-1 justify-center"
        >
          Clear
        </button>
      </div>

      {/* Conversion History */}
      {history.length > 0 && (
        <div className="border-t-2 border-slate-100 pt-6 mt-6">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Recent Conversions</h4>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-indigo-50/50 transition-colors border border-transparent hover:border-indigo-100"
              >
                <div className="flex-1">
                  <p className="text-slate-800 font-bold text-lg flex items-center gap-2">
                    {entry.amount.toFixed(2)} <span className="text-slate-500 text-sm font-semibold">{entry.from}</span>
                    <ArrowRightLeft size={14} className="text-slate-400 mx-1" />
                    <span className="text-indigo-600">{entry.result.toFixed(2)}</span> <span className="text-indigo-400 text-sm font-semibold">{entry.to}</span>
                  </p>
                  <p className="text-xs font-semibold text-slate-400 mt-1">{entry.timestamp}</p>
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
