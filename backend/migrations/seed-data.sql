-- ============================================
-- SEED DATA FOR TESTING
-- ============================================
-- Sample data for all user types and relationships
-- Passwords are all 'password123' hashed with bcrypt
-- ============================================

-- Sample password hash for 'password123'
-- You should generate real hashes using bcrypt in production
-- This is just for testing: $2b$10$rOFLKJXXjf8KZPqGkqE6S.kE9TjZ4kVJYH0qKXxXxXxXxXxXxXxXx

-- ============================================
-- USERS
-- ============================================

-- Client user
INSERT INTO users (id, email, password_hash, user_type, email_verified, is_active) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'client@test.com', '$2b$10$rOFLKJXXjf8KZPqGkqE6S.kE9TjZ4kVJYH0qKXxXxXxXxXxXxXxXx', 'client', true, true);

-- Provider users
INSERT INTO users (id, email, password_hash, user_type, email_verified, is_active) 
VALUES 
  ('22222222-2222-2222-2222-222222222222', 'provider1@test.com', '$2b$10$rOFLKJXXjf8KZPqGkqE6S.kE9TjZ4kVJYH0qKXxXxXxXxXxXxXxXx', 'provider', true, true),
  ('33333333-3333-3333-3333-333333333333', 'provider2@test.com', '$2b$10$rOFLKJXXjf8KZPqGkqE6S.kE9TjZ4kVJYH0qKXxXxXxXxXxXxXxXx', 'provider', true, true);

-- Space owner user
INSERT INTO users (id, email, password_hash, user_type, email_verified, is_active) 
VALUES 
  ('44444444-4444-4444-4444-444444444444', 'space@test.com', '$2b$10$rOFLKJXXjf8KZPqGkqE6S.kE9TjZ4kVJYH0qKXxXxXxXxXxXxXxXx', 'space_owner', true, true);

-- ============================================
-- CLIENT PROFILES
-- ============================================

INSERT INTO client_profiles (id, user_id, first_name, last_name, phone_number, city, state, zip_code)
VALUES 
  ('11111111-aaaa-1111-aaaa-111111111111', '11111111-1111-1111-1111-111111111111', 'Sarah', 'Johnson', '415-555-0101', 'San Francisco', 'CA', '94102');

-- ============================================
-- PROVIDER PROFILES
-- ============================================

INSERT INTO provider_profiles (id, user_id, business_name, contact_name, phone_number, bio, city, state, zip_code, business_type, is_verified, average_rating, total_reviews, years_experience)
VALUES 
  ('22222222-aaaa-2222-aaaa-222222222222', '22222222-2222-2222-2222-222222222222', 
   'Healing Hands Massage', 'Michael Chen', '415-555-0201',
   'Specialized in deep tissue and sports massage with 10 years of experience. Licensed and certified by CAMTC.',
   'San Francisco', 'CA', '94103', 'massage_therapy', true, 4.8, 45, 10),
  
  ('33333333-aaaa-3333-aaaa-333333333333', '33333333-3333-3333-3333-333333333333',
   'Zen Acupuncture Clinic', 'Dr. Lisa Wang', '415-555-0202',
   'Traditional Chinese Medicine practitioner specializing in acupuncture and herbal medicine.',
   'San Francisco', 'CA', '94104', 'acupuncture', true, 4.9, 67, 15);

-- ============================================
-- PROVIDER SERVICES
-- ============================================

INSERT INTO provider_services (provider_id, service_name, service_category, description, duration_minutes, price, is_active)
VALUES
  -- Michael's services
  ('22222222-aaaa-2222-aaaa-222222222222', 'Swedish Massage', 'massage', '60-minute relaxation massage', 60, 90.00, true),
  ('22222222-aaaa-2222-aaaa-222222222222', 'Deep Tissue Massage', 'massage', '90-minute deep tissue work', 90, 130.00, true),
  ('22222222-aaaa-2222-aaaa-222222222222', 'Sports Massage', 'massage', 'Targeted sports recovery', 60, 100.00, true),
  
  -- Lisa's services
  ('33333333-aaaa-3333-aaaa-333333333333', 'Acupuncture Session', 'acupuncture', 'Initial consultation and treatment', 60, 120.00, true),
  ('33333333-aaaa-3333-aaaa-333333333333', 'Follow-up Acupuncture', 'acupuncture', 'Follow-up treatment', 45, 90.00, true),
  ('33333333-aaaa-3333-aaaa-333333333333', 'Cupping Therapy', 'alternative', 'Traditional cupping treatment', 30, 60.00, true);

