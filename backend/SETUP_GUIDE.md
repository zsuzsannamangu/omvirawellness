# Backend Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database (Supabase recommended)
- `.env` file with database credentials

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=your_postgresql_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Optional: for email notifications
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Optional: for file uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run Database Migration

**Option A: Using Node.js script**
```bash
node migrations/run-migration.js
```

**Option B: Using Supabase Dashboard**
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `migrations/001_initial_schema.sql`
3. Paste and click "Run"

### 4. (Optional) Add Seed Data

```bash
# Connect to your database and run:
psql $DATABASE_URL -f migrations/seed-data.sql
```

Or in Supabase SQL Editor, copy and run `migrations/seed-data.sql`.

### 5. Start the Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

## Verify Setup

After running the migration, verify the tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see 16 tables:
- users
- client_profiles
- provider_profiles
- provider_services
- provider_availability
- provider_photos
- space_owner_profiles
- spaces
- space_amenities
- space_availability
- space_photos
- client_provider_bookings
- provider_space_bookings
- reviews
- notifications
- favorites

## Test the Seed Data

If you added seed data, you can test with these credentials:

**Client:**
- Email: `client@test.com`
- Password: `password123`

**Provider 1 (Massage Therapist):**
- Email: `provider1@test.com`
- Password: `password123`

**Provider 2 (Acupuncturist):**
- Email: `provider2@test.com`
- Password: `password123`

**Space Owner:**
- Email: `space@test.com`
- Password: `password123`

## Next Steps

Now that the database is set up, you can:

1. ✅ Implement authentication endpoints
   - POST `/api/auth/register`
   - POST `/api/auth/login`
   - POST `/api/auth/refresh`

2. ✅ Create profile endpoints
   - GET/PUT `/api/clients/profile`
   - GET/PUT `/api/providers/profile`
   - GET/PUT `/api/spaces/profile`

3. ✅ Build search functionality
   - GET `/api/providers/search`
   - GET `/api/spaces/search`

4. ✅ Implement booking system
   - POST `/api/bookings/client-provider`
   - POST `/api/bookings/provider-space`
   - GET `/api/bookings/:id`

5. ✅ Add review system
   - POST `/api/reviews`
   - GET `/api/reviews/:target_type/:target_id`

## Troubleshooting

### Migration fails with "relation already exists"

Run the rollback script first:
```bash
psql $DATABASE_URL -f migrations/rollback.sql
```
Then run the migration again.

### Can't connect to database

Check your `DATABASE_URL` format:
```
postgresql://username:password@host:port/database?sslmode=require
```

For Supabase, it should look like:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Seed data fails

Make sure you've run the main migration first. The seed data depends on the schema being created.

## Database Management

### Backup Database

```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
psql $DATABASE_URL < backup_20251025.sql
```

### Reset Database

**⚠️ WARNING: This will delete ALL data!**

```bash
psql $DATABASE_URL -f migrations/rollback.sql
node migrations/run-migration.js
psql $DATABASE_URL -f migrations/seed-data.sql
```

## Database Schema Documentation

For detailed information about the database schema, see:
- `DATABASE_SCHEMA.md` - Comprehensive schema documentation
- `migrations/README.md` - Migration-specific information
- `migrations/001_initial_schema.sql` - The actual schema SQL

## Support

If you encounter any issues, check:
1. Database connection string is correct
2. PostgreSQL user has sufficient permissions
3. All required extensions are enabled (uuid-ossp)
4. SSL is properly configured for Supabase

