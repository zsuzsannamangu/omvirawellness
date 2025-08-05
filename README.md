# Omvira Wellness

A wellness booking platform connecting clients with wellness providers.

## Tech Stack

| Area         | Tool / Tech                          |
|--------------|--------------------------------------|
| Frontend     | Next.js, TailwindCSS                 |
| Backend      | Node.js + Express                    |
| Database     | PostgreSQL via Supabase              |
| Authentication| NextAuth.js                          |
| File Storage | Cloudinary                           |
| Calendar UI  | FullCalendar.js                      |
| Payments     | Stripe                               |
| Hosting      | Vercel (frontend) + Render (backend) |

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

#### Option 1: Supabase (Recommended for MVP)

1. Create a Supabase project
2. Create tables: `users`, `providers`, `bookings`, `reviews`
3. Get your connection string from the dashboard

#### Option 2: Render PostgreSQL

1. Create a PostgreSQL instance on Render
2. Get the connection string
3. Save to `.env` in backend:
   ```
   DATABASE_URL=postgres://user:password@host:port/dbname
   ```

### Step 7: Set Up Authentication

Use NextAuth.js (works great with Next.js + PostgreSQL):

1. Install NextAuth:
   ```bash
   npm install next-auth
   ```

2. Setup `/pages/api/auth/[...nextauth].ts`
3. Use email/password or OAuth (start simple with email)
4. Configure database to store sessions

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
4. Set environment variables (NEXTAUTH, Cloudinary, etc.)

#### Backend (Render)

1. Go to [Render](https://render.com)
2. Create Web Service
3. Set root to `backend/`
4. Add environment variables (DB, Stripe, etc.)

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

Create `.env` files in both frontend and backend directories with the necessary environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.


