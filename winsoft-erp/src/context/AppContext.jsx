import React, { createContext, useState, useContext } from 'react';
import accountsData from '../data/accountsData.json';
import inventoryData from '../data/inventoryData.json';
import customerData from '../data/customerData.json';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initialize state with dummy data
  const [accounts, setAccounts] = useState(accountsData?.accounts || []);
  const [inventory, setInventory] = useState(inventoryData?.inventory || []);
  const [customers, setCustomers] = useState(customerData?.customers || []);
  const [journalEntries, setJournalEntries] = useState([]);

  // --- Account Actions ---
  const addAccount = (account) => {
    const newId = `${Math.max(...accounts.map(acc => parseInt(acc.id) || 0)) + 1}`.padStart(4, '0');
    const accountWithId = {
      ...account,
      id: newId,
      createdDate: new Date().toISOString().split('T')[0],
      balance: 0,
      status: 'Active'
    };
    setAccounts([...accounts, accountWithId]);
  };

  const deleteAccount = (id) => {
    setAccounts(accounts.filter(acc => acc.id !== id));
  };

  // --- Inventory Actions ---
  const addInventoryItem = (item) => {
    const newId = `INV${String(inventory.length + 1).padStart(3, '0')}`;
    setInventory([...inventory, { ...item, id: newId }]);
  };

  const updateInventoryItem = (updatedItem) => {
    setInventory(inventory.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const deleteInventoryItem = (id) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  // --- Journal Entry Actions ---
  const addJournalEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: journalEntries.length + 1,
      postedAt: new Date().toISOString()
    };
    
    // Add to journal entries
    setJournalEntries([newEntry, ...journalEntries]);

    // Update account balances based on the entry rows
    const updatedAccounts = [...accounts];
    
    entry.rows.forEach(row => {
      const accountIndex = updatedAccounts.findIndex(acc => acc.id === row.accountId);
      if (accountIndex >= 0) {
        const account = updatedAccounts[accountIndex];
        let balanceChange = 0;
        
        // Asset & Expense: Debit increases balance, Credit decreases
        // Liability, Equity, Income: Credit increases balance, Debit decreases
        if (['Asset', 'Expense'].includes(account.category)) {
          balanceChange = (row.debit || 0) - (row.credit || 0);
        } else {
          balanceChange = (row.credit || 0) - (row.debit || 0);
        }
        
        updatedAccounts[accountIndex] = {
          ...account,
          balance: account.balance + balanceChange
        };
      }
    });
    
    setAccounts(updatedAccounts);
  };

  return (
    <AppContext.Provider value={{
      accounts,
      setAccounts,
      addAccount,
      deleteAccount,
      
      inventory,
      setInventory,
      addInventoryItem,
      updateInventoryItem,
      deleteInventoryItem,
      
      customers,
      setCustomers,
      
      journalEntries,
      setJournalEntries,
      addJournalEntry
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
