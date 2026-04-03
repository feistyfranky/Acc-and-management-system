import React, { useState, useMemo } from 'react';
import { Download, Calendar } from 'lucide-react';
import cashFlowData from '../../../data/cashFlowData.json';

/* ── helpers ── */
const fmt = (n) => `₵${n.toFixed(2)}`;
const clr = (n, pos = '#6ee7b7', neg = '#fca5a5') => (n >= 0 ? pos : neg);

const SectionRow = ({ label, value, muted = false }) => (
  <div className="flex justify-between items-center py-2.5 px-1 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
    <span style={{ color: muted ? '#64748b' : '#94a3b8', fontSize: '0.875rem' }}>{label}</span>
    <span
      className="font-mono font-semibold"
      style={{ color: muted ? '#64748b' : '#cbd5e1', fontSize: '0.875rem' }}
    >
      {value}
    </span>
  </div>
);

const SubRow = ({ label, value, color }) => (
  <div className="flex justify-between items-center py-2 px-1 pl-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
    <span style={{ color: '#64748b', fontSize: '0.8125rem' }}>{label}</span>
    <span className="font-mono" style={{ color: color || '#94a3b8', fontSize: '0.8125rem' }}>{value}</span>
  </div>
);

const NetRow = ({ label, value, positive }) => (
  <div
    className="flex justify-between items-center py-3 px-3 rounded-lg mt-2"
    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
  >
    <span style={{ color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
    <span
      className="font-mono font-semibold"
      style={{ color: positive ? '#6ee7b7' : '#fca5a5', fontSize: '0.9375rem' }}
    >
      {value}
    </span>
  </div>
);

const CashFlowStatement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('CF-2024-03');
  const [viewType, setViewType] = useState('single');

  const currentPeriodData = useMemo(() =>
    cashFlowData.cashFlowPeriods.find((p) => p.id === selectedPeriod),
    [selectedPeriod]
  );

  const comparisonData = useMemo(() => {
    const idx = cashFlowData.cashFlowPeriods.findIndex((p) => p.id === selectedPeriod);
    if (idx <= 0) return null;
    return { current: cashFlowData.cashFlowPeriods[idx], previous: cashFlowData.cashFlowPeriods[idx - 1] };
  }, [selectedPeriod]);

  const ytdMetrics = useMemo(() => {
    if (!currentPeriodData) return null;
    const idx = cashFlowData.cashFlowPeriods.findIndex((p) => p.id === selectedPeriod);
    const slice = cashFlowData.cashFlowPeriods.slice(0, idx + 1);
    const totalOperating = slice.reduce((s, p) => s + p.operatingActivities.netOperatingCashFlow, 0);
    const totalInvesting = slice.reduce((s, p) => s + p.investingActivities.netInvestingCashFlow, 0);
    const totalFinancing = slice.reduce((s, p) => s + p.financingActivities.netFinancingCashFlow, 0);
    return { totalOperating, totalInvesting, totalFinancing, freeCashFlow: totalOperating + totalInvesting };
  }, [currentPeriodData, selectedPeriod]);

  const handleExportCF = () => {
    const rows = [
      ['Cash Flow Statement'],
      ['Period', currentPeriodData.period],
      [''],
      ['OPERATING ACTIVITIES'],
      ['Revenue', fmt(currentPeriodData.operatingActivities.revenue)],
      ['Operating Expenses', fmt(currentPeriodData.operatingActivities.operatingExpenses)],
      ['Net Cash from Operating Activities', fmt(currentPeriodData.operatingActivities.netOperatingCashFlow)],
      [''],
      ['INVESTING ACTIVITIES'],
      ['Equipment Purchases', fmt(currentPeriodData.investingActivities.equipmentPurchases)],
      ['Depreciation', fmt(currentPeriodData.investingActivities.depreciation)],
      ['Net Cash from Investing Activities', fmt(currentPeriodData.investingActivities.netInvestingCashFlow)],
      [''],
      ['FINANCING ACTIVITIES'],
      ['Loan Proceeds', fmt(currentPeriodData.financingActivities.loanProceeds)],
      ['Capital Contribution', fmt(currentPeriodData.financingActivities.capitalContribution)],
      ['Net Cash from Financing Activities', fmt(currentPeriodData.financingActivities.netFinancingCashFlow)],
      [''],
      ['Net Change in Cash', fmt(currentPeriodData.netCashFlow)],
      ['Beginning Cash Balance', fmt(currentPeriodData.beginningCashBalance)],
      ['Ending Cash Balance', fmt(currentPeriodData.endingCashBalance)],
    ].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows);
    a.download = `CashFlowStatement_${selectedPeriod}.csv`;
    a.click();
  };

  if (!currentPeriodData || !ytdMetrics) return <div className="p-8 text-center" style={{ color: '#64748b' }}>No data available</div>;

  const op = currentPeriodData.operatingActivities;
  const inv = currentPeriodData.investingActivities;
  const fin = currentPeriodData.financingActivities;

  return (
    <div className="min-h-screen animate-fade-in" style={{ color: '#cbd5e1' }}>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#e2e8f0' }}>Cash Flow Statement</h1>
        <p style={{ color: '#475569', fontSize: '0.875rem' }}>Operating, Investing, and Financing Activities</p>
      </div>

      {/* Controls row */}
      <div className="glass-card p-4 mb-6 animate-fade-in-delayed flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="form-input px-3 py-2 text-sm"
            style={{ minWidth: '260px' }}
          >
            {cashFlowData.cashFlowPeriods.map((p) => (
              <option key={p.id} value={p.id}>{p.period} ({p.startDate} – {p.endDate})</option>
            ))}
          </select>

          <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {['single', 'comparison'].map((v) => (
              <button
                key={v}
                onClick={() => setViewType(v)}
                disabled={v === 'comparison' && !comparisonData}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-all"
                style={{
                  background: viewType === v ? 'rgba(99,102,241,0.25)' : 'transparent',
                  color: viewType === v ? '#a5b4fc' : (v === 'comparison' && !comparisonData ? '#334155' : '#64748b'),
                  cursor: v === 'comparison' && !comparisonData ? 'not-allowed' : 'pointer',
                }}
              >
                {v === 'single' ? 'Single Period' : 'Comparison'}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleExportCF} className="btn-premium flex items-center gap-2 px-4 py-2 text-sm">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {viewType === 'single' ? (
        <>
          {/* YTD metric cards — refined */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fade-in-delayed">
            {[
              { label: 'Operating CF (YTD)', value: ytdMetrics.totalOperating, color: clr(ytdMetrics.totalOperating) },
              { label: 'Free Cash Flow (YTD)', value: ytdMetrics.freeCashFlow, color: clr(ytdMetrics.freeCashFlow) },
              { label: 'Net Cash This Period', value: currentPeriodData.netCashFlow, color: clr(currentPeriodData.netCashFlow), signed: true },
              { label: 'Ending Cash Balance', value: currentPeriodData.endingCashBalance, color: '#a5b4fc' },
            ].map(({ label, value, color, signed }) => (
              <div key={label} className="glass-card p-4">
                <p style={{ color: '#475569', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.5rem' }}>{label}</p>
                <p className="font-mono font-bold" style={{ color, fontSize: '1.125rem' }}>
                  {signed && value >= 0 ? '+' : ''}{fmt(value)}
                </p>
              </div>
            ))}
          </div>

          {/* Statement body */}
          <div className="glass-card p-6 animate-fade-in-delayed-2">
            <div className="mb-5">
              <h2 className="font-semibold" style={{ color: '#e2e8f0', fontSize: '1rem' }}>{currentPeriodData.period}</h2>
              <p style={{ color: '#475569', fontSize: '0.8125rem' }}>{currentPeriodData.startDate} – {currentPeriodData.endDate}</p>
            </div>

            <div className="space-y-8">
              {/* Operating */}
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid rgba(99,102,241,0.3)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: '#6366f1' }} />
                  <span style={{ color: '#818cf8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Operating Activities</span>
                </div>
                <div>
                  <SectionRow label="Revenue" value={fmt(op.revenue)} />
                  <SectionRow label="Operating Expenses" value={fmt(op.operatingExpenses)} />
                  <div className="mt-2 mb-1" style={{ color: '#475569', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', paddingLeft: '0.25rem' }}>Working Capital Changes</div>
                  <SubRow label="Accounts Receivable (Decrease)" value={fmt(op.workingCapitalChanges.accountsReceivableDecrease)} />
                  <SubRow label="Accounts Payable (Increase)" value={fmt(op.workingCapitalChanges.accountsPayableIncrease)} />
                  <SubRow label="Inventory (Decrease)" value={fmt(op.workingCapitalChanges.inventoryDecrease)} />
                  <NetRow label="Net from Operating" value={fmt(op.netOperatingCashFlow)} positive={op.netOperatingCashFlow >= 0} />
                </div>
              </div>

              {/* Investing */}
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid rgba(139,92,246,0.3)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: '#8b5cf6' }} />
                  <span style={{ color: '#a78bfa', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Investing Activities</span>
                </div>
                <div>
                  <SectionRow label="Equipment Purchases" value={fmt(inv.equipmentPurchases)} />
                  <SectionRow label="Depreciation" value={fmt(inv.depreciation)} />
                  <NetRow label="Net from Investing" value={fmt(inv.netInvestingCashFlow)} positive={inv.netInvestingCashFlow >= 0} />
                </div>
              </div>

              {/* Financing */}
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid rgba(20,184,166,0.3)' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: '#14b8a6' }} />
                  <span style={{ color: '#5eead4', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Financing Activities</span>
                </div>
                <div>
                  <SectionRow label="Loan Proceeds" value={fmt(fin.loanProceeds)} />
                  <SectionRow label="Capital Contribution" value={fmt(fin.capitalContribution)} />
                  <NetRow label="Net from Financing" value={fmt(fin.netFinancingCashFlow)} positive={fin.netFinancingCashFlow >= 0} />
                </div>
              </div>

              {/* Summary */}
              <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <SectionRow label="Net Change in Cash" value={(currentPeriodData.netCashFlow >= 0 ? '+' : '') + fmt(currentPeriodData.netCashFlow)} />
                <SectionRow label="Beginning Cash Balance" value={fmt(currentPeriodData.beginningCashBalance)} muted />
                <div
                  className="flex justify-between items-center px-4 py-3 rounded-xl mt-3"
                  style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}
                >
                  <span style={{ color: '#a5b4fc', fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ending Cash Balance</span>
                  <span className="font-mono font-bold" style={{ color: '#a5b4fc', fontSize: '1.25rem' }}>
                    {fmt(currentPeriodData.endingCashBalance)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : comparisonData ? (
        <div className="glass-card p-6 animate-fade-in-delayed-2 overflow-x-auto">
          <h2 className="font-semibold mb-5" style={{ color: '#e2e8f0', fontSize: '1rem' }}>Period Comparison</h2>
          <table className="table-premium w-full text-sm">
            <thead>
              <tr>
                <th>Activity</th>
                <th className="text-right">{comparisonData.previous.period}</th>
                <th className="text-right">{comparisonData.current.period}</th>
                <th className="text-right">Variance</th>
                <th className="text-right">% Change</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Operating Activities', prev: comparisonData.previous.operatingActivities.netOperatingCashFlow, curr: comparisonData.current.operatingActivities.netOperatingCashFlow },
                { label: 'Investing Activities', prev: comparisonData.previous.investingActivities.netInvestingCashFlow, curr: comparisonData.current.investingActivities.netInvestingCashFlow },
                { label: 'Financing Activities', prev: comparisonData.previous.financingActivities.netFinancingCashFlow, curr: comparisonData.current.financingActivities.netFinancingCashFlow },
                { label: 'Net Cash Flow', prev: comparisonData.previous.netCashFlow, curr: comparisonData.current.netCashFlow, bold: true },
                { label: 'Ending Cash Balance', prev: comparisonData.previous.endingCashBalance, curr: comparisonData.current.endingCashBalance, bold: true, accent: true },
              ].map(({ label, prev, curr, bold, accent }) => {
                const variance = curr - prev;
                const pct = prev !== 0 ? ((variance / Math.abs(prev)) * 100).toFixed(1) : 'N/A';
                return (
                  <tr key={label} style={accent ? { background: 'rgba(99,102,241,0.06)' } : {}}>
                    <td style={{ fontWeight: bold ? 700 : 500, color: accent ? '#a5b4fc' : '#94a3b8' }}>{label}</td>
                    <td className="text-right font-mono" style={{ color: '#64748b' }}>{fmt(prev)}</td>
                    <td className="text-right font-mono" style={{ fontWeight: bold ? 700 : 400, color: bold ? '#cbd5e1' : '#94a3b8' }}>{fmt(curr)}</td>
                    <td className="text-right font-mono" style={{ color: clr(variance) }}>{fmt(variance)}</td>
                    <td className="text-right font-mono" style={{ color: pct !== 'N/A' ? clr(variance) : '#475569' }}>{pct !== 'N/A' ? `${pct}%` : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Info box */}
      <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h4 style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>About This Report</h4>
        <ul className="space-y-1.5 text-sm" style={{ color: '#475569' }}>
          {[
            ['Operating', 'Cash from normal business ops (revenue, expenses, working capital)'],
            ['Investing', 'Cash from asset acquisition/disposal and investments'],
            ['Financing', 'Cash from loans, equity, and debt repayment'],
            ['Free Cash Flow', 'Operating CF + Investing CF — available for distribution'],
          ].map(([term, desc]) => (
            <li key={term} className="flex gap-2">
              <span style={{ color: '#334155' }}>•</span>
              <span><strong style={{ color: '#64748b' }}>{term}:</strong> {desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CashFlowStatement;
