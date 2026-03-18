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
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">Bank Reconciliation</h1>
        <p className="text-slate-500">Reconcile bank statements with general ledger transactions</p>
      </div>

      {/* Bank Account Selection */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Bank Account</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-slate-500 uppercase font-semibold mb-1">Account Name</p>
            <p className="text-lg font-bold text-slate-800">{bankAccount.accountName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 uppercase font-semibold mb-1">Account Number</p>
            <p className="text-lg font-bold font-mono text-slate-800">{bankAccount.accountNumber}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 uppercase font-semibold mb-1">Bank</p>
            <p className="text-lg font-bold text-slate-800">{bankAccount.bank}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 uppercase font-semibold mb-1">Last Reconciled</p>
            <p className="text-lg font-bold text-slate-800">{bankAccount.lastReconciled}</p>
          </div>
        </div>
      </div>

      {/* Reconciliation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col justify-center">
          <p className="text-sm text-slate-500 uppercase font-semibold mb-2">Bank Statement Balance</p>
          <p className="text-3xl font-bold text-indigo-600">₵{reconciliationSummary.bankStatementBalance.toFixed(2)}</p>
        </div>
        <div className="glass-card p-6 flex flex-col justify-center">
          <p className="text-sm text-slate-500 uppercase font-semibold mb-2">GL Balance</p>
          <p className="text-3xl font-bold text-emerald-600">₵{reconciliationSummary.glBalance.toFixed(2)}</p>
        </div>
        <div className={`glass-card p-6 flex flex-col justify-center border-l-4 ${reconciliationSummary.isBalanced ? 'border-emerald-500' : 'border-rose-500'}`}>
          <p className="text-sm uppercase font-semibold mb-2">
            {reconciliationSummary.isBalanced ? (
              <span className="text-emerald-700">✓ Reconciliation Status</span>
            ) : (
              <span className="text-rose-700">✗ Difference</span>
            )}
          </p>
          <p className={`text-3xl font-bold ${reconciliationSummary.isBalanced ? 'text-emerald-600' : 'text-rose-600'}`}>
            {reconciliationSummary.isBalanced ? 'Balanced' : `₵${Math.abs(reconciliationSummary.difference).toFixed(2)}`}
          </p>
        </div>
      </div>

      {/* Reconciliation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-slate-500 uppercase font-semibold mb-2">Total</p>
          <p className="text-3xl font-bold text-purple-600">{allBankTransactions.length}</p>
        </div>
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-slate-500 uppercase font-semibold mb-2">Matched</p>
          <p className="text-3xl font-bold text-emerald-600">{matchedTransactions.length}</p>
        </div>
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-slate-500 uppercase font-semibold mb-2">Unmatched Bank</p>
          <p className="text-3xl font-bold text-amber-600">{unmatchedBankTransactions.length}</p>
        </div>
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-slate-500 uppercase font-semibold mb-2">Adjustments</p>
          <p className="text-3xl font-bold text-indigo-600">
            {adjustmentEntries.filter((a) => a.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="glass-card p-6 flex flex-col md:flex-row gap-4">
        <button
          onClick={() => setShowMatcher(true)}
          className="btn-premium flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Match Transactions
        </button>
        <button
          onClick={() => setShowReport(true)}
          className="btn-premium flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
        >
          <Download size={18} />
          Reconciliation Report
        </button>
        <button className="btn-secondary flex items-center justify-center gap-2">
          <Upload size={18} />
          Import Bank Statement
        </button>
      </div>

      {/* Matched Transactions */}
      <div className="glass-card p-6 overflow-hidden">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <CheckCircle size={24} className="text-emerald-500" />
          Matched Transactions ({matchedTransactions.length})
        </h3>

        {matchedTransactions.length === 0 ? (
          <p className="text-slate-500">No transactions matched yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-premium">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Bank Ref</th>
                  <th className="px-4 py-3 text-left">GL Ref</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {matchedTransactions.map((match) => (
                  <tr key={match.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-700">{match.date}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{match.bankTransactionId}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{match.glTransactionId}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-800">₵{match.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 rounded-md text-xs font-semibold bg-emerald-100/50 text-emerald-700 border border-emerald-200">
                        {match.matchType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <CheckCircle size={20} className="text-emerald-500 mx-auto" />
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
        <div className="glass-card p-6 overflow-hidden">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertCircle size={24} className="text-amber-500" />
            Unmatched Bank Transactions ({unmatchedBankTransactions.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="table-premium">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Reference</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-left">Reason</th>
                </tr>
              </thead>
              <tbody>
                {unmatchedBankTransactions.map((trans) => (
                  <tr key={trans.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-700">{trans.date}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{trans.reference}</td>
                    <td className="px-4 py-3 text-slate-700">{trans.description}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-800">
                      <span className={trans.type === 'credit' ? 'text-emerald-600' : 'text-rose-500'}>
                        {trans.type === 'credit' ? '+' : '-'}₵{trans.amount.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{trans.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjustment Entries */}
      {adjustmentEntries.length > 0 && (
        <div className="glass-card p-6 overflow-hidden">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertCircle size={24} className="text-indigo-500" />
            Adjustment Entries
          </h3>

          <div className="overflow-x-auto">
            <table className="table-premium">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-left">Bank Reference</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {adjustmentEntries.map((adj) => (
                  <tr key={adj.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-700">{adj.date}</td>
                    <td className="px-4 py-3 text-slate-700">{adj.description}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-800">₵{adj.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{adj.bankTransactionReference}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded-md text-xs font-semibold border ${
                          adj.status === 'posted'
                            ? 'bg-emerald-100/50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-100/50 text-amber-700 border-amber-200'
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
      <div className="glass-card bg-indigo-50/30 border border-indigo-100 p-6">
        <h4 className="font-bold text-indigo-900 mb-3">Bank Reconciliation Information</h4>
        <ul className="text-sm text-indigo-800 space-y-2">
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
