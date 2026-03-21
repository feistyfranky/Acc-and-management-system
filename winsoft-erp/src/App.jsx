import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import ChartOfAccounts from './modules/Accounting/ChartOfAccounts';
import JournalEntry from './modules/Accounting/JournalEntry';
import GeneralLedger from './modules/Accounting/GeneralLedger';
import BankReconciliation from './modules/Accounting/BankReconciliation';
import InventoryDashboard from './modules/Inventory/Dashboard';
import { CustomerManagement } from './modules/CRM';
import TrialBalance from './modules/Reports/TrialBalance';
import IncomeStatement from './modules/Reports/IncomeStatement';
import BalanceSheet from './modules/Reports/BalanceSheet';
import CashFlowStatement from './modules/Reports/CashFlowStatement';
import CurrencyManagement from './modules/Settings/CurrencyManagement';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('chartOfAccounts');

  return (
    <AppProvider>
      <div className="min-h-screen text-slate-800">
        {/* Sidebar Navigation */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col z-50">
          <div className="flex flex-col flex-grow sidebar-glass pt-6 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/30 text-white font-bold text-xl">
                N
              </div>
              <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                Nexus ERP
              </div>
            </div>

            <nav className="mt-2 flex-1 px-4 space-y-8">
              {/* Accounting Section */}
              <div>
                <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Accounting</p>
                <div className="space-y-1">
                  <button
                    onClick={() => setActivePage('chartOfAccounts')}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all nav-link ${
                      activePage === 'chartOfAccounts' ? 'active shadow-lg shadow-black/20' : 'text-slate-400'
                    }`}
                  >
                    Chart of Accounts
                  </button>
                  <button
                    onClick={() => setActivePage('journalEntry')}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all nav-link ${
                      activePage === 'journalEntry' ? 'active shadow-lg shadow-black/20' : 'text-slate-400'
                    }`}
                  >
                    Journal Entry
                  </button>
                  <button
                    onClick={() => setActivePage('generalLedger')}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all nav-link ${
                      activePage === 'generalLedger' ? 'active shadow-lg shadow-black/20' : 'text-slate-400'
                    }`}
                  >
                    General Ledger
                  </button>
                  <button
                    onClick={() => setActivePage('bankReconciliation')}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all nav-link ${
                      activePage === 'bankReconciliation' ? 'active shadow-lg shadow-black/20' : 'text-slate-400'
                    }`}
                  >
                    Bank Reconciliation
                  </button>
                </div>
              </div>

              {/* Inventory Section */}
              <div>
                <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Inventory</p>
                <div className="space-y-1">
                  <button
                    onClick={() => setActivePage('inventory')}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all nav-link ${
                      activePage === 'inventory' ? 'active shadow-lg shadow-black/20' : 'text-slate-400'
                    }`}
                  >
                    Dashboard
                  </button>
                </div>
              </div>

              {/* CRM Section */}
              <div>
                <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">CRM</p>
                <div className="space-y-1">
                  <button
                    onClick={() => setActivePage('customerManagement')}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all nav-link ${
                      activePage === 'customerManagement' ? 'active shadow-lg shadow-black/20' : 'text-slate-400'
                    }`}
                  >
                    Customer Management
                  </button>
                </div>
              </div>

              {/* Reports Section */}
              <div>
                <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Reports</p>
                <div className="space-y-1">
                  <button
                    onClick={() => setActivePage('trialBalance')}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all nav-link ${
                      activePage === 'trialBalance' ? 'active shadow-lg shadow-black/20' : 'text-slate-400'
                    }`}
                  >
                    Trial Balance
                  </button>
                  <button
                    onClick={() => setActivePage('incomeStatement')}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all nav-link ${
                      activePage === 'incomeStatement' ? 'active shadow-lg shadow-black/20' : 'text-slate-400'
                    }`}
                  >
                    Income Statement
                  </button>
                  <button
                    onClick={() => setActivePage('balanceSheet')}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all nav-link ${
                      activePage === 'balanceSheet' ? 'active shadow-lg shadow-black/20' : 'text-slate-400'
                    }`}
                  >
                    Balance Sheet
                  </button>
                  <button
                    onClick={() => setActivePage('cashFlow')}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all nav-link ${
                      activePage === 'cashFlow' ? 'active shadow-lg shadow-black/20' : 'text-slate-400'
                    }`}
                  >
                    Cash Flow Statement
                  </button>
                </div>
              </div>

              {/* Settings Section */}
              <div>
                <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Settings</p>
                <div className="space-y-1">
                  <button
                    onClick={() => setActivePage('currency')}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all nav-link ${
                      activePage === 'currency' ? 'active shadow-lg shadow-black/20' : 'text-slate-400'
                    }`}
                  >
                    Currency Management
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ marginLeft: '288px' }} className="relative min-h-screen">
          {/* Subtle top blur ambient light */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 px-4 sm:px-6 md:px-8 py-8 animate-fade-in">
            {activePage === 'chartOfAccounts' && <ChartOfAccounts />}
            {activePage === 'journalEntry' && <JournalEntry />}
            {activePage === 'generalLedger' && <GeneralLedger />}
            {activePage === 'bankReconciliation' && <BankReconciliation />}
            {activePage === 'inventory' && <InventoryDashboard />}
            {activePage === 'customerManagement' && <CustomerManagement />}
            {activePage === 'trialBalance' && <TrialBalance />}
            {activePage === 'incomeStatement' && <IncomeStatement />}
            {activePage === 'balanceSheet' && <BalanceSheet />}
            {activePage === 'cashFlow' && <CashFlowStatement />}
            {activePage === 'currency' && <CurrencyManagement />}
          </div>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
