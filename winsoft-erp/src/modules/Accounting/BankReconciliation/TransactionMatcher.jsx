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
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Reconciliation
        </button>

        <h1 className="text-4xl font-bold text-gray-900 mb-2">Match Transactions</h1>
        <p className="text-gray-600">
          Match bank statement transactions with general ledger entries
        </p>
      </div>

      {/* Selection Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Selected Transactions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bank Transaction Column */}
          <div className={`p-4 rounded-lg border-2 ${selectedBankTransaction ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <p className="text-sm text-gray-600 uppercase font-semibold mb-2">Bank Transaction</p>
            {selectedBankTransaction ? (
              <div>
                <p className="text-lg font-bold text-gray-900">{selectedBankTransaction.reference}</p>
                <p className="text-sm text-gray-600 mt-2">{selectedBankTransaction.description}</p>
                <p className="text-sm text-gray-600">Date: {selectedBankTransaction.date}</p>
                <p className={`text-lg font-bold mt-2 ${selectedBankTransaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedBankTransaction.type === 'credit' ? '+' : '-'}₵{selectedBankTransaction.amount.toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Select a bank transaction</p>
            )}
          </div>

          {/* GL Transaction Column */}
          <div className={`p-4 rounded-lg border-2 ${selectedGLTransaction ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
            <p className="text-sm text-gray-600 uppercase font-semibold mb-2">GL Transaction</p>
            {selectedGLTransaction ? (
              <div>
                <p className="text-lg font-bold text-gray-900">{selectedGLTransaction.reference}</p>
                <p className="text-sm text-gray-600 mt-2">{selectedGLTransaction.description}</p>
                <p className="text-sm text-gray-600">Date: {selectedGLTransaction.date}</p>
                <p className="text-lg font-bold mt-2 text-blue-600">
                  ₵{(selectedGLTransaction.debit || selectedGLTransaction.credit).toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Select a GL transaction</p>
            )}
          </div>
        </div>

        {/* Confirm Match Button */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleConfirmMatch}
            disabled={!selectedBankTransaction || !selectedGLTransaction}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
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
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <X size={20} />
            Clear Selection
          </button>
        </div>
      </div>

      {/* Two-Column Selection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bank Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Unmatched Bank Transactions ({unmatchedBankTransactions.length})
          </h3>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {unmatchedBankTransactions.length === 0 ? (
              <p className="text-gray-500">All bank transactions are matched</p>
            ) : (
              unmatchedBankTransactions.map((trans) => (
                <button
                  key={trans.id}
                  onClick={() => handleMatchClick(trans)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedBankTransaction?.id === trans.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{trans.reference}</p>
                      <p className="text-sm text-gray-600 mt-1">{trans.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{trans.date}</p>
                    </div>
                    <p className={`font-bold text-lg ml-2 flex-shrink-0 ${trans.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {trans.type === 'credit' ? '+' : '-'}₵{trans.amount.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* GL Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Matching GL Transactions {filterAmount && `(₵${parseFloat(filterAmount).toFixed(2)})`}
          </h3>

          {selectedBankTransaction && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Showing GL transactions matching: <strong>₵{selectedBankTransaction.amount.toFixed(2)}</strong>
              </p>
            </div>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {!selectedBankTransaction ? (
              <p className="text-gray-500">Select a bank transaction first</p>
            ) : filteredGLTransactions.length === 0 ? (
              <p className="text-gray-500">No matching GL transactions found</p>
            ) : (
              filteredGLTransactions.map((trans) => (
                <button
                  key={trans.id}
                  onClick={() => setSelectedGLTransaction(trans)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedGLTransaction?.id === trans.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{trans.reference}</p>
                      <p className="text-sm text-gray-600 mt-1">{trans.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{trans.date}</p>
                    </div>
                    <p className="font-bold text-lg ml-2 flex-shrink-0 text-blue-600">
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
        <h4 className="font-bold text-blue-900 mb-3">Matching Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-2">
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
