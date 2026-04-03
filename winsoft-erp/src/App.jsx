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
import {
  LayoutDashboard, BookOpen, ClipboardList, BookMarked, CreditCard,
  Package, Users, BarChart2, TrendingUp, Scale, Activity,
  Settings, Globe, Bell, Search, ChevronRight, LogOut, User
} from 'lucide-react';
import './App.css';

const PAGE_META = {
  chartOfAccounts:    { label: 'Chart of Accounts',    icon: BookOpen },
  journalEntry:       { label: 'Journal Entry',         icon: ClipboardList },
  generalLedger:      { label: 'General Ledger',        icon: BookMarked },
  bankReconciliation: { label: 'Bank Reconciliation',   icon: CreditCard },
  inventory:          { label: 'Inventory Dashboard',   icon: Package },
  customerManagement: { label: 'Customer Management',   icon: Users },
  trialBalance:       { label: 'Trial Balance',         icon: BarChart2 },
  incomeStatement:    { label: 'Income Statement',      icon: TrendingUp },
  balanceSheet:       { label: 'Balance Sheet',         icon: Scale },
  cashFlow:           { label: 'Cash Flow Statement',   icon: Activity },
  currency:           { label: 'Currency Management',   icon: Globe },
};

const NAV_SECTIONS = [
  {
    title: 'Accounting',
    items: [
      { key: 'chartOfAccounts',    label: 'Chart of Accounts',  Icon: BookOpen },
      { key: 'journalEntry',       label: 'Journal Entry',      Icon: ClipboardList },
      { key: 'generalLedger',      label: 'General Ledger',     Icon: BookMarked },
      { key: 'bankReconciliation', label: 'Bank Reconciliation',Icon: CreditCard },
    ],
  },
  {
    title: 'Inventory',
    items: [
      { key: 'inventory', label: 'Dashboard', Icon: Package },
    ],
  },
  {
    title: 'CRM',
    items: [
      { key: 'customerManagement', label: 'Customer Management', Icon: Users },
    ],
  },
  {
    title: 'Reports',
    items: [
      { key: 'trialBalance',    label: 'Trial Balance',       Icon: BarChart2 },
      { key: 'incomeStatement', label: 'Income Statement',    Icon: TrendingUp },
      { key: 'balanceSheet',    label: 'Balance Sheet',       Icon: Scale },
      { key: 'cashFlow',        label: 'Cash Flow Statement', Icon: Activity },
    ],
  },
  {
    title: 'Settings',
    items: [
      { key: 'currency', label: 'Currency Management', Icon: Globe },
    ],
  },
];

function App() {
  const [activePage, setActivePage] = useState('chartOfAccounts');

  const currentMeta = PAGE_META[activePage] || {};

  return (
    <AppProvider>
      <div className="min-h-screen" style={{ background: 'var(--surface-0)' }}>

        {/* ── Sidebar ────────────────────────────────────────────── */}
        <aside
          className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 z-50 sidebar-glass"
          style={{ width: '256px' }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-white text-lg flex-shrink-0"
              style={{ background: 'var(--primary-gradient)', boxShadow: '0 4px 14px rgba(99,102,241,0.45)' }}
            >
              N
            </div>
            <div>
              <p className="font-extrabold text-base leading-none" style={{ color: '#e2e8f0' }}>Nexus ERP</p>
              <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Business Suite</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
            {NAV_SECTIONS.map(section => (
              <div key={section.title}>
                <p
                  className="px-3 mb-1.5 text-xs font-bold uppercase tracking-widest"
                  style={{ color: '#334155', letterSpacing: '0.1em' }}
                >
                  {section.title}
                </p>
                <div className="space-y-0.5">
                  {section.items.map(({ key, label, Icon }) => {
                    const isActive = activePage === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setActivePage(key)}
                        className={`w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all nav-link ${isActive ? 'active' : ''}`}
                      >
                        <Icon
                          size={16}
                          className="flex-shrink-0"
                          style={{ color: isActive ? '#818cf8' : '#475569' }}
                        />
                        <span className="flex-1" style={{ color: isActive ? '#a5b4fc' : '#64748b' }}>{label}</span>
                        {isActive && (
                          <ChevronRight size={12} style={{ color: '#6366f1' }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Profile Block */}
          <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div
              className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: '#cbd5e1' }}>Admin User</p>
                <p className="text-xs truncate" style={{ color: '#475569' }}>admin@nexuserp.com</p>
              </div>
              <LogOut size={14} style={{ color: '#475569', flexShrink: 0 }} />
            </div>
          </div>
        </aside>

        {/* ── Page shell ─────────────────────────────────────────── */}
        <div style={{ marginLeft: '256px' }} className="flex flex-col min-h-screen">

          {/* Top Header Bar */}
          <header
            className="sticky top-0 z-40 topbar-glass flex items-center justify-between px-6"
            style={{ height: '60px' }}
          >
            {/* Page title */}
            <div className="flex items-center gap-3">
              {currentMeta.icon && (
                <currentMeta.icon size={18} style={{ color: '#818cf8' }} />
              )}
              <h2
                className="text-sm font-semibold"
                style={{ color: '#cbd5e1' }}
              >
                {currentMeta.label || 'Nexus ERP'}
              </h2>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{ color: '#64748b', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#94a3b8'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#64748b'; }}
              >
                <Search size={15} />
              </button>

              {/* Notifications */}
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center relative transition-all"
                style={{ color: '#64748b', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#94a3b8'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='#64748b'; }}
              >
                <Bell size={15} />
                <span
                  className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ background: '#6366f1' }}
                />
              </button>

              {/* Divider */}
              <div className="w-px h-5 mx-1" style={{ background: 'rgba(255,255,255,0.08)' }} />

              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 0 2px rgba(99,102,241,0.35)' }}
              >
                A
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 px-6 py-6 animate-fade-in" style={{ color: 'var(--text-primary)' }}>
            {activePage === 'chartOfAccounts'    && <ChartOfAccounts />}
            {activePage === 'journalEntry'       && <JournalEntry />}
            {activePage === 'generalLedger'      && <GeneralLedger />}
            {activePage === 'bankReconciliation' && <BankReconciliation />}
            {activePage === 'inventory'          && <InventoryDashboard />}
            {activePage === 'customerManagement' && <CustomerManagement />}
            {activePage === 'trialBalance'       && <TrialBalance />}
            {activePage === 'incomeStatement'    && <IncomeStatement />}
            {activePage === 'balanceSheet'       && <BalanceSheet />}
            {activePage === 'cashFlow'           && <CashFlowStatement />}
            {activePage === 'currency'           && <CurrencyManagement />}
          </main>
        </div>

      </div>
    </AppProvider>
  );
}

export default App;
