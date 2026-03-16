import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import JournalEntryRow from './JournalEntryRow';

const JournalEntry = () => {
  const { accounts, journalEntries, addJournalEntry } = useAppContext();
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [memo, setMemo] = useState('');
  const [rows, setRows] = useState([
    { id: 1, accountId: '', debit: '', credit: '' },
    { id: 2, accountId: '', debit: '', credit: '' }
  ]);
  const [nextRowId, setNextRowId] = useState(3);
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate totals
  const totalDebit = rows.reduce((sum, row) => {
    const debit = parseFloat(row.debit) || 0;
    return sum + debit;
  }, 0);

  const totalCredit = rows.reduce((sum, row) => {
    const credit = parseFloat(row.credit) || 0;
    return sum + credit;
  }, 0);

  const isBalanced = totalDebit > 0 && totalCredit > 0 && Math.abs(totalDebit - totalCredit) < 0.01;
  const difference = totalDebit - totalCredit;

  // Get account name from ID
  const getAccountName = (accountId) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? account.name : '';
  };

  // Handle row changes
  const handleRowChange = (id, field, value) => {
    setRows(rows.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  // Add new row
  const handleAddRow = () => {
    setRows([...rows, { id: nextRowId, accountId: '', debit: '', credit: '' }]);
    setNextRowId(nextRowId + 1);
  };

  // Remove row
  const handleRemoveRow = (id) => {
    if (rows.length > 2) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  // Post entry
  const handlePostEntry = () => {
    if (!isBalanced || !entryDate || !memo.trim()) {
      return;
    }

    const validRows = rows.filter(row => row.accountId && (row.debit || row.credit));

    const newEntry = {
      date: entryDate,
      memo: memo,
      rows: validRows.map(row => ({
        accountId: row.accountId,
        accountName: getAccountName(row.accountId),
        debit: parseFloat(row.debit) || 0,
        credit: parseFloat(row.credit) || 0
      })),
      totalDebit: totalDebit,
      totalCredit: totalCredit
    };

    addJournalEntry(newEntry);
    setShowSuccess(true);
    
    // Reset form
    setEntryDate(new Date().toISOString().split('T')[0]);
    setMemo('');
    setRows([
      { id: 1, accountId: '', debit: '', credit: '' },
      { id: 2, accountId: '', debit: '', credit: '' }
    ]);
    setNextRowId(3);

    // Hide success message
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-8 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600 mb-2">Journal Entry</h1>
        <p className="text-slate-500 font-medium tracking-wide">Record debit and credit transactions for your accounts</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-4 shadow-sm animate-fade-in">
          <CheckCircle size={24} className="text-emerald-500" />
          <div>
            <p className="font-bold text-emerald-800">Entry Posted Successfully</p>
            <p className="text-sm font-medium text-emerald-600">Journal entry has been recorded</p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="glass-card p-6 mb-6 animate-fade-in-delayed">
        {/* Entry Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-6 border-b border-slate-100">
          <div>
            <label htmlFor="entryDate" className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Entry Date *
            </label>
            <input
              type="date"
              id="entryDate"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
            />
          </div>

          <div>
            <label htmlFor="memo" className="block text-sm font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Memo/Description *
            </label>
            <input
              type="text"
              id="memo"
              placeholder="e.g., Sales transaction, Payroll, Equipment purchase"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className={`w-full px-4 py-2.5 border bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700 ${
                memo.trim() ? 'border-slate-200' : 'border-rose-300 focus:ring-rose-500'
              }`}
            />
          </div>
        </div>

        {/* Entries Table */}
        <div className="overflow-x-auto mb-6">
          <table className="table-premium">
            <thead>
              <tr>
                <th>Account</th>
                <th className="text-right">Debit (GHS)</th>
                <th className="text-right">Credit (GHS)</th>
                <th className="w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <JournalEntryRow
                  key={row.id}
                  row={row}
                  accounts={accounts}
                  onRowChange={(field, value) => handleRowChange(row.id, field, value)}
                  onRemove={() => handleRemoveRow(row.id)}
                  canRemove={rows.length > 2}
                />
              ))}

              {/* Totals Row */}
              <tr className="bg-slate-50 border-t-2 border-slate-200">
                <td className="font-extrabold text-slate-900 uppercase tracking-widest text-sm">TOTALS</td>
                <td className="text-right">
                  <span className={`font-mono font-bold text-lg ${totalDebit > 0 ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {totalDebit.toFixed(2)}
                  </span>
                </td>
                <td className="text-right">
                  <span className={`font-mono font-bold text-lg ${totalCredit > 0 ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {totalCredit.toFixed(2)}
                  </span>
                </td>
                <td></td>
              </tr>

              {/* Difference Row */}
              {!isBalanced && (totalDebit > 0 || totalCredit > 0) && (
                <tr className="bg-rose-50/50">
                  <td className="font-extrabold text-rose-800 uppercase tracking-widest text-sm">DIFFERENCE</td>
                  <td colSpan="2" className="text-right font-mono font-bold text-lg text-rose-600">
                    {difference > 0 ? `+${difference.toFixed(2)}` : difference.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Row Button */}
        <div className="mb-6">
          <button
            onClick={handleAddRow}
            className="flex items-center gap-2 px-5 py-2.5 text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-colors font-bold shadow-sm"
          >
            <Plus size={18} />
            Add Row
          </button>
        </div>

        {/* Validation Messages */}
        <div className="mb-6 p-5 rounded-xl bg-slate-50 border border-slate-200 shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500 font-medium">
                <span className="font-bold text-slate-700 mr-2 uppercase tracking-wider">Status:</span>
                {isBalanced ? (
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md">✓ BALANCED</span>
                ) : difference === 0 && totalDebit === 0 ? (
                  <span className="text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-md">NO ENTRIES</span>
                ) : (
                  <span className="text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-md">NOT BALANCED</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">
                <span className="font-bold text-slate-700 mr-2 uppercase tracking-wider">Difference:</span>
                <span className={`font-mono text-lg font-bold ${difference === 0 && totalDebit > 0 ? 'text-emerald-600' : difference !== 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                  {difference === 0 && totalDebit > 0 ? '0.00' : difference.toFixed(2)}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Validation Errors */}
        {!memo.trim() && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm font-medium shadow-sm">
            Please enter a description for this journal entry
          </div>
        )}

        {!isBalanced && (totalDebit > 0 || totalCredit > 0) && (
          <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm font-medium shadow-sm flex items-start">
            <span className="mr-2">⚠️</span>
            <span>
              <strong className="font-bold">Debits must equal Credits.</strong> Difference: {difference > 0 ? '+' : ''}{difference.toFixed(2)}
            </span>
          </div>
        )}

        {isBalanced && !entryDate && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm font-medium shadow-sm">
            Please select an entry date
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePostEntry}
            disabled={!isBalanced || !entryDate || !memo.trim()}
            className={`flex-1 px-6 py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-sm ${
              isBalanced && entryDate && memo.trim()
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white hover:shadow-lg hover:-translate-y-0.5'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle className="inline-block mr-2" size={20} />
            Post Entry
          </button>
          <button
            onClick={() => {
              setEntryDate(new Date().toISOString().split('T')[0]);
              setMemo('');
              setRows([
                { id: 1, accountId: '', debit: '', credit: '' },
                { id: 2, accountId: '', debit: '', credit: '' }
              ]);
              setNextRowId(3);
            }}
            className="flex-1 px-6 py-3.5 btn-secondary"
          >
            Clear Form
          </button>
        </div>
      </div>

      {/* Posted Entries History */}
      {journalEntries.length > 0 && (
        <div className="glass-card p-6 animate-fade-in-delayed-2">
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-indigo-600 mb-6">
            Posted Entries <span className="text-slate-400 text-sm ml-2 font-medium bg-slate-100 px-3 py-1 rounded-full">{journalEntries.length}</span>
          </h2>
          
          <div className="space-y-4">
            {journalEntries.map((entry) => (
              <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Entry #</p>
                    <p className="font-semibold text-gray-900">{entry.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Date</p>
                    <p className="font-semibold text-gray-900">{entry.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Memo</p>
                    <p className="font-semibold text-gray-900">{entry.memo}</p>
                  </div>
                </div>

                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Account</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Debit</th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entry.rows.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-200 last:border-b-0">
                          <td className="px-3 py-2 text-gray-900">{row.accountName}</td>
                          <td className="px-3 py-2 text-right text-gray-900">
                            {row.debit > 0 ? row.debit.toFixed(2) : '-'}
                          </td>
                          <td className="px-3 py-2 text-right text-gray-900">
                            {row.credit > 0 ? row.credit.toFixed(2) : '-'}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-semibold">
                        <td className="px-3 py-2 text-gray-900">Total</td>
                        <td className="px-3 py-2 text-right text-gray-900">{entry.totalDebit.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right text-gray-900">{entry.totalCredit.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-gray-500">Posted: {new Date(entry.postedAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEntry;