-- ============================================
-- PROVIDER AVAILABILITY
-- ============================================

-- Michael's availability (Mon-Fri, 9am-5pm)
INSERT INTO provider_availability (provider_id, day_of_week, start_time, end_time, is_available)
VALUES
  ('22222222-aaaa-2222-aaaa-222222222222', 1, '09:00', '17:00', true), -- Monday
  ('22222222-aaaa-2222-aaaa-222222222222', 2, '09:00', '17:00', true), -- Tuesday
  ('22222222-aaaa-2222-aaaa-222222222222', 3, '09:00', '17:00', true), -- Wednesday
  ('22222222-aaaa-2222-aaaa-222222222222', 4, '09:00', '17:00', true), -- Thursday
  ('22222222-aaaa-2222-aaaa-222222222222', 5, '09:00', '17:00', true); -- Friday

-- Lisa's availability (Tue-Sat, 10am-6pm)
INSERT INTO provider_availability (provider_id, day_of_week, start_time, end_time, is_available)
VALUES
  ('33333333-aaaa-3333-aaaa-333333333333', 2, '10:00', '18:00', true), -- Tuesday
  ('33333333-aaaa-3333-aaaa-333333333333', 3, '10:00', '18:00', true), -- Wednesday
  ('33333333-aaaa-3333-aaaa-333333333333', 4, '10:00', '18:00', true), -- Thursday
  ('33333333-aaaa-3333-aaaa-333333333333', 5, '10:00', '18:00', true), -- Friday
  ('33333333-aaaa-3333-aaaa-333333333333', 6, '10:00', '18:00', true); -- Saturday

-- ============================================
-- SPACE OWNER PROFILES
-- ============================================

INSERT INTO space_owner_profiles (id, user_id, business_name, contact_name, phone_number)
VALUES
  ('44444444-aaaa-4444-aaaa-444444444444', '44444444-4444-4444-4444-444444444444', 
   'Wellness Spaces SF', 'Jennifer Martinez', '415-555-0301');

-- ============================================
-- SPACES
-- ============================================

INSERT INTO spaces (id, owner_id, space_name, space_type, description, address_line1, city, state, zip_code, square_footage, capacity, hourly_rate, minimum_booking_hours, is_active, is_verified, average_rating, total_reviews)
VALUES
  ('55555555-aaaa-5555-aaaa-555555555555', '44444444-aaaa-4444-aaaa-444444444444',
   'Tranquil Treatment Room', 'treatment_room', 
   'Peaceful treatment room with massage table, aromatherapy diffuser, and calming music.',
   '123 Market Street, Suite 200', 'San Francisco', 'CA', '94105',
   200, 2, 45.00, 1, true, true, 4.7, 23),
  
  ('66666666-aaaa-6666-aaaa-666666666666', '44444444-aaaa-4444-aaaa-444444444444',
   'Spacious Yoga Studio', 'yoga_studio',
   'Bright studio with hardwood floors, mirrors, and yoga props available.',
   '123 Market Street, Suite 300', 'San Francisco', 'CA', '94105',
   800, 15, 80.00, 2, true, true, 4.9, 31);

-- ============================================
-- SPACE AMENITIES
-- ============================================

INSERT INTO space_amenities (space_id, amenity_name)
VALUES
  -- Treatment Room amenities
  ('55555555-aaaa-5555-aaaa-555555555555', 'wifi'),
  ('55555555-aaaa-5555-aaaa-555555555555', 'massage_table'),
  ('55555555-aaaa-5555-aaaa-555555555555', 'heating'),
  ('55555555-aaaa-5555-aaaa-555555555555', 'sound_system'),
  ('55555555-aaaa-5555-aaaa-555555555555', 'aromatherapy'),
  
  -- Yoga Studio amenities
  ('66666666-aaaa-6666-aaaa-666666666666', 'wifi'),
  ('66666666-aaaa-6666-aaaa-666666666666', 'mirrors'),
  ('66666666-aaaa-6666-aaaa-666666666666', 'yoga_mats'),
  ('66666666-aaaa-6666-aaaa-666666666666', 'blocks_straps'),
  ('66666666-aaaa-6666-aaaa-666666666666', 'sound_system'),
  ('66666666-aaaa-6666-aaaa-666666666666', 'natural_light'),
  ('66666666-aaaa-6666-aaaa-666666666666', 'changing_room');

-- ============================================
-- SPACE AVAILABILITY
-- ============================================

