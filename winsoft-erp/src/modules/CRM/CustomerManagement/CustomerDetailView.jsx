import React, { useMemo } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, TrendingUp, Calendar, DollarSign } from 'lucide-react';

const CustomerDetailView = ({ customer, transactions, ar, onBack }) => {
  // Calculate metrics
  const metrics = useMemo(() => {
    const invoices = transactions.filter((t) => t.type === 'invoice');
    const payments = transactions.filter((t) => t.type === 'payment');

    const totalInvoiced = invoices.reduce((sum, t) => sum + t.amount, 0);
    const totalPaid = payments.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const averageInvoiceAmount = invoices.length > 0 ? totalInvoiced / invoices.length : 0;

    // Calculate overdue invoices (assuming 30-day terms)
    const today = new Date();
    const overdue = transactions.filter((t) => {
      if (t.type !== 'invoice') return false;
      const transactionDate = new Date(t.date);
      const dueDateDays = 30;
      const dueDate = new Date(transactionDate);
      dueDate.setDate(dueDate.getDate() + dueDateDays);
      return dueDate < today && ar > 0;
    });

    return {
      totalInvoiced,
      totalPaid,
      averageInvoiceAmount,
      invoiceCount: invoices.length,
      paymentCount: payments.length,
      overdueAmount:
        overdue.length > 0
          ? overdue.reduce(
              (sum, t) =>
                sum + t.amount * (Math.floor((today - new Date(t.date)) / (1000 * 60 * 60 * 24)) > 30 ? 1 : 0),
              0,
            )
          : 0,
    };
  }, [transactions, ar]);

  // Group transactions by month
  const transactionsByMonth = useMemo(() => {
    const grouped = {};
    transactions.forEach((txn) => {
      const date = new Date(txn.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = {
          invoices: 0,
          payments: 0,
          date: monthKey,
        };
      }

      if (txn.type === 'invoice') {
        grouped[monthKey].invoices += txn.amount;
      } else {
        grouped[monthKey].payments += Math.abs(txn.amount);
      }
    });

    return Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions]);

  const formatCurrency = (value) => `₵${value.toFixed(2)}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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

      {/* Customer Header */}
      <div className="glass-card p-8 mb-6 animate-fade-in-delayed">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600 mb-4">{customer.companyName}</h1>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600 font-medium">
                <div className="p-2 bg-slate-100/80 rounded-lg">
                  <Mail size={16} className="text-indigo-500" />
                </div>
                <a href={`mailto:${customer.email}`} className="hover:text-indigo-600 transition-colors">
                  {customer.email}
                </a>
              </div>

              <div className="flex items-center gap-3 text-slate-600 font-medium">
                <div className="p-2 bg-slate-100/80 rounded-lg">
                  <Phone size={16} className="text-indigo-500" />
                </div>
                <a href={`tel:${customer.phone}`} className="hover:text-indigo-600 transition-colors">
                  {customer.phone}
                </a>
              </div>

              <div className="flex items-start gap-3 text-slate-600 font-medium">
                <div className="p-2 bg-slate-100/80 rounded-lg mt-0.5">
                  <MapPin size={16} className="text-indigo-500" />
                </div>
                <div>
                  <div className="text-slate-800">{customer.address}</div>
                  <div>
                    {customer.city}, {customer.country}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Info */}
          <div className="space-y-4">
            <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-4 flex items-center justify-between">
              <p className="text-sm text-indigo-700/70 font-bold uppercase tracking-widest">Contact Person</p>
              <p className="text-lg font-extrabold text-indigo-900">{customer.contactPerson}</p>
            </div>

            <div className="bg-purple-50/50 border border-purple-100/50 rounded-xl p-4 flex items-center justify-between">
              <p className="text-sm text-purple-700/70 font-bold uppercase tracking-widest">Customer Category</p>
              <p className="text-lg font-extrabold text-purple-900">{customer.category}</p>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-4 flex items-center justify-between">
              <p className="text-sm text-emerald-700/70 font-bold uppercase tracking-widest">Status</p>
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  customer.status === 'Active'
                    ? 'bg-emerald-200/50 text-emerald-800'
                    : 'bg-rose-200/50 text-rose-800'
                }`}
              >
                {customer.status}
              </span>
            </div>

            {customer.taxId && (
              <div className="bg-amber-50/50 border border-amber-100/50 rounded-xl p-4 flex items-center justify-between">
                <p className="text-sm text-amber-700/70 font-bold uppercase tracking-widest">Tax ID</p>
                <p className="text-lg font-extrabold text-amber-900 font-mono">{customer.taxId}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Credit & AR Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 animate-fade-in-delayed-2">
        <div className="glass-card p-6 border-b-4 border-b-amber-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">A/R Balance</p>
            <div className="p-2 bg-amber-50 rounded-xl">
              <DollarSign size={18} className="text-amber-500" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-800">{formatCurrency(ar)}</p>
          <p className="text-xs text-slate-400 font-medium mt-2">Outstanding amount</p>
        </div>

        <div className="glass-card p-6 border-b-4 border-b-purple-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Credit Limit</p>
            <div className="p-2 bg-purple-50 rounded-xl">
              <DollarSign size={18} className="text-purple-500" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-800">{formatCurrency(customer.creditLimit)}</p>
          <p className="text-xs text-slate-400 font-medium mt-2">
            <span className="font-bold text-purple-600">{((ar / customer.creditLimit) * 100).toFixed(0)}%</span> utilized
          </p>
        </div>

        <div className="glass-card p-6 border-b-4 border-b-indigo-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Invoiced</p>
            <div className="p-2 bg-indigo-50 rounded-xl">
              <TrendingUp size={18} className="text-indigo-500" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-800">{formatCurrency(metrics.totalInvoiced)}</p>
          <p className="text-xs text-slate-400 font-medium mt-2"><span className="font-bold text-indigo-600">{metrics.invoiceCount}</span> invoices</p>
        </div>

        <div className="glass-card p-6 border-b-4 border-b-emerald-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Paid</p>
            <div className="p-2 bg-emerald-50 rounded-xl">
              <DollarSign size={18} className="text-emerald-500" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-800">{formatCurrency(metrics.totalPaid)}</p>
          <p className="text-xs text-slate-400 font-medium mt-2"><span className="font-bold text-emerald-600">{metrics.paymentCount}</span> payments</p>
        </div>
      </div>

      {/* Monthly Activity */}
      <div className="glass-card mb-6 animate-fade-in-delayed-2 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-xl font-extrabold text-slate-800">Monthly Activity</h3>
        </div>

        {transactionsByMonth.length === 0 ? (
          <p className="text-center text-slate-500 py-8 font-medium">No transactions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-premium w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Month</th>
                  <th className="text-right">Invoices</th>
                  <th className="text-right">Payments</th>
                  <th className="text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {transactionsByMonth.map((month) => (
                  <tr key={month.date}>
                    <td className="font-bold text-slate-700">
                      {new Date(month.date + '-01').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </td>
                    <td className="text-right text-indigo-600 font-mono font-bold">
                      {formatCurrency(month.invoices)}
                    </td>
                    <td className="text-right text-emerald-600 font-mono font-bold">
                      {formatCurrency(month.payments)}
                    </td>
                    <td className="text-right font-mono font-extrabold text-slate-900">
                      {formatCurrency(month.invoices - month.payments)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="glass-card animate-fade-in-delayed-2 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-xl font-extrabold text-slate-800">Transaction History</h3>
        </div>

        {transactions.length === 0 ? (
          <p className="text-center text-slate-500 py-8 font-medium">No transactions found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-premium w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Date</th>
                  <th className="text-left">Reference</th>
                  <th className="text-left">Type</th>
                  <th className="text-right">Amount</th>
                  <th className="text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id}>
                    <td>
                      <div className="flex items-center gap-1.5 font-medium text-slate-600">
                        <Calendar size={14} className="text-indigo-400" />
                        {formatDate(txn.date)}
                      </div>
                    </td>
                    <td className="font-mono font-bold text-slate-800">{txn.reference}</td>
                    <td>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                          txn.type === 'invoice'
                            ? 'bg-indigo-100/50 text-indigo-700'
                            : 'bg-emerald-100/50 text-emerald-700'
                        }`}
                      >
                        {txn.type === 'invoice' ? 'Invoice' : 'Payment'}
                      </span>
                    </td>
                    <td className="text-right font-mono font-bold">
                      <span className={txn.type === 'invoice' ? 'text-indigo-600' : 'text-emerald-600'}>
                        {formatCurrency(txn.type === 'invoice' ? txn.amount : -txn.amount)}
                      </span>
                    </td>
                    <td className="text-slate-600 font-medium">{txn.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Additional Info */}
      <div className="bg-indigo-50/50 border border-indigo-100/50 rounded-xl p-6 mt-8 animate-fade-in-delayed-2">
        <h4 className="font-extrabold text-indigo-900 mb-3 uppercase tracking-wider text-sm">Payment Terms & Notes</h4>
        <div className="flex flex-col md:flex-row gap-8">
          <p className="text-indigo-800 font-medium">
            <span className="font-bold text-indigo-900 opacity-70 uppercase text-xs tracking-wider block mb-1">Payment Terms</span> 
            {customer.paymentTerms}
          </p>
          <p className="text-indigo-800 font-medium">
            <span className="font-bold text-indigo-900 opacity-70 uppercase text-xs tracking-wider block mb-1">Member Since</span>{' '}
            {formatDate(customer.registrationDate)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailView;
