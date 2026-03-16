# WinSoft ERP - Frontend Application

A robust, data-agnostic web-based accounting suite for printing press operations built with React and Tailwind CSS.

## Project Structure

```
src/
├── modules/
│   ├── Accounting/
│   │   ├── ChartOfAccounts/
│   │   │   ├── ChartOfAccounts.jsx      # Main Chart of Accounts component
│   │   │   ├── AddAccountModal.jsx      # Modal for adding new accounts
│   │   │   └── index.js                 # Module export
│   │   ├── JournalEntry/                # Coming soon
│   │   └── ...
│   ├── Inventory/
│   │   ├── Dashboard.jsx                # Coming soon
│   │   └── ...
│   └── Reports/
│       ├── TrialBalance.jsx             # Coming soon
│       ├── IncomeStatement.jsx          # Coming soon
│       ├── BalanceSheet.jsx             # Coming soon
│       └── ...
├── data/
│   └── accountsData.json                # Dummy account data
├── components/                          # Reusable components (future)
├── App.jsx                              # Main app with navigation
├── index.css                            # Tailwind CSS directives
└── main.jsx
```

## Current Implementation

### 1. Chart of Accounts Management

The Chart of Accounts page provides complete account management functionality:

#### Features:
- **Searchable Table**: Search by account code, name, or description
- **Category Filtering**: Filter accounts by type (Asset, Liability, Equity, Income, Expense)
- **Dynamic Account List**: Display all accounts with balance information
- **Add Account Modal**: Form to create new accounts with validation
- **Delete Functionality**: Remove accounts from the system
- **Color-coded Categories**: Visual indicators for account types
- **Currency Display**: Formatted GHS (Ghana Cedis) currency display
- **Responsive Design**: Works on desktop and tablet devices

#### Dummy Data Includes:
- **Assets**: Cash, Bank Accounts, Accounts Receivable, Inventory (Paper, Ink, Plates), Equipment
- **Liabilities**: Accounts Payable, Short-term Loans, Long-term Loans, Accrued Expenses
- **Equity**: Capital Stock, Retained Earnings
- **Income**: Sales Revenue, Service Income, Other Income
- **Expenses**: COGS, Salaries, Rent, Utilities, Marketing, Depreciation

### 2. Navigation Structure

Sidebar navigation with sections for:
- **Accounting**: Chart of Accounts, Journal Entry (coming soon)
- **Inventory**: Dashboard (coming soon)
- **Reports**: Trial Balance, Income Statement, Balance Sheet (coming soon)
- **Settings**: Currency Management (coming soon)

## Technologies Used

- **React 19.2.0**: UI framework
- **Tailwind CSS 4.2**: Utility-first styling
- **Lucide React 0.577**: Icon library
- **Vite 7.3**: Build tool and dev server
- **PostCSS**: CSS processing with Tailwind CSS plugin

## Getting Started

### Installation

```bash
cd winsoft-erp
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5174/`

### Build

```bash
npm run build
```

Production build will be created in the `dist/` directory.

## Component Specifications

### ChartOfAccounts.jsx

Main component managing the chart of accounts interface.

**Props**: None (uses local state)

**State**:
- `searchTerm`: Current search query
- `selectedCategory`: Active category filter
- `accounts`: Array of account objects
- `isModalOpen`: Modal visibility state

**Key Methods**:
- `filteredAccounts`: Memoized filtered account list
- `handleAddAccount()`: Add new account and update state
- `handleDeleteAccount()`: Remove account with confirmation
- `getCategoryColor()`: Return Tailwind color classes for category
- `formatCurrency()`: Format numbers as GHS currency

### AddAccountModal.jsx

Modal component for creating new accounts.

**Props**:
- `isOpen`: boolean - Modal visibility
- `onClose`: function - Close handler
- `onAddAccount`: function - Submit handler

**Form Fields**:
- Account Name (required)
- Category (dropdown: Asset/Liability/Equity/Income/Expense)
- Subcategory (dynamic dropdown based on category)
- Description (required, textarea)
- Currency (dropdown with GHS as default)

**Validation**:
- Account name must not be empty
- Description must not be empty
- Error messages displayed inline

## Data Structure

### Account Object

```javascript
{
  id: "1001",
  name: "Cash",
  category: "Asset",
  subcategory: "Current Asset",
  description: "Cash in hand and bank deposits",
  balance: 50000.00,
  currency: "GHS",
  status: "Active",
  createdDate: "2025-01-15"
}
```

## Design System

### Color Scheme
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Danger**: Red (#ef4444)
- **Warning**: Orange (#f97316)
- **Info**: Purple (#a855f7)

### Components
- **Buttons**: Primary (blue), Secondary (ghost), Danger (red)
- **Tables**: Striped rows, hover effects, responsive scrolling
- **Forms**: Inline labels, validation feedback, accessible inputs
- **Modals**: Centered overlay with backdrop, focus management

## Future Modules

### Journal Entry Component
- Dynamic form with multiple debit/credit rows
- Real-time balance validation
- Account type validation
- Posting functionality when balanced

### Inventory Dashboard
- Paper (GSM) tracking
- Ink inventory management
- Plates inventory tracking
- Minimum stock alerts with thresholds
- Stock history and trends

### Financial Reports
- **Trial Balance**: Real-time debit/credit verification
- **Income Statement**: Revenue and expense summary
- **Balance Sheet**: Asset, liability, and equity overview
- All reports with period selection

### Multi-Currency Support
- Currency toggle for GHS/USD/EUR
- Exchange rate management interface
- Real-time currency conversion
- historical rate tracking

## API Integration Notes

The current implementation uses dummy JSON data. When integrating with the backend API:

1. Replace `accountsData.json` with API calls using fetch or axios
2. Create API service layer in `src/services/api/`
3. Use React hooks for data fetching (useEffect, custom hooks)
4. Implement error handling and loading states
5. Add authentication context for API requests

## Development Guidelines

- Keep components focused and single-responsibility
- Use memo for performance optimization on lists
- Implement proper error boundaries
- Follow Tailwind CSS utility-first approach
- Maintain consistent naming conventions
- Document complex business logic

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Future Enhancements

- [ ] User authentication and role-based access control
- [ ] Real-time data synchronization with backend
- [ ] Advanced filtering and sorting capabilities
- [ ] Batch operations for account management
- [ ] Account reconciliation tools
- [ ] Audit trail and change history
- [ ] Export functionality (PDF, Excel)
- [ ] Mobile app version
- [ ] Dark mode support
- [ ] Internationalization (i18n)

## License

Copyright © 2025 WinSoft ERP. All rights reserved.
