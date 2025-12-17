# Habit Tracker - Source Code Structure

This React application is organized into three main parts within the `src` folder:

## 📁 Directory Structure

```
src/
├── frontend/          # Frontend UI Components
│   └── components/    # React components (auth, dashboard, habits, gamification)
├── backend/           # Backend API Integration
│   ├── api/           # API service layer (apiService.js)
│   └── contexts/      # React contexts for state management (AuthContext, HabitContext)
├── database/          # Database Models & Schemas
│   ├── models.js      # Database model definitions
│   └── types.js       # Type definitions for database entities
├── App.js             # Main application component (stays at root)
├── index.js           # Application entry point
└── ...                # Other root-level files (CSS, configs, etc.)
```

## 🎯 Frontend (`src/frontend/`)

Contains all UI components organized by feature:
- **components/auth/** - Login and Signup components
- **components/dashboard/** - Dashboard, charts, and stats
- **components/habits/** - Habit cards, modals for adding/editing
- **components/gamification/** - Achievement badges and level progress

## 🔌 Backend (`src/backend/`)

Contains API integration and state management:
- **api/apiService.js** - Centralized API service that handles all HTTP requests to the backend server
- **contexts/AuthContext.js** - Authentication state management using API
- **contexts/HabitContext.js** - Habit data state management using API

The backend folder contains the **client-side** code that communicates with the backend API server.

## 💾 Database (`src/database/`)

Contains database models and type definitions:
- **models.js** - Schema definitions and helper functions for creating database entities
- **types.js** - TypeScript-like type definitions for better code documentation

These are **client-side** type definitions that match the backend database schema.

## 🔄 How It Works

1. **Frontend Components** → Use React contexts from `backend/contexts/`
2. **Contexts** → Call API service functions from `backend/api/apiService.js`
3. **API Service** → Makes HTTP requests to the backend server
4. **Database Models** → Define the data structure used throughout the app

## 📝 Important Notes

- `App.js` remains at the root of `src/` as the main application component
- All imports have been updated to reflect the new structure
- The app now uses REST API instead of Firebase (API service layer replaces Firebase)
- Each part can be containerized separately for Docker deployment

