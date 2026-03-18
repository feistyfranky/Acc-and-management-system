import React, { useState, useMemo } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';

const TransactionMatcher = ({
  bankAccount,
  bankTransactions,
  glTransactions,
  matchedTransactions,
  onMatch,
  onBack,
}) => {
  const [selectedBankTransaction, setSelectedBankTransaction] = useState(null);
  const [selectedGLTransaction, setSelectedGLTransaction] = useState(null);
  const [filterAmount, setFilterAmount] = useState('');

  // Get unmatched bank transactions
  const unmatchedBankTransactions = useMemo(() => {
    const matchedBankIds = matchedTransactions.map((m) => m.bankTransactionId);
    return bankTransactions.filter((bt) => !matchedBankIds.includes(bt.id));
  }, [bankTransactions, matchedTransactions]);

  // Get unmatched GL transactions
  const unmatchedGLTransactions = useMemo(() => {
    const matchedGLIds = matchedTransactions.map((m) => m.glTransactionId);
    return glTransactions.filter((gt) => !matchedGLIds.includes(gt.id));
  }, [glTransactions, matchedTransactions]);

  // Filter GL transactions by amount
  const filteredGLTransactions = useMemo(() => {
    if (!filterAmount || !selectedBankTransaction) return unmatchedGLTransactions;

    const targetAmount = parseFloat(filterAmount);
    return unmatchedGLTransactions.filter(
      (gt) =>
        Math.abs((gt.debit || gt.credit) - targetAmount) < 0.01
    );
  }, [unmatchedGLTransactions, filterAmount, selectedBankTransaction]);

  const handleMatchClick = (bankTrans) => {
    setSelectedBankTransaction(bankTrans);
    setFilterAmount(bankTrans.amount.toString());
  };

  const handleConfirmMatch = () => {
    if (selectedBankTransaction && selectedGLTransaction) {
      // Verify amounts match
      const glAmount = selectedGLTransaction.debit || selectedGLTransaction.credit;
      if (Math.abs(selectedBankTransaction.amount - glAmount) > 0.01) {
        alert('Amounts do not match. Please select transactions with matching amounts.');
        return;
      }

      onMatch(selectedBankTransaction.id, selectedGLTransaction.id);
      setSelectedBankTransaction(null);
      setSelectedGLTransaction(null);
      setFilterAmount('');
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="mb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Reconciliation
        </button>

        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">Match Transactions</h1>
        <p className="text-slate-500">
          Match bank statement transactions with general ledger entries
        </p>
      </div>

      {/* Selection Status */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Selected Transactions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bank Transaction Column */}
          <div className={`p-4 rounded-xl border-2 transition-colors ${selectedBankTransaction ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200'}`}>
            <p className="text-sm text-slate-500 uppercase font-semibold mb-2">Bank Transaction</p>
            {selectedBankTransaction ? (
              <div>
                <p className="text-lg font-bold text-slate-800">{selectedBankTransaction.reference}</p>
                <p className="text-sm text-slate-600 mt-2">{selectedBankTransaction.description}</p>
                <p className="text-sm text-slate-600">Date: {selectedBankTransaction.date}</p>
                <p className={`text-lg font-bold mt-2 ${selectedBankTransaction.type === 'credit' ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {selectedBankTransaction.type === 'credit' ? '+' : '-'}₵{selectedBankTransaction.amount.toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-slate-400">Select a bank transaction</p>
            )}
          </div>

          {/* GL Transaction Column */}
          <div className={`p-4 rounded-xl border-2 transition-colors ${selectedGLTransaction ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200'}`}>
            <p className="text-sm text-slate-500 uppercase font-semibold mb-2">GL Transaction</p>
            {selectedGLTransaction ? (
              <div>
                <p className="text-lg font-bold text-slate-800">{selectedGLTransaction.reference}</p>
                <p className="text-sm text-slate-600 mt-2">{selectedGLTransaction.description}</p>
                <p className="text-sm text-slate-600">Date: {selectedGLTransaction.date}</p>
                <p className="text-lg font-bold mt-2 text-indigo-600">
                  ₵{(selectedGLTransaction.debit || selectedGLTransaction.credit).toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-slate-400">Select a GL transaction</p>
            )}
          </div>
        </div>

        {/* Confirm Match Button */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleConfirmMatch}
            disabled={!selectedBankTransaction || !selectedGLTransaction}
            className="btn-premium flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50"
          >
            <Check size={20} />
            Confirm Match
          </button>
          <button
            onClick={() => {
              setSelectedBankTransaction(null);
              setSelectedGLTransaction(null);
              setFilterAmount('');
            }}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <X size={20} />
            Clear Selection
          </button>
        </div>
      </div>

      {/* Two-Column Selection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bank Transactions */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Unmatched Bank Transactions ({unmatchedBankTransactions.length})
          </h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {unmatchedBankTransactions.length === 0 ? (
              <p className="text-slate-500 text-center py-4">All bank transactions are matched</p>
            ) : (
              unmatchedBankTransactions.map((trans) => (
                <button
                  key={trans.id}
                  onClick={() => handleMatchClick(trans)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left group ${
                    selectedBankTransaction?.id === trans.id
                      ? 'border-indigo-500 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-100 bg-white/50 hover:border-indigo-300 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{trans.reference}</p>
                      <p className="text-sm text-slate-600 mt-1">{trans.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{trans.date}</p>
                    </div>
                    <p className={`font-bold text-lg ml-2 flex-shrink-0 ${trans.type === 'credit' ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {trans.type === 'credit' ? '+' : '-'}₵{trans.amount.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* GL Transactions */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Matching GL Transactions {filterAmount && `(₵${parseFloat(filterAmount).toFixed(2)})`}
          </h3>

          {selectedBankTransaction && (
            <div className="mb-4 p-4 bg-indigo-50/50 border border-indigo-200 rounded-xl">
              <p className="text-sm text-indigo-800">
                Showing GL transactions matching: <strong>₵{selectedBankTransaction.amount.toFixed(2)}</strong>
              </p>
            </div>
          )}

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {!selectedBankTransaction ? (
              <p className="text-slate-500 text-center py-4">Select a bank transaction first</p>
            ) : filteredGLTransactions.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No matching GL transactions found</p>
            ) : (
              filteredGLTransactions.map((trans) => (
                <button
                  key={trans.id}
                  onClick={() => setSelectedGLTransaction(trans)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left group ${
                    selectedGLTransaction?.id === trans.id
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-sm'
                      : 'border-slate-100 bg-white/50 hover:border-emerald-300 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">{trans.reference}</p>
                      <p className="text-sm text-slate-600 mt-1">{trans.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{trans.date}</p>
                    </div>
                    <p className="font-bold text-lg ml-2 flex-shrink-0 text-indigo-600">
                      ₵{(trans.debit || trans.credit).toFixed(2)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Information Box */}
      <div className="glass-card bg-indigo-50/30 border border-indigo-100 p-6">
        <h4 className="font-bold text-indigo-900 mb-3">Matching Instructions</h4>
        <ul className="text-sm text-indigo-800 space-y-2">
          <li>1. Select a bank transaction from the left column</li>
          <li>2. Right column will automatically filter GL transactions by matching amount</li>
          <li>3. Select the corresponding GL transaction on the right</li>
          <li>4. Click "Confirm Match" to record the match</li>
          <li>• Matched transactions will no longer appear in the unmatched list</li>
          <li>• Amounts must match exactly (within 0.01 tolerance)</li>
        </ul>
      </div>
    </div>
  );
};

export default TransactionMatcher;
