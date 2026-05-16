# Task Manager - Jest Testing Project

A complete JavaScript Task Manager application with a comprehensive Jest test suite.

![Test Image](assets/images/TaskManagment.png)


## Project Structure

```
task-manager-jest/
├── src/
│   ├── taskUtils.js          # Utility functions (validate, format, filter, sort, etc.)
│   ├── taskDB.js             # Async in-memory database layer
│   ├── apiService.js         # Fetch-based API service (GET, POST, PUT, DELETE)
│   ├── notificationService.js # Email/SMS notification service
│   └── taskManager.js        # Main TaskManager class (integrates all modules)
│
├── tests/
│   ├── unit/
│   │   └── taskUtils.test.js      # Unit tests for utility functions
│   ├── async/
│   │   └── taskDB.test.js         # Async/await + Promise tests for DB
│   ├── mock/
│   │   └── notifications.test.js  # jest.fn(), jest.mock(), jest.spyOn()
│   ├── integration/
│   │   └── taskManager.test.js    # Integration tests across modules
│   └── api/
│       └── apiService.test.js     # API endpoint tests (GET/POST/PUT/DELETE)
│
├── package.json
└── README.md
```

## Setup

```bash
npm install
```

## Running Tests

```bash
# Run all tests with coverage report
npm test

# Run specific test suites
npm run test:unit
npm run test:async
npm run test:mock
npm run test:integration
npm run test:api
```

## Test Categories

| Category | File | Coverage |
|----------|------|----------|
| Unit | `tests/unit/taskUtils.test.js` | Numbers, strings, arrays, objects, edge cases |
| Async | `tests/async/taskDB.test.js` | async/await and Promise-based tests |
| Mock | `tests/mock/notifications.test.js` | jest.fn(), jest.mock(), jest.spyOn() |
| Integration | `tests/integration/taskManager.test.js` | Cross-module interactions |
| API | `tests/api/apiService.test.js` | GET, POST, PUT, DELETE with mocked fetch |

## Coverage Requirements

- Minimum **70%** coverage enforced via `coverageThreshold` in `package.json`
- Coverage report generated in `coverage/` folder after running `npm test`
- HTML report available at `coverage/lcov-report/index.html`
