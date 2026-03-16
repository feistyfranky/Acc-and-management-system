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
    <div className="min-h-screen bg-gray-50 p-8 print:bg-white">
      {/* Header */}
      <div className="mb-8 print:mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium print:hidden"
        >
          <ArrowLeft size={20} />
          Back to Reconciliation
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Bank Reconciliation Report</h1>
        <p className="text-gray-600">
          <strong>Bank Account:</strong> {bankAccount.accountName} ({bankAccount.accountNumber})
        </p>
        <p className="text-gray-600">
          <strong>Report Date:</strong> {reportDate}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 print:hidden">
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Printer size={18} />
            Print Report
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Download size={18} />
            Export as Text
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow p-8 print:shadow-none print:p-0">
        {/* Reconciliation Status Banner */}
        <div
          className={`rounded-lg p-6 mb-8 ${
            reconciliationSummary.isBalanced
              ? 'bg-green-50 border-2 border-green-200'
              : 'bg-red-50 border-2 border-red-200'
          }`}
        >
          <h2 className={`text-2xl font-bold mb-2 ${reconciliationSummary.isBalanced ? 'text-green-900' : 'text-red-900'}`}>
            {reconciliationSummary.isBalanced ? '✓ RECONCILIATION COMPLETE' : '✗ RECONCILIATION NOT COMPLETE'}
          </h2>
          {!reconciliationSummary.isBalanced && (
            <p className="text-red-800 text-lg">
              Outstanding Difference: <strong>₵{Math.abs(reconciliationSummary.difference).toFixed(2)}</strong>
            </p>
          )}
        </div>

        {/* Summary Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Reconciliation Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 uppercase font-semibold mb-2">Bank Statement Balance</p>
              <p className="text-3xl font-bold text-blue-600">
                ₵{reconciliationSummary.bankStatementBalance.toFixed(2)}
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 uppercase font-semibold mb-2">GL Account Balance</p>
              <p className="text-3xl font-bold text-green-600">
                ₵{reconciliationSummary.glBalance.toFixed(2)}
              </p>
            </div>
            <div className={`p-6 rounded-lg border-2 ${reconciliationSummary.isBalanced ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <p className="text-sm uppercase font-semibold mb-2">
                {reconciliationSummary.isBalanced ? 'Status' : 'Difference'}
              </p>
              <p
                className={`text-3xl font-bold ${
                  reconciliationSummary.isBalanced ? 'text-green-600' : 'text-red-600'
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
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Transaction Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 uppercase font-semibold">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {matchedTransactions.length + unmatchedTransactions.length}
              </p>
            </div>
            <div className="p-4 border border-green-200 rounded-lg bg-green-50">
              <p className="text-sm text-gray-600 uppercase font-semibold">Matched</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{matchedTransactions.length}</p>
            </div>
            <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
              <p className="text-sm text-gray-600 uppercase font-semibold">Unmatched</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">{unmatchedTransactions.length}</p>
            </div>
          </div>
        </div>

        {/* Matched Transactions Detail */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Matched Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Bank Reference</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">GL Reference</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Match Type</th>
                </tr>
              </thead>
              <tbody>
                {matchedTransactions.map((trans) => (
                  <tr key={trans.id} className="border-b border-gray-200">
                    <td className="px-4 py-3 text-gray-900">{trans.date}</td>
                    <td className="px-4 py-3 font-mono text-gray-900">{trans.bankTransactionId}</td>
                    <td className="px-4 py-3 font-mono text-gray-900">{trans.glTransactionId}</td>
                    <td className="px-4 py-3 text-right font-mono text-gray-900">₵{trans.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-900">{trans.matchType}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td colSpan="3" className="px-4 py-3 font-semibold text-gray-900">
                    MATCHED SUBTOTAL
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-gray-900">
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Unmatched Bank Transactions</h3>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <p className="text-orange-900 font-semibold">
                ⚠ The following transactions require attention:
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Reference</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {unmatchedTransactions.map((trans) => (
                    <tr key={trans.id} className="border-b border-gray-200">
                      <td className="px-4 py-3 text-gray-900">{trans.date}</td>
                      <td className="px-4 py-3 font-mono text-gray-900">{trans.reference}</td>
                      <td className="px-4 py-3 text-gray-900">{trans.description}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-900">
                        <span className={trans.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                          {trans.type === 'credit' ? '+' : '-'}₵{trans.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900">{trans.reason}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 font-semibold text-gray-900">
                      UNMATCHED SUBTOTAL
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-gray-900">
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-bold text-blue-900 mb-3">Notes</h4>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• This reconciliation report was generated on {reportDate}</li>
            <li>
              • Bank account: {bankAccount.accountName} ({bankAccount.accountNumber})
            </li>
            <li>
              • All transactions have been compared between the bank statement and general ledger
            </li>
            {reconciliationSummary.isBalanced && (
              <li>• ✓ Reconciliation is complete - no outstanding items</li>
            )}
            {!reconciliationSummary.isBalanced && (
              <li>
                • ✗ Outstanding difference of ₵
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
