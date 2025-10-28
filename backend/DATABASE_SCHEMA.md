# Omvira Wellness Database Schema

## Overview

This database supports a three-sided marketplace connecting:
1. **Clients** - People seeking wellness services
2. **Providers** - Wellness professionals (massage therapists, acupuncturists, etc.)
3. **Space Owners** - People renting out treatment spaces

## Entity Relationship Diagram

```
┌─────────────────┐
│     USERS       │
│  (Base Auth)    │
├─────────────────┤
│ id (PK)         │
│ email           │
│ password_hash   │
│ user_type       │
│ created_at      │
└────────┬────────┘
         │
    ┌────┴────┬────────────────┐
    │         │                │
    ▼         ▼                ▼
┌─────────┐ ┌──────────────┐ ┌──────────────────┐
│ CLIENT  │ │  PROVIDER    │ │  SPACE_OWNER     │
│ PROFILE │ │  PROFILE     │ │  PROFILE         │
└────┬────┘ └───┬──────────┘ └───┬──────────────┘
     │          │                  │
     │          ├──► SERVICES      │
     │          ├──► AVAILABILITY  │
     │          ├──► PHOTOS        ├──► SPACES
     │          │                  │      ├──► AMENITIES
     │          │                  │      ├──► AVAILABILITY
     │          │                  │      └──► PHOTOS
     │          │                  │
     │      ┌───┴─────────┐       │
     │      │             │       │
     ▼      ▼             ▼       ▼
┌────────────────────┐  ┌─────────────────────┐
│ CLIENT_PROVIDER    │  │ PROVIDER_SPACE      │
│    BOOKINGS        │  │    BOOKINGS         │
└────────────────────┘  └─────────────────────┘
     │                           │
     └───────────┬───────────────┘
                 │
                 ▼
        ┌────────────────┐
        │    REVIEWS     │
        │  NOTIFICATIONS │
        │   FAVORITES    │
        └────────────────┘
```

## Table Descriptions

### Core Tables

#### users
- **Purpose**: Base authentication for all user types
- **Key Fields**: email, password_hash, user_type
- **User Types**: 'client', 'provider', 'space_owner'

#### client_profiles
- **Purpose**: Extended profile information for clients
- **Key Fields**: first_name, last_name, phone, address
- **Features**: Demographics, preferences, medical notes

#### provider_profiles
- **Purpose**: Extended profile for wellness providers
- **Key Fields**: business_name, contact_name, credentials
- **Features**: Bio, certifications, ratings, verification

#### space_owner_profiles
- **Purpose**: Extended profile for space owners
- **Key Fields**: business_name, contact_name
- **Features**: Basic contact information

### Provider Features

#### provider_services
- **Purpose**: Services offered by each provider
- **Key Fields**: service_name, category, duration, price
- **Categories**: massage, acupuncture, yoga, etc.

#### provider_availability
- **Purpose**: Weekly recurring availability
- **Key Fields**: day_of_week (0-6), start_time, end_time
- **Features**: Multiple time slots per day

#### provider_photos
- **Purpose**: Provider portfolio images
- **Key Fields**: photo_url, caption, display_order

### Space Features

#### spaces
- **Purpose**: Rental spaces for providers
- **Key Fields**: space_name, space_type, address, hourly_rate
- **Features**: Capacity, square footage, pricing, ratings

#### space_amenities
- **Purpose**: Features/amenities of each space
- **Examples**: wifi, parking, massage_table, shower

#### space_availability
- **Purpose**: Weekly recurring availability
- **Key Fields**: day_of_week (0-6), start_time, end_time

#### space_photos
- **Purpose**: Space images
- **Key Fields**: photo_url, caption, display_order

### Booking Tables

#### client_provider_bookings
- **Purpose**: Appointments between clients and providers
- **Key Fields**: booking_date, start_time, end_time, status
- **Statuses**: pending, confirmed, completed, cancelled, no_show
- **Payment**: total_amount, payment_status, transaction_id

