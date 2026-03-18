import React, { useMemo } from 'react';
import { ArrowLeft, Download, Printer } from 'lucide-react';

const ReconciliationReport = ({
  bankAccount,
  reconciliationSummary,
  matchedTransactions,
  unmatchedTransactions,
  onBack,
}) => {
  const reportDate = new Date().toISOString().split('T')[0];

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // Simulate PDF export
    const reportContent = generateReportContent();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportContent));
    element.setAttribute('download', `BankReconciliation_${reportDate}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generateReportContent = () => {
    let content = `
==================================================
BANK RECONCILIATION REPORT
==================================================
Report Date: ${reportDate}

BANK ACCOUNT DETAILS
--------------------
Account Name: ${bankAccount.accountName}
Account Number: ${bankAccount.accountNumber}
Bank: ${bankAccount.bank}
Currency: ${bankAccount.currency}

RECONCILIATION SUMMARY
------------------------
Bank Statement Balance: ₵${reconciliationSummary.bankStatementBalance.toFixed(2)}
GL Account Balance: ₵${reconciliationSummary.glBalance.toFixed(2)}
Difference: ₵${reconciliationSummary.difference.toFixed(2)}
Status: ${reconciliationSummary.isBalanced ? 'RECONCILED' : 'NOT RECONCILED'}

TRANSACTION SUMMARY
-------------------
Total Bank Transactions: ${matchedTransactions.length + unmatchedTransactions.length}
Matched Transactions: ${matchedTransactions.length}
Unmatched Transactions: ${unmatchedTransactions.length}

MATCHED TRANSACTIONS
--------------------
    `;

    matchedTransactions.forEach((trans) => {
      content += `
Reference: ${trans.bankTransactionId} / ${trans.glTransactionId}
Date: ${trans.date}
Amount: ₵${trans.amount.toFixed(2)}
Match Type: ${trans.matchType}
    `;
    });

    if (unmatchedTransactions.length > 0) {
      content += `
UNMATCHED TRANSACTIONS
--------------------
      `;
      unmatchedTransactions.forEach((trans) => {
        content += `
Reference: ${trans.reference}
Date: ${trans.date}
Description: ${trans.description}
Amount: ${trans.type === 'credit' ? '+' : '-'}₵${trans.amount.toFixed(2)}
Reason: ${trans.reason}
      `;
      });
    }

    content += `

==================================================
End of Report
==================================================
    `;

    return content;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in print:bg-white print:p-0 print:space-y-4">
      {/* Header */}
      <div className="mb-2 print:mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4 font-medium transition-colors print:hidden"
        >
          <ArrowLeft size={20} />
          Back to Reconciliation
        </button>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1 print:text-black print:bg-none">Bank Reconciliation Report</h1>
        <p className="text-slate-500">
          <strong className="text-slate-700">Bank Account:</strong> {bankAccount.accountName} ({bankAccount.accountNumber})
        </p>
        <p className="text-slate-500">
          <strong className="text-slate-700">Report Date:</strong> {reportDate}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="glass-card p-4 print:hidden">
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={handlePrint}
            className="btn-premium flex items-center justify-center gap-2"
          >
            <Printer size={18} />
            Print Report
          </button>
          <button
            onClick={handleExportPDF}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Download size={18} />
            Export as Text
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="glass-card p-8 print:shadow-none print:bg-transparent print:p-0">
        {/* Reconciliation Status Banner */}
        <div
          className={`p-6 mb-8 border-l-4 rounded-r-xl shadow-sm ${
            reconciliationSummary.isBalanced
              ? 'bg-emerald-50/50 border-emerald-500'
              : 'bg-rose-50/50 border-rose-500'
          }`}
        >
          <h2 className={`text-2xl font-bold mb-2 ${reconciliationSummary.isBalanced ? 'text-emerald-800' : 'text-rose-800'}`}>
            {reconciliationSummary.isBalanced ? '✓ RECONCILIATION COMPLETE' : '✗ RECONCILIATION NOT COMPLETE'}
          </h2>
          {!reconciliationSummary.isBalanced && (
            <p className="text-rose-700 text-lg border-t border-rose-200 pt-2 mt-2 inline-block">
              Outstanding Difference: <strong>₵{Math.abs(reconciliationSummary.difference).toFixed(2)}</strong>
            </p>
          )}
        </div>

        {/* Summary Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Reconciliation Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-slate-200 rounded-xl bg-slate-50/30">
              <p className="text-sm text-slate-500 uppercase font-semibold mb-2">Bank Statement Balance</p>
              <p className="text-3xl font-bold text-indigo-600">
                ₵{reconciliationSummary.bankStatementBalance.toFixed(2)}
              </p>
            </div>
            <div className="p-6 border border-slate-200 rounded-xl bg-slate-50/30">
              <p className="text-sm text-slate-500 uppercase font-semibold mb-2">GL Account Balance</p>
              <p className="text-3xl font-bold text-emerald-600">
                ₵{reconciliationSummary.glBalance.toFixed(2)}
              </p>
            </div>
            <div className={`p-6 rounded-xl border-l-4 ${reconciliationSummary.isBalanced ? 'border-emerald-500 bg-emerald-50/30' : 'border-rose-500 bg-rose-50/30'}`}>
              <p className="text-sm text-slate-500 uppercase font-semibold mb-2">
                {reconciliationSummary.isBalanced ? 'Status' : 'Difference'}
              </p>
              <p
                className={`text-3xl font-bold ${
                  reconciliationSummary.isBalanced ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {reconciliationSummary.isBalanced
                  ? 'Balanced'
                  : `₵${Math.abs(reconciliationSummary.difference).toFixed(2)}`}
              </p>
            </div>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Transaction Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/30">
              <p className="text-sm text-slate-500 uppercase font-semibold">Total Transactions</p>
              <p className="text-2xl font-bold text-slate-800 mt-2">
                {matchedTransactions.length + unmatchedTransactions.length}
              </p>
            </div>
            <div className="p-5 border border-emerald-200 rounded-xl bg-emerald-50/30">
              <p className="text-sm text-emerald-800 uppercase font-semibold">Matched</p>
              <p className="text-2xl font-bold text-emerald-600 mt-2">{matchedTransactions.length}</p>
            </div>
            <div className="p-5 border border-amber-200 rounded-xl bg-amber-50/30">
              <p className="text-sm text-amber-800 uppercase font-semibold">Unmatched</p>
              <p className="text-2xl font-bold text-amber-600 mt-2">{unmatchedTransactions.length}</p>
            </div>
          </div>
        </div>

        {/* Matched Transactions Detail */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Matched Transactions</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="table-premium w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left">Date</th>
                  <th className="text-left">Bank Reference</th>
                  <th className="text-left">GL Reference</th>
                  <th className="text-right">Amount</th>
                  <th className="text-left">Match Type</th>
                </tr>
              </thead>
              <tbody>
                {matchedTransactions.map((trans) => (
                  <tr key={trans.id}>
                    <td>{trans.date}</td>
                    <td className="font-mono text-slate-600">{trans.bankTransactionId}</td>
                    <td className="font-mono text-slate-600">{trans.glTransactionId}</td>
                    <td className="text-right font-mono font-bold text-slate-800">₵{trans.amount.toFixed(2)}</td>
                    <td>{trans.matchType}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50/50">
                <tr>
                  <td colSpan="3" className="font-bold text-slate-800 tracking-wide uppercase">
                    MATCHED SUBTOTAL
                  </td>
                  <td className="text-right font-mono font-extrabold text-indigo-700 text-lg">
                    ₵{matchedTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Unmatched Transactions Detail */}
        {unmatchedTransactions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">Unmatched Bank Transactions</h3>
            <div className="bg-amber-50/50 border-l-4 border-amber-500 p-4 mb-4 rounded-r-lg">
              <p className="text-amber-800 font-semibold flex items-center gap-2">
                <AlertCircle size={18} />
                The following transactions require attention:
              </p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="table-premium w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left">Date</th>
                    <th className="text-left">Reference</th>
                    <th className="text-left">Description</th>
                    <th className="text-right">Amount</th>
                    <th className="text-left">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {unmatchedTransactions.map((trans) => (
                    <tr key={trans.id}>
                      <td>{trans.date}</td>
                      <td className="font-mono text-slate-600">{trans.reference}</td>
                      <td className="font-medium text-slate-800">{trans.description}</td>
                      <td className="text-right font-mono font-bold">
                        <span className={trans.type === 'credit' ? 'text-emerald-600' : 'text-rose-500'}>
                          {trans.type === 'credit' ? '+' : '-'}₵{trans.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="italic text-slate-500">{trans.reason}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50/50">
                  <tr>
                    <td colSpan="3" className="font-bold text-slate-800 tracking-wide uppercase">
                      UNMATCHED SUBTOTAL
                    </td>
                    <td className="text-right font-mono font-extrabold text-amber-600 text-lg">
                      ₵{unmatchedTransactions.reduce((sum, t) => sum + (t.type === 'credit' ? t.amount : -t.amount), 0).toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Reconciliation Notes */}
        <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-6 print:border-none print:p-0">
          <h4 className="font-bold text-indigo-900 mb-3 print:text-black">Notes</h4>
          <ul className="text-sm text-indigo-800 space-y-2 print:text-black">
            <li>• This reconciliation report was generated on {reportDate}</li>
            <li>
              • Bank account: {bankAccount.accountName} ({bankAccount.accountNumber})
            </li>
            <li>
              • All transactions have been compared between the bank statement and general ledger
            </li>
            {reconciliationSummary.isBalanced && (
              <li><span className="text-emerald-600 font-bold print:text-black">✓</span> Reconciliation is complete - no outstanding items</li>
            )}
            {!reconciliationSummary.isBalanced && (
              <li>
                <span className="text-rose-600 font-bold print:text-black">✗</span> Outstanding difference of ₵
                {Math.abs(reconciliationSummary.difference).toFixed(2)} must be resolved
              </li>
            )}
            <li>• Keep this report for audit trail and record-keeping purposes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReconciliationReport;
