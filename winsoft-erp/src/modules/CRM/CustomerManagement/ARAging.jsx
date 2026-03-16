import React, { useMemo } from 'react';
import { ArrowLeft, AlertCircle, Clock } from 'lucide-react';

const ARAging = ({ customers, transactions, customerARMap, onBack }) => {
  // Calculate aging buckets
  const agingData = useMemo(() => {
    const today = new Date();
    const buckets = {
      current: { label: 'Current (0-30 days)', amount: 0, invoices: [] },
      days31_60: { label: '31-60 Days', amount: 0, invoices: [] },
      days61_90: { label: '61-90 Days', amount: 0, invoices: [] },
      days90plus: { label: '90+ Days', amount: 0, invoices: [] },
    };

    const invoices = transactions.filter((t) => t.type === 'invoice');

    invoices.forEach((invoice) => {
      const customer = customers.find((c) => c.id === invoice.customerId);
      const daysOverdue = Math.floor((today - new Date(invoice.date)) / (1000 * 60 * 60 * 24));

      if (daysOverdue <= 30) {
        buckets.current.amount += invoice.amount;
        buckets.current.invoices.push({
          ...invoice,
          customer,
          daysOverdue,
        });
      } else if (daysOverdue <= 60) {
        buckets.days31_60.amount += invoice.amount;
        buckets.days31_60.invoices.push({
          ...invoice,
          customer,
          daysOverdue,
        });
      } else if (daysOverdue <= 90) {
        buckets.days61_90.amount += invoice.amount;
        buckets.days61_90.invoices.push({
          ...invoice,
          customer,
          daysOverdue,
        });
      } else {
        buckets.days90plus.amount += invoice.amount;
        buckets.days90plus.invoices.push({
          ...invoice,
          customer,
          daysOverdue,
        });
      }
    });

    return buckets;
  }, [customers, transactions]);

  // Calculate totals
  const totals = useMemo(() => {
    let totalAR = 0;
    let totalInvoices = 0;

    Object.values(agingData).forEach((bucket) => {
      totalAR += bucket.amount;
      totalInvoices += bucket.invoices.length;
    });

    return { totalAR, totalInvoices };
  }, [agingData]);

  const formatCurrency = (value) => `₵${value.toFixed(2)}`;
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const getSeverityColor = (bucket) => {
    if (bucket === 'current') return 'bg-green-50 border-green-200';
    if (bucket === 'days31_60') return 'bg-yellow-50 border-yellow-200';
    if (bucket === 'days61_90') return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  const getSeverityBadge = (bucket) => {
    if (bucket === 'current')
      return 'bg-green-100 text-green-800 border-green-300';
    if (bucket === 'days31_60')
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (bucket === 'days61_90')
      return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-8 animate-fade-in text-slate-800">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 font-bold transition-colors bg-indigo-50/80 hover:bg-indigo-100 px-4 py-2 rounded-xl w-fit shadow-sm"
      >
        <ArrowLeft size={18} />
        Back to Customers
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600 mb-2">A/R Aging Report</h1>
        <p className="text-slate-500 font-medium tracking-wide">
          Invoices grouped by age to identify overdue accounts and collection priorities
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-delayed">
        <div className="glass-card p-6 border-b-4 border-b-indigo-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total A/R</p>
          <p className="text-3xl font-extrabold text-indigo-600">{formatCurrency(totals.totalAR)}</p>
        </div>

        <div className="glass-card p-6 border-b-4 border-b-emerald-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Invoices</p>
          <p className="text-3xl font-extrabold text-emerald-600">{totals.totalInvoices}</p>
        </div>

        <div className="glass-card p-6 border-b-4 border-b-amber-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Average Invoice</p>
          <p className="text-3xl font-extrabold text-amber-600">
            {totals.totalInvoices > 0
              ? formatCurrency(totals.totalAR / totals.totalInvoices)
              : '₵0.00'}
          </p>
        </div>
      </div>

      {/* Aging Buckets */}
      <div className="space-y-6 animate-fade-in-delayed-2">
        {Object.entries(agingData).map(([bucketKey, bucket]) => (
          <div
            key={bucketKey}
            className={`glass-card p-6 border-t-4 ${
              bucketKey === 'current' ? 'border-t-emerald-500' :
              bucketKey === 'days31_60' ? 'border-t-amber-500' :
              bucketKey === 'days61_90' ? 'border-t-orange-500' : 'border-t-rose-500'
            }`}
          >
            {/* Bucket Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  bucketKey === 'current' ? 'bg-emerald-50 text-emerald-600' :
                  bucketKey === 'days31_60' ? 'bg-amber-50 text-amber-600' :
                  bucketKey === 'days61_90' ? 'bg-orange-50 text-orange-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800">{bucket.label}</h3>
                  <p className="text-sm text-slate-500 font-medium">{bucket.invoices.length} invoices</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-slate-800">{formatCurrency(bucket.amount)}</p>
                <p className="text-sm text-slate-500 font-medium">
                  {totals.totalAR > 0
                    ? `${((bucket.amount / totals.totalAR) * 100).toFixed(1)}% of total`
                    : '0%'}
                </p>
              </div>
            </div>

            {/* Invoices Table */}
            {bucket.invoices.length === 0 ? (
              <p className="text-center text-slate-400 py-4 font-bold text-sm">No invoices in this category</p>
            ) : (
              <div className="overflow-x-auto mt-4 rounded-xl border border-slate-100">
                <table className="table-premium w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left">Date</th>
                      <th className="text-left">Customer</th>
                      <th className="text-left">Reference</th>
                      <th className="text-center">Days Due</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bucket.invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="font-medium text-slate-600">{formatDate(invoice.date)}</td>
                        <td>
                          <div className="text-slate-800 font-bold">
                            {invoice.customer?.companyName || 'Unknown'}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">
                            {invoice.customer?.contactPerson}
                          </div>
                        </td>
                        <td className="font-mono text-slate-700 font-bold">{invoice.reference}</td>
                        <td className="text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                              bucketKey === 'current' ? 'bg-emerald-100/50 text-emerald-700' :
                              bucketKey === 'days31_60' ? 'bg-amber-100/50 text-amber-700' :
                              bucketKey === 'days61_90' ? 'bg-orange-100/50 text-orange-700' : 'bg-rose-100/50 text-rose-700'
                            }`}
                          >
                            {invoice.daysOverdue} DAYS
                          </span>
                        </td>
                        <td className="text-right font-mono font-extrabold text-slate-900">
                          {formatCurrency(invoice.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Alert Info */}
      <div className="bg-rose-50/80 border border-rose-200/50 rounded-xl p-6 mt-8 animate-fade-in-delayed-2">
        <div className="flex gap-4">
          <div className="p-2 bg-rose-100 rounded-xl h-fit">
            <AlertCircle size={24} className="text-rose-600" />
          </div>
          <div>
            <h4 className="font-extrabold text-rose-900 mb-2 uppercase tracking-wide text-sm">Collection Priorities</h4>
            <ul className="text-rose-800 space-y-2 text-sm font-medium">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">•</span> <span><strong className="text-rose-900">90+ Days Overdue:</strong> Requires immediate follow-up and possible legal action</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">•</span> <span><strong className="text-rose-900">61-90 Days:</strong> Contact customer, prepare collection procedures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">•</span> <span><strong className="text-rose-900">31-60 Days:</strong> Send reminder notices and follow up on payment status</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">•</span> <span><strong className="text-rose-900">Current:</strong> Monitor to prevent aging into overdue status</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="glass-card mt-6 border-l-4 border-l-indigo-500 p-6 animate-fade-in-delayed-2">
        <h4 className="font-extrabold text-slate-800 mb-4 uppercase tracking-widest text-sm">Report Summary Distribution</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
            <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider mb-1">Current</p>
            <p className="text-2xl font-extrabold text-emerald-900">
              {totals.totalAR > 0 ? ((agingData.current.amount / totals.totalAR) * 100).toFixed(1) : '0'}%
            </p>
          </div>
          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100/50">
            <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-1">31-60 Days</p>
            <p className="text-2xl font-extrabold text-amber-900">
              {totals.totalAR > 0 ? ((agingData.days31_60.amount / totals.totalAR) * 100).toFixed(1) : '0'}%
            </p>
          </div>
          <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100/50">
            <p className="text-xs text-orange-700 font-bold uppercase tracking-wider mb-1">61-90 Days</p>
            <p className="text-2xl font-extrabold text-orange-900">
              {totals.totalAR > 0 ? ((agingData.days61_90.amount / totals.totalAR) * 100).toFixed(1) : '0'}%
            </p>
          </div>
          <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-100/50">
            <p className="text-xs text-rose-700 font-bold uppercase tracking-wider mb-1">90+ Days</p>
            <p className="text-2xl font-extrabold text-rose-900">
              {totals.totalAR > 0 ? ((agingData.days90plus.amount / totals.totalAR) * 100).toFixed(1) : '0'}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARAging;
