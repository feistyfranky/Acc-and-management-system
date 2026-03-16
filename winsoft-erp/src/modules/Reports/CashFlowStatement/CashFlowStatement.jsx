import React, { useState, useMemo } from 'react';
import { Download, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import cashFlowData from '../../../data/cashFlowData.json';

const CashFlowStatement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('CF-2024-03');
  const [viewType, setViewType] = useState('single'); // single or comparison

  // Get current period data
  const currentPeriodData = useMemo(() => {
    return cashFlowData.cashFlowPeriods.find((p) => p.id === selectedPeriod);
  }, [selectedPeriod]);

  // Get comparison periods (current vs previous)
  const comparisonData = useMemo(() => {
    const currentIndex = cashFlowData.cashFlowPeriods.findIndex((p) => p.id === selectedPeriod);
    if (currentIndex <= 0) return null;

    return {
      current: cashFlowData.cashFlowPeriods[currentIndex],
      previous: cashFlowData.cashFlowPeriods[currentIndex - 1],
    };
  }, [selectedPeriod]);

  // Calculate YTD metrics
  const ytdMetrics = useMemo(() => {
    if (!currentPeriodData) return null;

    const currentIndex = cashFlowData.cashFlowPeriods.findIndex((p) => p.id === selectedPeriod);
    const periodsUpToNow = cashFlowData.cashFlowPeriods.slice(0, currentIndex + 1);

    const totalOperating = periodsUpToNow.reduce((sum, p) => sum + p.operatingActivities.netOperatingCashFlow, 0);
    const totalInvesting = periodsUpToNow.reduce((sum, p) => sum + p.investingActivities.netInvestingCashFlow, 0);
    const totalFinancing = periodsUpToNow.reduce((sum, p) => sum + p.financingActivities.netFinancingCashFlow, 0);
    const freeCashFlow = totalOperating + totalInvesting;

    return {
      totalOperating,
      totalInvesting,
      totalFinancing,
      freeCashFlow,
    };
  }, [currentPeriodData, selectedPeriod]);

  const handleExportCF = () => {
    const csvContent = [
      ['Cash Flow Statement', '', ''],
      ['Period', currentPeriodData.period, ''],
      ['', '', ''],
      ['OPERATING ACTIVITIES', '', ''],
      ['Revenue', `₵${currentPeriodData.operatingActivities.revenue.toFixed(2)}`, ''],
      ['Operating Expenses', `₵${currentPeriodData.operatingActivities.operatingExpenses.toFixed(2)}`, ''],
      ['Working Capital Changes', '', ''],
      ['  Accounts Receivable (Decrease)', `₵${currentPeriodData.operatingActivities.workingCapitalChanges.accountsReceivableDecrease.toFixed(2)}`, ''],
      ['  Accounts Payable (Increase)', `₵${currentPeriodData.operatingActivities.workingCapitalChanges.accountsPayableIncrease.toFixed(2)}`, ''],
      ['  Inventory (Decrease)', `₵${currentPeriodData.operatingActivities.workingCapitalChanges.inventoryDecrease.toFixed(2)}`, ''],
      ['Net Cash from Operating Activities', `₵${currentPeriodData.operatingActivities.netOperatingCashFlow.toFixed(2)}`, ''],
      ['', '', ''],
      ['INVESTING ACTIVITIES', '', ''],
      ['Equipment Purchases', `₵${currentPeriodData.investingActivities.equipmentPurchases.toFixed(2)}`, ''],
      ['Depreciation', `₵${currentPeriodData.investingActivities.depreciation.toFixed(2)}`, ''],
      ['Net Cash from Investing Activities', `₵${currentPeriodData.investingActivities.netInvestingCashFlow.toFixed(2)}`, ''],
      ['', '', ''],
      ['FINANCING ACTIVITIES', '', ''],
      ['Loan Proceeds', `₵${currentPeriodData.financingActivities.loanProceeds.toFixed(2)}`, ''],
      ['Capital Contribution', `₵${currentPeriodData.financingActivities.capitalContribution.toFixed(2)}`, ''],
      ['Net Cash from Financing Activities', `₵${currentPeriodData.financingActivities.netFinancingCashFlow.toFixed(2)}`, ''],
      ['', '', ''],
      ['Net Change in Cash', `₵${currentPeriodData.netCashFlow.toFixed(2)}`, ''],
      ['Beginning Cash Balance', `₵${currentPeriodData.beginningCashBalance.toFixed(2)}`, ''],
      ['Ending Cash Balance', `₵${currentPeriodData.endingCashBalance.toFixed(2)}`, ''],
    ].join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `CashFlowStatement_${selectedPeriod}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!currentPeriodData || !ytdMetrics) {
    return <div className="p-8 text-center">No data available</div>;
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-8 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="mb-8 pl-2 border-l-4 border-l-indigo-500">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600 mb-2">Cash Flow Statement</h1>
        <p className="text-slate-500 font-medium tracking-wide">Operating, Investing, and Financing Activities</p>
      </div>

      {/* Period Selection & View Type */}
      <div className="glass-card p-6 mb-8 animate-fade-in-delayed">
        <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
          <div className="flex-1 w-full md:w-auto">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Select Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 transition-all font-mono"
            >
              {cashFlowData.cashFlowPeriods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.period} ({period.startDate} to {period.endDate})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setViewType('single')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                viewType === 'single'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Single Period
            </button>
            <button
              onClick={() => setViewType('comparison')}
              disabled={!comparisonData}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                viewType === 'comparison'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : comparisonData
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    : 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed'
              }`}
            >
              Period Comparison
            </button>
          </div>

          <button
            onClick={handleExportCF}
            className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2.5 btn-premium font-bold"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {viewType === 'single' ? (
        <>
          {/* YTD Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in-delayed-2">
            <div className="glass-card p-6 border-b-4 border-b-indigo-500">
              <p className="text-xs text-indigo-500 uppercase font-bold tracking-widest mb-2">Operating Cash Flow (YTD)</p>
              <p className={`text-3xl font-extrabold font-mono ${ytdMetrics.totalOperating >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ₵{ytdMetrics.totalOperating.toFixed(2)}
              </p>
            </div>
            <div className="glass-card p-6 border-b-4 border-b-emerald-500">
              <p className="text-xs text-emerald-600 uppercase font-bold tracking-widest mb-2">Free Cash Flow (YTD)</p>
              <p className={`text-3xl font-extrabold font-mono ${ytdMetrics.freeCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ₵{ytdMetrics.freeCashFlow.toFixed(2)}
              </p>
            </div>
            <div className="glass-card p-6 border-b-4 border-b-rose-500">
              <p className="text-xs text-rose-500 uppercase font-bold tracking-widest mb-2">Net Cash This Period</p>
              <p className={`text-3xl font-extrabold font-mono ${currentPeriodData.netCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {currentPeriodData.netCashFlow >= 0 ? '+' : ''}₵{currentPeriodData.netCashFlow.toFixed(2)}
              </p>
            </div>
            <div className="glass-card p-6 border-b-4 border-b-blue-500 bg-blue-50/10">
              <p className="text-xs text-blue-500 uppercase font-bold tracking-widest mb-2">Ending Cash Balance</p>
              <p className="text-3xl font-extrabold font-mono text-blue-700">₵{currentPeriodData.endingCashBalance.toFixed(2)}</p>
            </div>
          </div>

          {/* Cash Flow Statement */}
          <div className="glass-card p-8 animate-fade-in-delayed-2">
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600 mb-2">{currentPeriodData.period}</h2>
            <p className="text-sm text-gray-600 mb-6">
              {currentPeriodData.startDate} to {currentPeriodData.endDate}
            </p>

            <div className="space-y-10">
              {/* Operating Activities */}
              <div>
                <h3 className="text-lg font-extrabold text-indigo-800 mb-4 uppercase tracking-widest flex items-center gap-2">🔄 OPERATING ACTIVITIES</h3>
                <div className="space-y-4 pl-4 border-l-4 border-indigo-300">
                  <div className="flex justify-between items-center group hover:bg-slate-50 p-2 rounded-lg transition-colors">
                    <span className="text-slate-700 font-bold">Revenue</span>
                    <span className="font-mono font-bold text-emerald-600 text-lg">
                      ₵{currentPeriodData.operatingActivities.revenue.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center group hover:bg-slate-50 p-2 rounded-lg transition-colors">
                    <span className="text-slate-700 font-bold">Operating Expenses</span>
                    <span className="font-mono font-bold text-rose-600 text-lg">
                      ₵{currentPeriodData.operatingActivities.operatingExpenses.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Working Capital Changes:</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center group hover:bg-slate-50 p-2 rounded-lg transition-colors">
                        <span className="text-slate-600 ml-4 font-medium">
                          Accounts Receivable (Decrease)
                        </span>
                        <span className="font-mono text-slate-700 font-bold">
                          ₵{currentPeriodData.operatingActivities.workingCapitalChanges.accountsReceivableDecrease.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center group hover:bg-slate-50 p-2 rounded-lg transition-colors">
                        <span className="text-slate-600 ml-4 font-medium">
                          Accounts Payable (Increase)
                        </span>
                        <span className="font-mono text-emerald-600 font-bold">
                          ₵{currentPeriodData.operatingActivities.workingCapitalChanges.accountsPayableIncrease.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center group hover:bg-slate-50 p-2 rounded-lg transition-colors">
                        <span className="text-slate-600 ml-4 font-medium">Inventory (Decrease)</span>
                        <span className="font-mono text-emerald-600 font-bold">
                          ₵{currentPeriodData.operatingActivities.workingCapitalChanges.inventoryDecrease.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-slate-200 flex justify-between items-center bg-indigo-50/50 p-4 rounded-xl border-indigo-100 mt-4">
                    <span className="font-extrabold text-indigo-900 uppercase tracking-widest text-sm">
                      Net Cash from Operating Activities
                    </span>
                    <span
                      className={`font-mono font-extrabold text-xl ${
                        currentPeriodData.operatingActivities.netOperatingCashFlow >= 0
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      ₵{currentPeriodData.operatingActivities.netOperatingCashFlow.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Investing Activities */}
              <div>
                <h3 className="text-lg font-extrabold text-purple-800 mb-4 uppercase tracking-widest flex items-center gap-2">📊 INVESTING ACTIVITIES</h3>
                <div className="space-y-4 pl-4 border-l-4 border-purple-300">
                  <div className="flex justify-between items-center group hover:bg-slate-50 p-2 rounded-lg transition-colors">
                    <span className="text-slate-700 font-bold">Equipment Purchases</span>
                    <span className="font-mono font-bold text-rose-600 text-lg">
                      ₵{currentPeriodData.investingActivities.equipmentPurchases.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center group hover:bg-slate-50 p-2 rounded-lg transition-colors">
                    <span className="text-slate-700 font-bold">Depreciation</span>
                    <span className="font-mono font-bold text-emerald-600 text-lg">
                      ₵{currentPeriodData.investingActivities.depreciation.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-4 border-t-2 border-slate-200 flex justify-between items-center bg-purple-50/50 p-4 rounded-xl border-purple-100 mt-4">
                    <span className="font-extrabold text-purple-900 uppercase tracking-widest text-sm">
                      Net Cash from Investing Activities
                    </span>
                    <span
                      className={`font-mono font-extrabold text-xl ${
                        currentPeriodData.investingActivities.netInvestingCashFlow >= 0
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      ₵{currentPeriodData.investingActivities.netInvestingCashFlow.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financing Activities */}
              <div>
                <h3 className="text-lg font-extrabold text-orange-800 mb-4 uppercase tracking-widest flex items-center gap-2">💰 FINANCING ACTIVITIES</h3>
                <div className="space-y-4 pl-4 border-l-4 border-orange-300">
                  <div className="flex justify-between items-center group hover:bg-slate-50 p-2 rounded-lg transition-colors">
                    <span className="text-slate-700 font-bold">Loan Proceeds</span>
                    <span className="font-mono font-bold text-emerald-600 text-lg">
                      ₵{currentPeriodData.financingActivities.loanProceeds.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center group hover:bg-slate-50 p-2 rounded-lg transition-colors">
                    <span className="text-slate-700 font-bold">Capital Contribution</span>
                    <span className="font-mono font-bold text-emerald-600 text-lg">
                      ₵{currentPeriodData.financingActivities.capitalContribution.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-4 border-t-2 border-slate-200 flex justify-between items-center bg-orange-50/50 p-4 rounded-xl border-orange-100 mt-4">
                    <span className="font-extrabold text-orange-900 uppercase tracking-widest text-sm">
                      Net Cash from Financing Activities
                    </span>
                    <span
                      className={`font-mono font-extrabold text-xl ${
                        currentPeriodData.financingActivities.netFinancingCashFlow >= 0
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }`}
                    >
                      ₵{currentPeriodData.financingActivities.netFinancingCashFlow.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="pt-6 border-t-4 border-slate-800">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-slate-700 font-extrabold uppercase tracking-wide text-xs">Net Change in Cash</span>
                    <span
                      className={`font-mono font-extrabold text-xl ${
                        currentPeriodData.netCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {currentPeriodData.netCashFlow >= 0 ? '+' : ''}₵{currentPeriodData.netCashFlow.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <span className="text-slate-700 font-extrabold uppercase tracking-wide text-xs">Beginning Cash Balance</span>
                    <span className="font-mono font-extrabold text-xl text-slate-800">
                      ₵{currentPeriodData.beginningCashBalance.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="bg-emerald-50/80 border-2 border-emerald-200/50 rounded-2xl p-6 flex justify-between items-center shadow-sm">
                  <span className="text-xl font-extrabold text-emerald-900 uppercase tracking-widest">Ending Cash Balance</span>
                  <span className="text-4xl font-extrabold font-mono text-emerald-600 drop-shadow-sm">
                    ₵{currentPeriodData.endingCashBalance.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : comparisonData ? (
        <>
          {/* Comparison View */}
          <div className="glass-card p-8 animate-fade-in-delayed-2">
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600 mb-6">Period Comparison</h2>

            <div className="overflow-x-auto">
              <table className="table-premium w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left">
                      Activity
                    </th>
                    <th className="text-right">
                      {comparisonData.previous.period}
                    </th>
                    <th className="text-right">
                      {comparisonData.current.period}
                    </th>
                    <th className="text-right">
                      Variance
                    </th>
                    <th className="text-right">
                      % Change
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Operating */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="font-extrabold text-indigo-800 uppercase tracking-wide text-xs">Operating Activities</td>
                    <td className="px-6 py-3 text-right font-mono">
                      ₵{comparisonData.previous.operatingActivities.netOperatingCashFlow.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono">
                      ₵{comparisonData.current.operatingActivities.netOperatingCashFlow.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono">
                      ₵
                      {(
                        comparisonData.current.operatingActivities.netOperatingCashFlow -
                        comparisonData.previous.operatingActivities.netOperatingCashFlow
                      ).toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono">
                      {(
                        ((comparisonData.current.operatingActivities.netOperatingCashFlow -
                          comparisonData.previous.operatingActivities.netOperatingCashFlow) /
                          comparisonData.previous.operatingActivities.netOperatingCashFlow) *
                        100
                      ).toFixed(1)}
                      %
                    </td>
                  </tr>

                  {/* Investing */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="font-extrabold text-purple-800 uppercase tracking-wide text-xs">Investing Activities</td>
                    <td className="px-6 py-3 text-right font-mono">
                      ₵{comparisonData.previous.investingActivities.netInvestingCashFlow.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono">
                      ₵{comparisonData.current.investingActivities.netInvestingCashFlow.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono">
                      ₵
                      {(
                        comparisonData.current.investingActivities.netInvestingCashFlow -
                        comparisonData.previous.investingActivities.netInvestingCashFlow
                      ).toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono">
                      {comparisonData.previous.investingActivities.netInvestingCashFlow !== 0
                        ? (
                            ((comparisonData.current.investingActivities.netInvestingCashFlow -
                              comparisonData.previous.investingActivities.netInvestingCashFlow) /
                              Math.abs(comparisonData.previous.investingActivities.netInvestingCashFlow)) *
                            100
                          ).toFixed(1)
                        : 'N/A'}
                      %
                    </td>
                  </tr>

                  {/* Financing */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="font-extrabold text-orange-800 uppercase tracking-wide text-xs">Financing Activities</td>
                    <td className="px-6 py-3 text-right font-mono">
                      ₵{comparisonData.previous.financingActivities.netFinancingCashFlow.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono">
                      ₵{comparisonData.current.financingActivities.netFinancingCashFlow.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono">
                      ₵
                      {(
                        comparisonData.current.financingActivities.netFinancingCashFlow -
                        comparisonData.previous.financingActivities.netFinancingCashFlow
                      ).toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono">N/A</td>
                  </tr>

                  {/* Net Cash Flow */}
                  <tr className="border-t-2 border-slate-200 bg-slate-50">
                    <td className="font-extrabold text-slate-900 uppercase tracking-wide text-xs">Net Cash Flow</td>
                    <td className="px-6 py-3 text-right font-mono font-bold">
                      ₵{comparisonData.previous.netCashFlow.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono font-bold">
                      ₵{comparisonData.current.netCashFlow.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono font-bold">
                      ₵{(comparisonData.current.netCashFlow - comparisonData.previous.netCashFlow).toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono font-bold">
                      {(
                        ((comparisonData.current.netCashFlow - comparisonData.previous.netCashFlow) /
                          comparisonData.previous.netCashFlow) *
                        100
                      ).toFixed(1)}
                      %
                    </td>
                  </tr>

                  {/* Cash Balance */}
                  <tr className="bg-emerald-50/80 border-t-2 border-emerald-200 border-b-2">
                    <td className="font-extrabold text-emerald-900 uppercase tracking-wide text-xs">Ending Cash Balance</td>
                    <td className="px-6 py-3 text-right font-mono font-bold">
                      ₵{comparisonData.previous.endingCashBalance.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono font-bold">
                      ₵{comparisonData.current.endingCashBalance.toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono font-bold">
                      ₵{(comparisonData.current.endingCashBalance - comparisonData.previous.endingCashBalance).toFixed(2)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono font-bold">
                      {(
                        ((comparisonData.current.endingCashBalance -
                          comparisonData.previous.endingCashBalance) /
                          comparisonData.previous.endingCashBalance) *
                        100
                      ).toFixed(1)}
                      %
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}

      {/* Information Box */}
      <div className="bg-indigo-50/80 border border-indigo-200/60 rounded-2xl p-6 mt-8 shadow-sm">
        <h4 className="font-extrabold text-indigo-900 mb-4 uppercase tracking-widest text-sm flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700">ℹ</span>
          Cash Flow Statement Information
        </h4>
        <ul className="text-sm font-medium text-indigo-800 space-y-3 pl-2">
          <li className="flex gap-2">
            <span className="text-indigo-500 font-bold">•</span>
            <span><strong className="text-indigo-950">Operating Activities:</strong> Cash generated from normal business operations (revenue, expenses, working capital changes)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-500 font-bold">•</span>
            <span><strong className="text-indigo-950">Investing Activities:</strong> Cash from acquisition/disposal of assets and investments</span>
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-500 font-bold">•</span>
            <span><strong className="text-indigo-950">Financing Activities:</strong> Cash from loans, equity contributions, and debt repayment</span>
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-500 font-bold">•</span>
            <span><strong className="text-indigo-950">Free Cash Flow:</strong> Operating Cash Flow + Investing Cash Flow (available for distribution)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-500 font-bold">•</span>
            <span><strong className="text-indigo-950">Positive Operating CF:</strong> Indicates the business generates cash from operations, a healthy sign</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CashFlowStatement;