#### provider_space_bookings
- **Purpose**: Space rentals by providers
- **Key Fields**: booking_date, start_time, end_time, status
- **Statuses**: pending, confirmed, completed, cancelled
- **Payment**: total_amount, payment_status, transaction_id

### Engagement Tables

#### reviews
- **Purpose**: Reviews for providers OR spaces
- **Key Fields**: rating (1-5), title, comment
- **Features**: Flagging system, published status

#### notifications
- **Purpose**: System notifications for users
- **Types**: booking_confirmed, booking_reminder, review_received
- **Features**: Read status, email status

#### favorites
- **Purpose**: Saved providers or spaces by users
- **Features**: Quick access to frequently used providers/spaces

## Key Design Decisions

### 1. User Type Inheritance
- Single `users` table with `user_type` field
- Separate profile tables for each type (normalized)
- Allows users to have multiple roles in the future

### 2. Availability System
- Uses `day_of_week` (0=Sunday, 6=Saturday)
- Supports multiple time slots per day
- Separate tables for provider and space availability

### 3. Booking System
- Two separate booking tables for different workflows
- Comprehensive status tracking
- Payment integration fields

### 4. Ratings & Reviews
- Pre-calculated averages in profile tables for performance
- Single review table for both providers and spaces
- Constraint ensures review is for one target only

### 5. Conflict Prevention
- Indexes on booking_date, provider_id, space_id
- Time constraints to ensure end_time > start_time
- Application logic will handle double-booking prevention

## Indexes

Critical indexes for performance:

**Authentication:**
- `users.email` - Fast login lookup
- `users.user_type` - Filter by user type

**Search:**
- `provider_profiles(city, state)` - Location-based search
- `provider_profiles.business_type` - Category search
- `spaces(city, state)` - Location-based search
- `spaces.space_type` - Type filtering

**Bookings:**
- `client_provider_bookings.booking_date` - Date range queries
- `client_provider_bookings(client_id, provider_id)` - User bookings
- `provider_space_bookings.booking_date` - Conflict detection

## Security Considerations

### Row-Level Security (Supabase)

Implement these RLS policies:

1. **Users can only read/update their own profile**
2. **Providers can only modify their own services/availability**
3. **Space owners can only modify their own spaces**
4. **Bookings visible to both parties involved**
5. **Reviews public for reading, restricted for writing**

### Password Security

- Use bcrypt with at least 10 salt rounds
- Never log or display password_hash
- Implement password complexity requirements

### API Security

- JWT tokens for authentication
- Rate limiting on auth endpoints
- Validate all user inputs
- Use parameterized queries (prevent SQL injection)

## Sample Queries

### Find available providers in a location

```sql
SELECT p.*, u.email
FROM provider_profiles p
JOIN users u ON p.user_id = u.id
WHERE p.city = 'San Francisco'
  AND p.state = 'CA'
  AND p.is_verified = true
  AND u.is_active = true;
```

### Check booking conflicts

```sql
SELECT COUNT(*) as conflicts
FROM client_provider_bookings
WHERE provider_id = $1
  AND booking_date = $2
  AND status IN ('pending', 'confirmed')
  AND (
    (start_time <= $3 AND end_time > $3) OR
    (start_time < $4 AND end_time >= $4) OR
    (start_time >= $3 AND end_time <= $4)
  );
```

### Get provider's average rating

```sql
SELECT 
  AVG(rating) as average_rating,
  COUNT(*) as total_reviews
FROM reviews
WHERE provider_id = $1
  AND is_published = true;
```

## Next Steps

1. ✅ Run the migration: `node migrations/run-migration.js`
2. ✅ Verify tables in Supabase dashboard
3. ✅ Set up Row-Level Security policies
4. ✅ Create seed data for testing
5. ✅ Build authentication endpoints
6. ✅ Implement CRUD operations
7. ✅ Add booking logic with conflict detection
8. ✅ Integrate payment processing

## Rollback

To rollback the migration:

```bash
psql $DATABASE_URL -f migrations/rollback.sql
```

Or in Supabase SQL Editor, run the contents of `rollback.sql`.

**⚠️ WARNING**: This will delete ALL data!

