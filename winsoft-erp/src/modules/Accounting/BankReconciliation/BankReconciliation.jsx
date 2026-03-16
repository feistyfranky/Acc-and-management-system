import React, { useState, useMemo } from 'react';
import { Download, Plus, CheckCircle, XCircle, AlertCircle, Upload } from 'lucide-react';
import bankReconciliationData from '../../../data/bankReconciliationData.json';
import TransactionMatcher from './TransactionMatcher';
import ReconciliationReport from './ReconciliationReport';

const BankReconciliation = () => {
  const [selectedBankAccount, setSelectedBankAccount] = useState('BA-001');
  const [reconciliation, setReconciliation] = useState(bankReconciliationData.reconciliation);
  const [unmatchedBankTransactions, setUnmatchedBankTransactions] = useState(
    bankReconciliationData.unmatchedBankTransactions
  );
  const [adjustmentEntries, setAdjustmentEntries] = useState(
    bankReconciliationData.adjustmentEntries
  );
  const [showMatcher, setShowMatcher] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const bankAccount = bankReconciliationData.bankAccounts[0];

  // Get all bank transactions for selected account
  const allBankTransactions = useMemo(() => {
    return bankReconciliationData.bankTransactions.filter(
      (bt) => bt.bankAccountId === selectedBankAccount
    );
  }, [selectedBankAccount]);

  // Get matched transactions
  const matchedTransactions = useMemo(() => {
    return reconciliation.filter((r) => r.status === 'matched');
  }, [reconciliation]);

  // Calculate reconciliation summary
  const reconciliationSummary = useMemo(() => {
    const glBalance = bankReconciliationData.glBankTransactions.reduce((sum, trans) => {
      return sum + trans.debit - trans.credit;
    }, 0);

    const bankStatementBalance = allBankTransactions.reduce((sum, trans) => {
      return sum + (trans.type === 'credit' ? trans.amount : -trans.amount);
    }, 12000); // Starting balance

    const matchedAmount = matchedTransactions.reduce((sum, match) => {
      return sum + match.amount;
    }, 0);

    const unmatchedBankAmount = unmatchedBankTransactions.reduce((sum, trans) => {
      return sum + (trans.type === 'credit' ? trans.amount : -trans.amount);
    }, 0);

    const difference = bankStatementBalance - glBalance;

    return {
      glBalance,
      bankStatementBalance,
      matchedAmount,
      unmatchedBankAmount,
      unmatchedGLAmount: bankReconciliationData.glBankTransactions.length - matchedTransactions.length,
      difference,
      isBalanced: Math.abs(difference) < 0.01,
    };
  }, [allBankTransactions, matchedTransactions, reconciliation, unmatchedBankTransactions]);

  const handleAddAdjustment = (adjustment) => {
    setAdjustmentEntries([...adjustmentEntries, adjustment]);
    // Mark as posting
    adjustment.status = 'posted';
  };

  const handleMatchTransaction = (bankTransId, glTransId) => {
    const bankTrans = allBankTransactions.find((bt) => bt.id === bankTransId);
    const glTrans = bankReconciliationData.glBankTransactions.find((gt) => gt.id === glTransId);

    if (bankTrans && glTrans && Math.abs(bankTrans.amount - glTrans.debit) < 0.01) {
      // Create new reconciliation record
      const newRecon = {
        id: `RECON-${reconciliation.length + 1}`,
        bankAccountId: selectedBankAccount,
        bankTransactionId: bankTransId,
        glTransactionId: glTransId,
        date: bankTrans.date,
        amount: bankTrans.amount,
        status: 'matched',
        matchType: 'manual',
        matchedDate: new Date().toISOString().split('T')[0],
      };

      setReconciliation([...reconciliation, newRecon]);

      // Remove from unmatched
      setUnmatchedBankTransactions(
        unmatchedBankTransactions.filter((ut) => ut.id !== bankTransId)
      );
    }
  };

  if (showReport) {
    return (
      <ReconciliationReport
        bankAccount={bankAccount}
        reconciliationSummary={reconciliationSummary}
        matchedTransactions={matchedTransactions}
        unmatchedTransactions={unmatchedBankTransactions}
        onBack={() => setShowReport(false)}
      />
    );
  }

  if (showMatcher) {
    return (
      <TransactionMatcher
        bankAccount={bankAccount}
        bankTransactions={allBankTransactions}
        glTransactions={bankReconciliationData.glBankTransactions}
        matchedTransactions={matchedTransactions}
        onMatch={handleMatchTransaction}
        onBack={() => setShowMatcher(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Bank Reconciliation</h1>
        <p className="text-gray-600">Reconcile bank statements with general ledger transactions</p>
      </div>

      {/* Bank Account Selection */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Bank Account</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600 uppercase font-semibold mb-1">Account Name</p>
            <p className="text-lg font-bold text-gray-900">{bankAccount.accountName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 uppercase font-semibold mb-1">Account Number</p>
            <p className="text-lg font-bold font-mono text-gray-900">{bankAccount.accountNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 uppercase font-semibold mb-1">Bank</p>
            <p className="text-lg font-bold text-gray-900">{bankAccount.bank}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 uppercase font-semibold mb-1">Last Reconciled</p>
            <p className="text-lg font-bold text-gray-900">{bankAccount.lastReconciled}</p>
          </div>
        </div>
      </div>

      {/* Reconciliation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 uppercase font-semibold mb-2">Bank Statement Balance</p>
          <p className="text-3xl font-bold text-blue-600">₵{reconciliationSummary.bankStatementBalance.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 uppercase font-semibold mb-2">GL Balance</p>
          <p className="text-3xl font-bold text-green-600">₵{reconciliationSummary.glBalance.toFixed(2)}</p>
        </div>
        <div className={`rounded-lg shadow p-6 ${reconciliationSummary.isBalanced ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className="text-sm uppercase font-semibold mb-2">
            {reconciliationSummary.isBalanced ? (
              <span className="text-green-700">✓ Reconciliation Status</span>
            ) : (
              <span className="text-red-700">✗ Difference</span>
            )}
          </p>
          <p className={`text-3xl font-bold ${reconciliationSummary.isBalanced ? 'text-green-600' : 'text-red-600'}`}>
            {reconciliationSummary.isBalanced ? 'Balanced' : `₵${Math.abs(reconciliationSummary.difference).toFixed(2)}`}
          </p>
        </div>
      </div>

      {/* Reconciliation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 uppercase font-semibold mb-2">Total Transactions</p>
          <p className="text-3xl font-bold text-purple-600">{allBankTransactions.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 uppercase font-semibold mb-2">Matched</p>
          <p className="text-3xl font-bold text-green-600">{matchedTransactions.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 uppercase font-semibold mb-2">Unmatched (Bank)</p>
          <p className="text-3xl font-bold text-orange-600">{unmatchedBankTransactions.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 uppercase font-semibold mb-2">Adjustments Pending</p>
          <p className="text-3xl font-bold text-blue-600">
            {adjustmentEntries.filter((a) => a.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => setShowMatcher(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={18} />
            Match Transactions
          </button>
          <button
            onClick={() => setShowReport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Download size={18} />
            Reconciliation Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            <Upload size={18} />
            Import Bank Statement
          </button>
        </div>
      </div>

      {/* Matched Transactions */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle size={24} className="text-green-600" />
          Matched Transactions ({matchedTransactions.length})
        </h3>

        {matchedTransactions.length === 0 ? (
          <p className="text-gray-500">No transactions matched yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Bank Ref</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">GL Ref</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Type</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {matchedTransactions.map((match) => (
                  <tr key={match.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{match.date}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{match.bankTransactionId}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{match.glTransactionId}</td>
                    <td className="px-4 py-3 text-right font-mono text-gray-900">₵{match.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                        {match.matchType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <CheckCircle size={20} className="text-green-600 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Unmatched Bank Transactions */}
      {unmatchedBankTransactions.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle size={24} className="text-orange-600" />
            Unmatched Bank Transactions ({unmatchedBankTransactions.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Reference</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Reason</th>
                </tr>
              </thead>
              <tbody>
                {unmatchedBankTransactions.map((trans) => (
                  <tr key={trans.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{trans.date}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{trans.reference}</td>
                    <td className="px-4 py-3 text-gray-700">{trans.description}</td>
                    <td className="px-4 py-3 text-right font-mono text-gray-900">
                      <span className={trans.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                        {trans.type === 'credit' ? '+' : '-'}₵{trans.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{trans.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjustment Entries */}
      {adjustmentEntries.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle size={24} className="text-blue-600" />
            Adjustment Entries
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Description</th>
                  <th className="px-4 py-2 text-right font-semibold text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">Bank Reference</th>
                  <th className="px-4 py-2 text-center font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {adjustmentEntries.map((adj) => (
                  <tr key={adj.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{adj.date}</td>
                    <td className="px-4 py-3 text-gray-700">{adj.description}</td>
                    <td className="px-4 py-3 text-right font-mono text-gray-900">₵{adj.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{adj.bankTransactionReference}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          adj.status === 'posted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {adj.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Information Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
        <h4 className="font-bold text-blue-900 mb-3">Bank Reconciliation Information</h4>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Click "Match Transactions" to manually match unmatched bank transactions with GL entries</li>
          <li>• Automatic matching occurs when amounts and dates match within a tolerance</li>
          <li>• Adjustment entries are created for bank charges, interest, or other bank-originated items</li>
          <li>• Once all items are matched/adjusted, reconciliation status becomes "Balanced"</li>
          <li>• Export reconciliation report for audit trail and record keeping</li>
        </ul>
      </div>
    </div>
  );
};

export default BankReconciliation;
