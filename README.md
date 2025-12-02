# Customer Rewards Dashboard

A full-stack application for tracking customer transactions and calculating reward points. Built with Node.js/Express backend and React frontend.

# Development Style

Focus on user experience and UI design that makes the app performant, easy to use, and capable of extensibility.

## Architecture Overview

```
src/
├── api/          # Backend Node Express API server
├── ui/           # Frontend React application
├── logs/         # Server logs
└── seed-data/    # Generated transaction data during seeding
```

## Backend (`/api`)

### Technology Stack
- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: SQLite (in-memory)
- **Real-time Communication**: Socket.io
- **Logging**: Winston

### Architecture & Design Patterns

#### Service Layer Pattern
The backend follows a service-oriented architecture with separation of concerns:

**Core Services:**
- **DatabaseService**: Low-level database operations (run, all, prepare, serialize)
- **TransactionService**: Transaction domain logic (CRUD, batch operations, data generation)
- **RewardsService**: Rewards calculation and retrieval (monthly/total aggregations)
- **SeederService**: Database initialization and test data generation
- **LoggerService**: Centralized logging with Winston
- **SocketService**: WebSocket event management
- **CSVService**: CSV export functionality

### API Endpoints

```
GET  /api/transactions              # List all transactions (paginated, sortable, searchable)
GET  /api/transactions/customer/:id # Transactions by customer
POST /api/transactions              # Create new transaction

GET  /api/rewards/total             # Total rewards by customer
GET  /api/rewards/monthly/          # Monthly rewards breakdown
GET  /api/rewards/top/:id           # Top 3 months for customer

GET  /health                        # Health check
```

### Data Flow

```
Client Request
    ↓
Middleware (CORS, Logging)
    ↓
Route Handler
    ↓
Service Layer (Business Logic)
    ↓
DatabaseService (Data Access)
    ↓
SQLite Database
```

## Frontend (`/ui`)

### Technology Stack
- **UI Library**: React 18+
- **UI Component Library**: Ant Design
- **Styling/CSS**: Styled Components
- **Global state Management**: Context API + useReducer
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library

### Architecture & Design Patterns

#### Component Structure

```
src/
├── components/
│   ├── Dashboard.js           # Main container with lazy loading
│   ├── Header.js              # Table selection cards
│   ├── TableSelector.js       # Conditional table rendering
│   ├── SearchBox.js           # Debounced search input
│   ├── RefreshButton.js       # Real-time update notification
│   ├── Tables/
│   │   ├── TransactionsTable.js
│   │   ├── MonthlyRewardsTable.js
│   │   ├── TotalRewardsTable.js
│   │   ├── DataTable.js       # Reusable table wrapper
│   │   ├── LoadingState.js    # Loading UI
│   │   └── TableActionsToolbar.js
│   └── common/
│       └── styles.js          # Shared styled components
├── context/
│   └── AppContext.js          # Global state management
├── hooks/
│   ├── usePaginatedApi.js     # Declarative pagination hook
│   └── useDebounce.js         # Debouncing utility
├── services/
│   └── api.js                 # Axios configuration & API calls
└── utils/
    └── csvExport.js           # CSV export functionality
```

### Data Flow

```
User Interaction
    ↓
Event Handler (onClick, onChange)
    ↓
State Update (useState/useReducer)
    ↓
usePaginatedApi Hook
    ↓
API Service (Axios)
    ↓
Backend API
    ↓
Response Normalization
    ↓
Component Re-render
```

## Key design decisions

- **Single page navigation**: For switching between views, I avoided reloading the page by focusing on single page app design. This improves the user experience, and also makes navigation easier.
- **Domain specific services**: There is a service class for each domain i.e. Logging, Database Operations, websocket management, rewards calculations etc. The benefit of this pattern is that if the underlying implementation for any one service changes, we can make changes in that one service. For example, if we move from SQLite to MySQL, the clients consuming the database operations would not be affected. This satisfies the Single Responsibility principle. A future improvement would be to use Object oriented programming to call methods with reference to an interface specification.
- **Pre commit hooks and ESLint**: The code is linted before checkin as part of a pre-commit hook. Linting is applied during a commit, and any pending fixes are highlighted before committing the code.
- **In Memory SQLite DB**: I setup a database instance so that I could create an end to end application. I could have generated a JSON or CSV file for the transactions and allowed the UI to consume them. However, in that case we could not understand how actual APIs interact with our UI. I would also not be able to design a functional API layer on the UI and this might have made the code less extensible.
- **Custom hook for pagination**: Pagination is a good practice since it allows the UI to render faster, and also improves the user experience. A custom hook for pagination `usePaginatedAPI.js` is re-usable and the UI is able to invoke the hook for the given use cases, without dependence on the API call implementation.
- **Comprehensive Unit Test Suite**: The unit test suite, especially for core UI components such as the tables, is comprehensive and offers 90%+ code coverage. This helps catch bugs before they reach the UI. It also helps developers regression test the app prior to UI deployment.
- **Websockets**: Using websockets allows our app to maintain bi-directional communication with the server. The API can then act as a service, with backend DB modifications not affecting the user experience. The user is prompted with an alert for any changes in the data, which also allows for separation of concerns.
- **Logging and middleware**: I added logging through the middleware so that we can maintain an audit for the requests and responses. This helps us debug any failures faster. We use winston logging, which is an open source logging library.
- **Styled components**: I used styled components for CSS and styling. Styled components offer a good format for avoiding inline styling changes, and offer features such as props so that styles can be changed dynamically at run time in an easier manner. Also, avoiding inline styling is a good practice.
- **Search with debouncing**: Using search boxes with debouncing makes it easier to filter records, while preventing a load on the API server and DB. It also offers a good user experience by reducing the page paint time.

## Future improvements and like to have features
- Utilize ErrorBoundary to gracefully handle any rendering errors.
- Unit tests for the API code base.
- Typescript for strong typing and for enabling OOP.
- Provide a fallback mechanism for reading transactions from a pre-generated CSV, in case the API server is not functioning. This would keep the app usable for testing.
- Apply security fixes or patches, as per OWASP top 10.
- Base URL for socket communication with API server is currently hard coded to localhost:3000, and I should make it dynamic using environment variables.

### Backend Setup
```bash
cd src/api
npm install
npm run dev  # Runs on port 3000
```

### Frontend Setup
```bash
cd src/ui
npm install
npm start    # Runs on port 3001
```

### Testing
```bash
cd src/ui
npm test     # Run Jest tests
```

### Linting
```bash
npm run lint
npm run lint:fix #Apply changes for fixable lint issues implicity.
```

### Debugging
```
The src/logs folder will contain the logs for any interaction with the app. Try to analyze them first for any errors or glitches faced while using the app.
```

### Demo

https://github.com/user-attachments/assets/c32f9a06-c4b2-47d4-94c1-a37c011bc799