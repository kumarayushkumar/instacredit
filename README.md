# InstaCredit - Loan Management System

A real-time loan management and tracking system that integrates with external lender APIs to monitor loan status changes and provide a comprehensive dashboard for viewing loan information.

## 🏗️ Architecture

### System Overview

InstaCredit is built as a microservices architecture using a monorepo structure managed by Turborepo. The system consists of three main services:

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│    Frontend     │────────▶│  Main Backend    │────────▶│  Fake Lender    │
│   (React +      │         │  (Express +      │         │     API         │
│    Vite)        │         │   Prisma)        │         │   (FastAPI)     │
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │   PostgreSQL    │
                            │    Database     │
                            └─────────────────┘
```

### Components

#### 1. **Frontend** (`apps/frontend`)

- **Technology**: React 19, Vite, TypeScript, TailwindCSS
- **Features**:
  - Real-time loan dashboard with auto-refresh
  - Interactive loan table with expandable rows
  - Status timeline visualization showing loan progression
  - Search and filter capabilities (by Loan ID, User ID, Amount, Status)
  - Responsive UI with shadcn/ui components
- **Key Libraries**:
  - Axios for API calls
  - Lucide React for icons
  - Radix UI for accessible components
  - Sonner for toast notifications

#### 2. **Main Backend** (`apps/main-backend`)

- **Technology**: Node.js, Express, TypeScript, Prisma ORM
- **Features**:
  - RESTful API for loan data retrieval
  - Cron job polling lender API every 10 seconds
  - Automatic loan creation and status tracking
  - Database migrations and schema management
  - Error handling and logging with Winston
  - Rate limiting and security middleware
- **Key Libraries**:
  - Express for API server
  - Prisma for database ORM
  - node-cron for scheduled tasks
  - Helmet for security headers
  - express-rate-limit for API protection

#### 3. **Fake Lender API** (`apps/fake-lender-api`)

- **Technology**: Python, FastAPI
- **Features**:
  - Mock lender service simulating real-world API
  - Time-based loan status progression (every 5 seconds)
  - Multiple loan support (LN101, LN102)
  - Status cycle: Applied → Approved → Disbursed → Rejected → Applied
  - CORS enabled for cross-origin requests
- **Purpose**: Simulates an external lender's API for testing and development

#### 4. **Database**

- **Technology**: PostgreSQL 15
- **Schema**:
  - `User`: User information
  - `Loans`: Loan details with relationships to users
  - `LoanStatusHistory`: Complete audit trail of status changes
- **Features**: Indexed queries, relationships, enums for loan status

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 11.6.4
- **Docker** and **Docker Compose** (for containerized setup)
- **Python** 3.11+ (if running fake-lender-api locally)

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd instacr
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   # Logging
   CONSOLE_ONLY_LOGGING=true
   LOG_LEVEL=debug

   # Database
   POSTGRES_DB=db
   POSTGRES_USER=user
   POSTGRES_PASSWORD=password
   DATABASE_URL="postgresql://user:password@database:5432/db"

   # Lender API
   LENDER_API_URL="http://fake-lender-api:8001/api/lender/loan-status"

   # Server
   PORT=8000
   NODE_ENV=production
   ```

3. **Build and start all services**

   ```bash
   docker compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Main Backend: http://localhost:8000
   - Fake Lender API: http://localhost:8001
   - Database: localhost:5432

### Option 2: Local Development Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file for local development:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/db"
   LENDER_API_URL="http://localhost:8001/api/lender/loan-status"
   PORT=8000
   NODE_ENV=development
   ```

3. **Start PostgreSQL database**

   ```bash
   docker compose up database -d
   ```

4. **Set up the database schema**

   ```bash
   cd apps/main-backend
   npm run reset-db
   # or
   npx prisma migrate dev
   ```

5. **Start the fake lender API**

   ```bash
   cd apps/fake-lender-api
   pip install -r requirements.txt
   python main.py
   ```

6. **Start the main backend**

   ```bash
   cd apps/main-backend
   npm run dev
   ```

7. **Start the frontend**
   ```bash
   cd apps/frontend
   npm run dev
   ```

### Development Commands

```bash
# Install dependencies for all apps
npm install

# Run all apps in development mode
npm run dev

# Build all apps
npm run build

# Format code
npm run format

# Type checking
npm run check-types

# Docker commands
npm run docker:create    # Create and start all containers
npm run docker:start     # Start existing containers
npm run docker:stop      # Stop containers
```

### Backend-Specific Commands

