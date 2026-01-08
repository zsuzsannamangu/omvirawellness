# Omvira Wellness

A wellness booking platform connecting clients with wellness providers.

## Tech Stack

| Area         | Tool / Tech                          |
|--------------|--------------------------------------|
| Frontend     | Next.js 15, React 19, TypeScript, SCSS, TailwindCSS |
| Backend      | Node.js + Express                    |
| Database     | PostgreSQL (Render)                 |
| Authentication| JWT (jsonwebtoken), bcrypt          |
| OAuth        | Google OAuth, Facebook OAuth (optional) |
| File Storage | Cloudinary (optional)              |
| Calendar UI  | Custom calendar components           |
| Payments     | Stripe (optional)                   |
| Hosting      | Vercel (frontend) + Render (backend) |
| Email        | SendGrid (optional)                 |

## Project Setup

### Step 1: Project Setup Overview

You'll create:
- A GitHub repository
- Local development environment with Next.js frontend
- Backend using Node.js + Express
- PostgreSQL connection via Supabase
- Authentication via NextAuth
- Frontend deployed on Vercel
- Backend deployed on Render

### Step 2: Create Your GitHub Repository

1. Go to [GitHub](https://github.com/new) and create a new repository:
   - **Name**: `reponame`
   - Add README
   - Add .gitignore → select Node
   - (Optional) Add MIT license

2. Clone the repository:
   ```bash
   git clone https://github.com/your-username/reponame.git
   cd reponame
   ```

### Step 3: Folder Structure

Create separate frontend and backend directories:
```bash
mkdir frontend backend
```

### Step 4: Initialize Frontend (Next.js + Tailwind)

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Create Next.js app with TypeScript:
   ```bash
   npx create-next-app@latest . --typescript
   ```

3. Install Tailwind CSS:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

4. Update `tailwind.config.js`:
   ```javascript
   content: [
     "./pages/**/*.{js,ts,jsx,tsx}",
     "./components/**/*.{js,ts,jsx,tsx}"
   ],
   ```

5. Update `globals.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

### Step 5: Initialize Backend (Express + TypeScript)

1. Navigate to backend directory:
   ```bash
   cd ../backend
   ```

2. Initialize Node.js project:
   ```bash
   npm init -y
   ```

3. Install dependencies:
   ```bash
   npm install express cors dotenv pg
   npm install -D typescript ts-node nodemon @types/node @types/express @types/cors @types/pg
   ```

4. Initialize TypeScript:
   ```bash
   npx tsc --init
   ```

5. Create folder structure:
   ```bash
   mkdir src
   touch src/index.ts
   ```

6. Example `src/index.ts`:
   ```typescript
   const express = require('express');
   const cors = require('cors');
   const dotenv = require('dotenv');

   dotenv.config();
   const app = express();
   app.use(cors());
   app.use(express.json());

   app.get('/', (req, res) => res.send('Yourname API'));
   app.listen(4000, () => console.log('Server running on http://localhost:4000'));
   ```

7. Add scripts to `package.json`:
   ```json
   {
     "scripts": {
       "dev": "nodemon src/index.ts"
     }
   }
   ```

8. Run the development server:
   ```bash
   npm run dev
   ```

### Step 6: Set Up PostgreSQL

**Production: Render PostgreSQL (Recommended)**

1. Create a PostgreSQL instance on Render
2. Get the **Internal Database URL** from the Render dashboard
3. Save to `.env` in backend:
   ```
   DATABASE_URL=postgres://user:password@host:port/dbname
   ```
4. Run migrations:
   ```bash
   cd backend
   node migrations/run-migration.js
   ```

**Local Development:**
- Use a local PostgreSQL instance or Supabase for development
- Update `DATABASE_URL` in backend `.env` file

### Step 7: Set Up Authentication

The app uses JWT-based authentication:

1. **Backend Authentication**:
   - JWT tokens for session management
   - Password hashing with bcrypt
   - Token expiration: 7 days (configurable)
   - OAuth support for Google and Facebook

2. **Frontend Authentication**:
   - Tokens stored in localStorage
   - Automatic token validation
   - Protected routes based on user type

3. **Environment Variables** (Backend):
   ```
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRES_IN=7d
   ```

### Step 8: Setup Cloudinary (for profile photos)

1. Create account at [Cloudinary](https://cloudinary.com)
2. Get your credentials
3. Use Cloudinary widget or upload via signed requests
4. Later, backend uploads for more control

### Step 9: Add Calendar UI

Install FullCalendar in frontend:

```bash
npm install @fullcalendar/react @fullcalendar/daygrid
```

Use in provider dashboard to manage availability.

### Step 10: Stripe Setup

1. Create Stripe account
2. Create test API keys
3. Save to backend `.env`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. Install in backend:
   ```bash
   npm install stripe
   ```

You'll add routes to handle:
- Client payments
- Provider payouts

### Step 11: Deployment Setup

#### Frontend (Vercel)

1. Go to [Vercel](https://vercel.com)
2. Connect GitHub repository
3. Set root to `frontend/`
4. Set environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
   ```
   **Important**: If `NEXT_PUBLIC_API_URL` is not set, the app will automatically use `https://omvirawellness-backend.onrender.com/api` as fallback.

#### Backend (Render)

See detailed deployment guide: [RENDER_BACKEND_DEPLOY.md](./RENDER_BACKEND_DEPLOY.md)

**Quick Setup:**
1. Go to [Render](https://render.com)
2. Create PostgreSQL database
3. Create Web Service
4. Connect GitHub repository
5. Set root to `backend/`
6. Build command: `npm install`
7. Start command: `npm start`
8. Add environment variables (see below)

**Required Environment Variables:**
```
DATABASE_URL=postgres://... (from Render PostgreSQL)
JWT_SECRET=your-secret-key
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

**Optional Environment Variables:**
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
SENDGRID_API_KEY=...
STRIPE_SECRET_KEY=...
```

## Development

### Running the Application

1. **Backend** (from `backend/` directory):
   ```bash
   npm run dev
   ```

2. **Frontend** (from `frontend/` directory):
   ```bash
   npm run dev
   ```

### Environment Variables

#### Frontend (`.env.local` in `frontend/` directory)

**Required:**
```
NEXT_PUBLIC_API_URL=https://omvirawellness-backend.onrender.com/api
```

**Note**: If not set, the app will automatically use the Render backend URL as fallback. For local development, the app will use `http://localhost:4000` automatically.

#### Backend (`.env` in `backend/` directory)

**Required:**
```
DATABASE_URL=postgres://user:password@host:port/database
JWT_SECRET=your-secret-key-here
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Optional (for full features):**
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
SENDGRID_API_KEY=...
SENDGRID_FROM_EMAIL=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## API Configuration

The frontend uses a centralized API configuration system located at `frontend/src/config/api.ts`:

- **Local Development**: Automatically uses `http://localhost:4000` when running on localhost
- **Production**: Uses `NEXT_PUBLIC_API_URL` environment variable if set
- **Fallback**: If `NEXT_PUBLIC_API_URL` is not set, uses `https://omvirawellness-backend.onrender.com/api`

This ensures the app works correctly in both development and production without hardcoded URLs.

## Recent Updates & Fixes

### Authentication & Security
- ✅ Fixed missing `two_factor_enabled` column handling (graceful fallback)
- ✅ Fixed Facebook OAuth configuration checks
- ✅ Improved error handling for missing database columns

### UI/UX Improvements
- ✅ Created missing pages: `/forgot-password`, `/terms`, `/privacy`
- ✅ Fixed error message spacing and alignment in login form
- ✅ Updated button styling for consistency (Back button matches Complete Setup button)
- ✅ Reduced font weights and improved text contrast in provider signup forms
- ✅ Condensed subscription/plans modal for better UX
- ✅ Removed trial period references (free plan available instead)

### API & Deployment
- ✅ Replaced all hardcoded `localhost:4000` URLs with centralized API configuration
- ✅ Added automatic fallback to Render backend URL
- ✅ Fixed local network permission prompts in production
- ✅ Backend deployed to Render with health check endpoint
- ✅ Database migrations documented and tested

## Key Features

### Client Features
- **Provider Discovery**: Browse and search wellness providers with filtering by service type, location, and availability
- **Favorites System**: Save favorite providers for quick access
- **Booking Management**: 
  - Request appointments with providers
  - View upcoming and past bookings
  - Reschedule or cancel upcoming appointments
  - Leave reviews for completed appointments
  - Book again with previous providers
- **Calendar View**: See all appointments in a calendar format
- **Real-time Availability**: See next available dates for providers, excluding already booked slots

### Provider Features
- **Profile Management**: Complete profile setup with business info, services, certifications, team members
- **Availability Management**: 
  - Set one-time and recurring availability slots
  - Automatic blocking of booked time slots
  - Calendar view for managing availability
- **Booking Management**: 
  - Accept or decline booking requests
  - View upcoming and past sessions
  - Manage client directory with notes
- **Service Management**: Add/edit services and add-ons with pricing
- **Client Management**: Track clients, add notes, and manage relationships

### Technical Features
- **Dynamic User Routes**: User-specific dashboards (`/dashboard/[userId]`, `/providers/dashboard/[userId]`)
- **Real-time Updates**: Bookings and availability update automatically via polling (10-second intervals)
- **Smart Filtering**: Past bookings automatically move based on date/time, not just status
- **Blocked Slot Management**: Booked time slots are automatically excluded from availability
- **Notification Badges**: Real-time badge counts for new booking requests and unread messages
- **Responsive Design**: Mobile-friendly interface with optimized layouts
- **Error Handling**: User-friendly error messages with proper spacing and alignment

## Authentication & Account System

### Overview

Omvira uses a **unified account system** where a single user account can have multiple roles (client and provider). This allows users to seamlessly switch between booking services and offering services without needing separate accounts.

### Account Types & URLs

#### **Client Experience**
- **Homepage**: `/` - Main client-facing landing page
- **Login**: `/login` - Client authentication
- **Signup**: `/signup` - Client registration
- **Provider Discovery**: Browse and book wellness services

#### **Provider Experience**
- **Landing Page**: `/providers` - Provider-specific marketing page
- **Login**: `/providers/login` - Provider authentication
- **Signup**: `/providers/signup` - Provider registration
- **Join Redirect**: `/join` → redirects to `/providers/signup`
- **Provider Dashboard**: Manage bookings, availability, and services

### Navigation Flow

```
Client Journey:
├── / (homepage)
├── "Log In" → /login
├── "Sign Up" → /signup
└── "Find a Provider" → Browse services

Provider Journey:
├── /providers (landing page)
├── "Log In" → /providers/login
├── "Join" → /providers/signup
├── /join → redirects to /providers/signup
└── "Find a Provider" → / (client homepage)
```

### Cross-Navigation

- **Provider pages** include "Switch to client mode" links that direct to `/login` and `/signup`
- **Client pages** can link to provider pages when needed
- **Unified account system** maintains single user identity across both experiences

### Authentication Features

#### **Social Login Support**
- Apple Sign-In
- Facebook Login
- Google Sign-In
- Email/Password authentication

#### **Role-Based Access**
- **Client Role**: Book appointments, manage bookings, leave reviews
- **Provider Role**: Manage availability, accept bookings, track earnings
- **Dual Role**: Users can have both client and provider capabilities

#### **Security Features**
- Password visibility toggle
- Form validation
- Secure session management
- Cross-origin request handling

### Technical Implementation

#### **Frontend Structure**
```
frontend/src/app/
├── / (client homepage)
├── /login (client login)
├── /signup (client signup)
├── /providers/ (provider landing)
├── /providers/login (provider login)
├── /providers/signup (provider signup)
└── /join (provider signup redirect)
```

#### **Styling Approach**
- **Client Pages**: Clean, minimal design with brand colors
- **Provider Pages**: Distinct visual styling with larger forms and different gradients
- **Shared Components**: Common button styles and form elements
- **SCSS Modules**: Component-scoped styling with global variables

#### **Database Schema**
```sql
-- Users table supports multiple roles
users (
  id,
  email,
  password_hash,
  created_at,
  updated_at
)

-- User roles table
user_roles (
  user_id,
  role_type, -- 'client', 'provider', or both
  created_at
)

-- Provider-specific data
providers (
  user_id,
  business_name,
  services,
  availability,
  created_at
)
```

### Development Notes

- **Unified Account System**: Single user can have both client and provider roles
- **Distinct UI/UX**: Provider and client experiences have different visual designs
- **Shared Authentication**: Same login credentials work for both experiences
- **Role Switching**: Users can switch between client and provider modes seamlessly

## Project Structure

```
omvirawellness/
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js app router pages
│   │   ├── components/       # React components
│   │   ├── config/           # Configuration files (API, categories)
│   │   ├── services/         # API service functions
│   │   └── styles/           # SCSS modules
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # Express routes
│   │   ├── middleware/      # Auth middleware
│   │   ├── utils/           # Utility functions
│   │   └── index.js         # Server entry point
│   ├── migrations/          # Database migrations
│   └── package.json
└── README.md
```

## Deployment Status

- ✅ **Frontend**: Deployed on Vercel at `https://omvirawellness.vercel.app`
- ✅ **Backend**: Deployed on Render at `https://omvirawellness-backend.onrender.com`
- ✅ **Database**: PostgreSQL on Render
- ✅ **Health Check**: Available at `/health` endpoint

## Additional Documentation

- **Backend Deployment**: See [RENDER_BACKEND_DEPLOY.md](./RENDER_BACKEND_DEPLOY.md) for detailed Render deployment instructions
- **Deployment Checklist**: See [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) for a quick deployment reference

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.