-- Treatment Room availability (Mon-Sun, 8am-8pm)
INSERT INTO space_availability (space_id, day_of_week, start_time, end_time, is_available)
VALUES
  ('55555555-aaaa-5555-aaaa-555555555555', 1, '08:00', '20:00', true), -- Monday
  ('55555555-aaaa-5555-aaaa-555555555555', 2, '08:00', '20:00', true), -- Tuesday
  ('55555555-aaaa-5555-aaaa-555555555555', 3, '08:00', '20:00', true), -- Wednesday
  ('55555555-aaaa-5555-aaaa-555555555555', 4, '08:00', '20:00', true), -- Thursday
  ('55555555-aaaa-5555-aaaa-555555555555', 5, '08:00', '20:00', true), -- Friday
  ('55555555-aaaa-5555-aaaa-555555555555', 6, '09:00', '18:00', true), -- Saturday
  ('55555555-aaaa-5555-aaaa-555555555555', 0, '10:00', '17:00', true); -- Sunday

-- Yoga Studio availability (Mon-Fri, 6am-10pm, Weekends 8am-8pm)
INSERT INTO space_availability (space_id, day_of_week, start_time, end_time, is_available)
VALUES
  ('66666666-aaaa-6666-aaaa-666666666666', 1, '06:00', '22:00', true), -- Monday
  ('66666666-aaaa-6666-aaaa-666666666666', 2, '06:00', '22:00', true), -- Tuesday
  ('66666666-aaaa-6666-aaaa-666666666666', 3, '06:00', '22:00', true), -- Wednesday
  ('66666666-aaaa-6666-aaaa-666666666666', 4, '06:00', '22:00', true), -- Thursday
  ('66666666-aaaa-6666-aaaa-666666666666', 5, '06:00', '22:00', true), -- Friday
  ('66666666-aaaa-6666-aaaa-666666666666', 6, '08:00', '20:00', true), -- Saturday
  ('66666666-aaaa-6666-aaaa-666666666666', 0, '08:00', '20:00', true); -- Sunday

-- ============================================
-- SAMPLE BOOKINGS
-- ============================================

-- Sample client-provider booking (past, completed)
INSERT INTO client_provider_bookings (
  client_id, provider_id, service_id, booking_date, start_time, end_time, 
  duration_minutes, status, total_amount, payment_status
)
SELECT 
  '11111111-aaaa-1111-aaaa-111111111111',
  '22222222-aaaa-2222-aaaa-222222222222',
  id,
  CURRENT_DATE - INTERVAL '7 days',
  '14:00',
  '15:00',
  60,
  'completed',
  90.00,
  'paid'
FROM provider_services 
WHERE provider_id = '22222222-aaaa-2222-aaaa-222222222222' 
  AND service_name = 'Swedish Massage'
LIMIT 1;

-- Sample provider-space booking (upcoming, confirmed)
INSERT INTO provider_space_bookings (
  provider_id, space_id, booking_date, start_time, end_time,
  duration_hours, status, total_amount, payment_status
)
VALUES
  ('22222222-aaaa-2222-aaaa-222222222222',
   '55555555-aaaa-5555-aaaa-555555555555',
   CURRENT_DATE + INTERVAL '3 days',
   '10:00',
   '14:00',
   4.0,
   'confirmed',
   180.00,
   'paid');

-- ============================================
-- SAMPLE REVIEWS
-- ============================================

-- Review for provider
INSERT INTO reviews (reviewer_id, provider_id, rating, title, comment, is_published)
VALUES
  ('11111111-1111-1111-1111-111111111111',
   '22222222-aaaa-2222-aaaa-222222222222',
   5,
   'Excellent massage!',
   'Michael really knows his craft. The deep tissue massage was exactly what I needed after my marathon training. Highly recommend!',
   true);

-- Review for space
INSERT INTO reviews (reviewer_id, space_id, rating, title, comment, is_published)
VALUES
  ('22222222-2222-2222-2222-222222222222',
   '55555555-aaaa-5555-aaaa-555555555555',
   5,
   'Perfect treatment room',
   'The space is clean, peaceful, and has everything I need for my massage practice. Jennifer is very responsive and professional.',
   true);

-- ============================================
-- SAMPLE FAVORITES
-- ============================================

INSERT INTO favorites (user_id, provider_id)
VALUES
  ('11111111-1111-1111-1111-111111111111', '22222222-aaaa-2222-aaaa-222222222222');

INSERT INTO favorites (user_id, space_id)
VALUES
  ('22222222-2222-2222-2222-222222222222', '55555555-aaaa-5555-aaaa-555555555555');

-- ============================================
-- END OF SEED DATA
-- ============================================

SELECT 'Seed data inserted successfully!' AS status;