```bash
cd apps/main-backend

# Reset database (drops all data and re-runs migrations)
npm run reset-db

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio (database GUI)
npx prisma studio
```

## 📁 Project Structure

```
instacr/
├── apps/
│   ├── fake-lender-api/          # Python FastAPI mock lender
│   │   ├── Dockerfile
│   │   ├── main.py               # API endpoints and status simulation
│   │   └── requirements.txt
│   │
│   ├── frontend/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/       # UI components
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── LoansTable.tsx
│   │   │   │   ├── StatusTimeline.tsx
│   │   │   │   └── ui/           # shadcn/ui components
│   │   │   ├── api/              # API client
│   │   │   ├── types/            # TypeScript types
│   │   │   └── lib/              # Utilities
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── main-backend/             # Express backend
│       ├── config/               # Configuration files
│       ├── controllers/          # Business logic
│       ├── cron/                 # Scheduled jobs
│       │   └── call-lender.ts    # Lender API polling
│       ├── handlers/             # Request handlers
│       ├── middlewares/          # Express middlewares
│       ├── routes/               # API routes
│       ├── prisma/
│       │   ├── schema.prisma     # Database schema
│       │   └── migrations/       # Migration files
│       ├── server.ts             # Entry point
│       └── package.json
│
├── docker-compose.yml            # Container orchestration
├── turbo.json                    # Turborepo configuration
└── package.json                  # Root package.json
```

## 🔄 Data Flow

1. **Cron Job Polling** (Every 10 seconds)

   ```
   Main Backend → Fake Lender API → Get loan statuses
   ```

2. **Status Processing**

   ```
   Main Backend receives loan data → Check if loan exists
   → If new: Create user, loan, and initial status
   → If exists: Compare status, update if changed
   → Save to PostgreSQL
   ```

3. **Frontend Updates**
   ```
   Frontend → Main Backend API → Fetch all loans with status history
   → Display in table with timeline visualization
   ```

## 🔍 Key Features

### Real-Time Status Tracking

- Cron job polls lender API every 10 seconds
- Automatic detection and storage of status changes
- Complete audit trail of all status transitions

### Interactive Dashboard

- Expandable loan rows showing detailed status timeline
- Visual timeline with color-coded status indicators
- Latest status highlighted in green
- Search by Loan ID, User ID, or Amount
- Filter by loan status (Applied, Approved, Disbursed, Rejected)

### Database Schema

```prisma
User
├── userId (unique)
└── loans (relation)

Loans
├── loanId (unique)
├── userId (foreign key)
├── approvedAmount
└── statusHistory (relation)

LoanStatusHistory
├── id (unique)
├── loanId (foreign key)
├── status (enum)
└── changedAt (timestamp)
```

## 🛠️ Technology Stack

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Frontend         | React 19, TypeScript, Vite, TailwindCSS |
| Backend          | Node.js, Express, TypeScript            |
| Database         | PostgreSQL 15                           |
| ORM              | Prisma                                  |
| Mock Service     | Python, FastAPI                         |
| Containerization | Docker, Docker Compose                  |
| Build Tool       | Turborepo                               |

## 🔐 Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting on API endpoints
- Environment variable management
- Input validation with Prisma
- Error handling middleware

## 📊 API Endpoints

### Main Backend (`http://localhost:8000`)

- **GET** `/api/loans/all-loans` - Get all loans with status history
  - Rate limited
  - Returns loans sorted by creation date (descending)
  - Includes full status history for each loan

- **GET** `/health` - Health check endpoint

### Fake Lender API (`http://localhost:8001`)

- **GET** `/` - Health check
- **GET** `/api/lender/loan-status` - Get current loan statuses
  - Returns array of loan objects with current status
  - Status changes automatically every 5 seconds

## 🧪 Testing & Development

The fake lender API cycles through statuses automatically:

- **Applied** → **Approved** → **Disbursed** → **Rejected** → (repeat)
- Status changes every 5 seconds
- Two test loans available:
  - LN101 (User: U12, Amount: ₹50,000)
  - LN102 (User: U13, Amount: ₹10,000)

## 📝 Logging

- Winston logger with configurable log levels
- Console and file logging support
- Error tracking with stack traces
- Request/response logging

## 🐳 Docker Services

- **database**: PostgreSQL 15 with health checks
- **main-backend**: Express server with dependency on database and lender API
- **fake-lender-api**: FastAPI mock service
- All services connected via Docker networks for communication
- Volume persistence for database data

