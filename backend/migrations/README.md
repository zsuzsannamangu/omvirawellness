# Database Migrations

## Schema Overview

The Omvira Wellness database supports three types of users and their interactions:

### Core Tables

1. **users** - Base authentication table for all user types
2. **client_profiles** - Extended profile for clients
3. **provider_profiles** - Extended profile for wellness providers
4. **space_owner_profiles** - Extended profile for space owners

### Provider-Related Tables

5. **provider_services** - Services offered by providers
6. **provider_availability** - Weekly availability schedule
7. **provider_photos** - Portfolio/workspace photos

### Space-Related Tables

8. **spaces** - Rental spaces owned by space owners
9. **space_amenities** - Amenities available in each space
10. **space_availability** - Weekly availability schedule
11. **space_photos** - Space photos

### Booking Tables

12. **client_provider_bookings** - Appointments between clients and providers
13. **provider_space_bookings** - Space rentals by providers

### Engagement Tables

14. **reviews** - Reviews for providers and spaces
15. **notifications** - System notifications for users
16. **favorites** - Saved/favorited providers and spaces

## Key Features

- **UUID Primary Keys** - For security and scalability
- **Automatic Timestamps** - `created_at` and `updated_at` with triggers
- **Soft Deletes** - `is_active` flags for data retention
- **Rating System** - Pre-calculated averages for performance
- **Conflict Prevention** - Indexes on booking dates/times
- **Flexible Availability** - Support for multiple time slots per day
- **Payment Tracking** - Status and transaction IDs
- **Review System** - For both providers and spaces

## Running Migrations

### Manual Migration (Supabase SQL Editor)

1. Log into your Supabase dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `001_initial_schema.sql`
4. Click "Run"

### Programmatic Migration (Node.js)

```bash
# Run the migration script
node migrations/run-migration.js
```

## Database Relationships

```
users (1) ─→ (1) client_profiles
users (1) ─→ (1) provider_profiles
users (1) ─→ (1) space_owner_profiles

provider_profiles (1) ─→ (many) provider_services
provider_profiles (1) ─→ (many) provider_availability
provider_profiles (1) ─→ (many) provider_photos

space_owner_profiles (1) ─→ (many) spaces
spaces (1) ─→ (many) space_amenities
spaces (1) ─→ (many) space_availability
spaces (1) ─→ (many) space_photos

client_profiles (1) ─→ (many) client_provider_bookings
provider_profiles (1) ─→ (many) client_provider_bookings

provider_profiles (1) ─→ (many) provider_space_bookings
spaces (1) ─→ (many) provider_space_bookings

users (1) ─→ (many) reviews
users (1) ─→ (many) notifications
users (1) ─→ (many) favorites
```

## Important Notes

### Booking Conflict Prevention

Both booking tables have indexes on:
- `booking_date`
- `provider_id` / `space_id`
- `status`

This allows for efficient conflict checking queries.

### Rating System

The `average_rating` and `total_reviews` fields in `provider_profiles` and `spaces` should be updated via database triggers or application logic whenever a new review is added.

### Availability System

The availability tables use `day_of_week` (0-6, where 0 = Sunday) and support multiple time slots per day. This matches the frontend implementation.

### Security Considerations

- Always use parameterized queries to prevent SQL injection
- Never store raw passwords (use bcrypt with salt rounds >= 10)
- Implement row-level security (RLS) in Supabase for production
- Use environment variables for database credentials

## Next Steps

After running the migration:

1. ✅ Test the schema with sample data
2. ✅ Implement authentication endpoints
3. ✅ Create CRUD endpoints for profiles
4. ✅ Implement booking logic with conflict detection
5. ✅ Add review system
6. ✅ Integrate payment processing

