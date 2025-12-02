# Customer Rewards Dashboard

A React-based single-page application for tracking customer transactions and calculating reward points. The application runs entirely client-side, loading transaction data from a local JSON file in the public folder.

## Architecture Overview

This is a **frontend-only** application with no backend server. All data processing happens in the browser.

```
src/
└── ui/           # React application (runs on port 3000)
    ├── public/
    │   └── transactions.json    # Static transaction data
    └── src/
        ├── components/          # React components
        ├── context/            # Global state management
        ├── hooks/              # Custom React hooks
        ├── services/           # Data services (client-side)
        └── utils/              # Utility functions
```

## Technology Stack

- **UI Library**: React 18+
- **UI Component Library**: Ant Design
- **Styling**: Styled Components
- **State Management**: Context API + useReducer
- **Error Handling**: ErrorBoundary component
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint + Husky pre-commit hooks

## Architecture & Design Patterns

### Component Structure

```
src/
├── components/
│   ├── Dashboard.js           # Main container
│   ├── Header.js              # App header
│   ├── TableSelector.js       # Table view switcher
│   ├── SearchBox.js           # Debounced search input
│   ├── ErrorBoundary.js       # Error boundary with graceful UI
│   ├── Tables/
│   │   ├── TransactionsTable.js      # Transaction history view
│   │   ├── MonthlyRewardsTable.js    # Monthly rewards breakdown
│   │   ├── TotalRewardsTable.js      # Total rewards per customer
│   │   ├── DataTable.js              # Reusable table wrapper
│   │   ├── LoadingState.js           # Loading UI component
│   │   └── TableActionsToolbar.js    # Table actions (export, etc.)
│   └── common/
│       └── styles.js          # Shared styled components
├── context/
│   └── AppContext.js          # Global state (search, filters, view)
├── hooks/
│   └── usePaginatedApi.js     # Client-side pagination hook
├── services/
│   ├── api.js                 # API facade layer
│   ├── JSONDataService.js     # JSON data loader
│   ├── TransactionService.js  # Transaction business logic
│   └── RewardsService.js      # Rewards calculation logic
└── utils/
    └── csvExport.js           # CSV export functionality
```

### Data Flow

```
User Interaction
    ↓
Event Handler (onClick, onChange)
    ↓
Context State Update (useReducer)
    ↓
usePaginatedApi Hook
    ↓
Service Layer (JSONDataService → TransactionService/RewardsService)
    ↓
Client-side Data Processing (filtering, pagination, calculations)
    ↓
Component Re-render
```

### Service Layer Architecture

The application uses a service-oriented architecture on the client-side:

- **JSONDataService**: Loads and caches `transactions.json` from the public folder
- **TransactionService**: Handles transaction fetching
- **RewardsService**: Calculates reward points with monthly/total aggregations
- **api.js**: Proxy for async API calls

### Error Handling

- **ErrorBoundary**: Wraps the entire app to catch and display React component errors gracefully
- Potential to log errors to console for debugging

## Getting Started

### Prerequisites
- Node.js 20+ and npm

### Installation & Running

```bash
cd src/ui
npm install
npm start    # Runs on http://localhost:3000
```

### Testing

```bash
cd src/ui
npm test              # Run tests in watch mode
npm test -- --coverage   # Run tests with coverage report
```

### Code Quality

```bash
npm run lint           # Check for linting issues
npm run lint:fix       # Auto-fix linting issues
```

The project uses Husky and lint-staged for pre-commit hooks to ensure code quality.

## Features

**Implemented**
- Transaction viewing
- Pagination
- Search by customer name with debouncing
- Monthly rewards breakdown by customer
- Total rewards aggregation per customer
- CSV export functionality
- Client-side data filtering and sorting
- Responsive UI with Ant Design Component Library
- Error boundary for graceful UI error handling
- Unit Test Suite
- ESLint integration with pre-commit hooks

## Data Format

Transactions are stored in `public/transactions.json`:

```json
[
  {
    "customerId": "1",
    "transactionId": "TXNQ1A63572EE8831",
    "customerName": "Alex Miller",
    "purchaseDate": "25-03-2024",
    "product": "AJNVXEZN",
    "price": 102.39,
    "points": 54
  },
]
```

**Rewards Calculation Logic:**
- 2 points for every dollar spent over $100
- 1 point for every dollar spent between $50 and $100
- 0 points for amounts under $50

## Demo

https://github.com/user-attachments/assets/eca9a5ac-7136-44cc-888c-55662e8db9d6

## Project Structure

```
customer-rewards-dashboard/
├── src/ui/                    # React application
│   ├── public/
│   │   ├── transactions.json  # Transaction data
│   │   └── index.html
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── context/          # React Context
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Utilities
│   │   ├── App.js            # Root component
│   │   └── index.js          # Entry point
│   ├── package.json
│   └── jest.config.js
└── README.md

