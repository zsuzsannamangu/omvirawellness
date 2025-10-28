-- ============================================
-- OMVIRA WELLNESS DATABASE SCHEMA
-- ============================================
-- Initial schema for clients, providers, spaces, and bookings
-- Author: Database Schema Design
-- Date: 2025-10-25
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (Base table for all user types)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('client', 'provider', 'space_owner')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);

-- ============================================
-- CLIENT PROFILES
-- ============================================
CREATE TABLE client_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20),
  date_of_birth DATE,
  gender VARCHAR(20),
  profile_photo_url TEXT,
  
  -- Address information
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'USA',
  
  -- Preferences
  preferred_services TEXT[], -- Array of service categories
  notes TEXT, -- Special requirements or preferences
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_client_profiles_user_id ON client_profiles(user_id);

-- ============================================
-- PROVIDER PROFILES
-- ============================================
CREATE TABLE provider_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255),
  contact_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  bio TEXT,
  profile_photo_url TEXT,
  
  -- Credentials & certifications
  credentials TEXT[], -- Array of certification names
  years_experience INTEGER,
  license_number VARCHAR(100),
  
  -- Address information
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'USA',
  
  -- Business details
  business_type VARCHAR(50), -- e.g., 'massage_therapy', 'acupuncture', etc.
  accepts_insurance BOOLEAN DEFAULT false,
  insurance_providers TEXT[], -- Array of insurance companies
  
  -- Verification
  is_verified BOOLEAN DEFAULT false,
  verification_documents TEXT[], -- URLs to verification documents
  
  -- Ratings
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_provider_profiles_user_id ON provider_profiles(user_id);
CREATE INDEX idx_provider_profiles_city_state ON provider_profiles(city, state);
CREATE INDEX idx_provider_profiles_business_type ON provider_profiles(business_type);

-- ============================================
-- PROVIDER SERVICES
-- ============================================
CREATE TABLE provider_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  service_category VARCHAR(100) NOT NULL, -- e.g., 'massage', 'acupuncture', 'yoga'
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_provider_services_provider_id ON provider_services(provider_id);
CREATE INDEX idx_provider_services_category ON provider_services(service_category);

-- ============================================
-- PROVIDER AVAILABILITY
-- ============================================
CREATE TABLE provider_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT check_time_order CHECK (end_time > start_time)
);

CREATE INDEX idx_provider_availability_provider_id ON provider_availability(provider_id);
CREATE INDEX idx_provider_availability_day ON provider_availability(day_of_week);

-- ============================================
-- PROVIDER PHOTOS
-- ============================================
CREATE TABLE provider_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_provider_photos_provider_id ON provider_photos(provider_id);

-- ============================================
-- SPACE OWNER PROFILES
-- ============================================
CREATE TABLE space_owner_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255),
  contact_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_space_owner_profiles_user_id ON space_owner_profiles(user_id);

-- ============================================
-- SPACES
-- ============================================
CREATE TABLE spaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES space_owner_profiles(id) ON DELETE CASCADE,
  space_name VARCHAR(255) NOT NULL,
  space_type VARCHAR(50) NOT NULL, -- e.g., 'treatment_room', 'yoga_studio', 'office'
  description TEXT,
  
  -- Address information
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) DEFAULT 'USA',
  
  -- Space details
  square_footage INTEGER,
  capacity INTEGER,
  floor_number INTEGER,
  has_elevator BOOLEAN DEFAULT false,
  
  -- Pricing
  hourly_rate DECIMAL(10,2) NOT NULL,
  minimum_booking_hours INTEGER DEFAULT 1,
  cancellation_policy TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  
  -- Ratings
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_spaces_owner_id ON spaces(owner_id);
CREATE INDEX idx_spaces_city_state ON spaces(city, state);
CREATE INDEX idx_spaces_type ON spaces(space_type);
CREATE INDEX idx_spaces_active ON spaces(is_active);

-- ============================================
-- SPACE AMENITIES
-- ============================================
CREATE TABLE space_amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  amenity_name VARCHAR(100) NOT NULL, -- e.g., 'wifi', 'parking', 'massage_table'
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_space_amenities_space_id ON space_amenities(space_id);

-- ============================================
-- SPACE AVAILABILITY
-- ============================================
CREATE TABLE space_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT check_space_time_order CHECK (end_time > start_time)
);

CREATE INDEX idx_space_availability_space_id ON space_availability(space_id);
CREATE INDEX idx_space_availability_day ON space_availability(day_of_week);

-- ============================================
-- SPACE PHOTOS
-- ============================================
CREATE TABLE space_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_space_photos_space_id ON space_photos(space_id);

-- ============================================
-- CLIENT-PROVIDER BOOKINGS
-- ============================================
CREATE TABLE client_provider_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES provider_services(id) ON DELETE CASCADE,
  
  -- Booking details
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  cancelled_by VARCHAR(20), -- 'client' or 'provider'
  cancellation_reason TEXT,
  
  -- Payment
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'partial_refund')),
  payment_method VARCHAR(50),
  payment_transaction_id VARCHAR(255),
  
  -- Notes
  client_notes TEXT,
  provider_notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT check_booking_time_order CHECK (end_time > start_time)
);

CREATE INDEX idx_client_provider_bookings_client ON client_provider_bookings(client_id);
CREATE INDEX idx_client_provider_bookings_provider ON client_provider_bookings(provider_id);
CREATE INDEX idx_client_provider_bookings_date ON client_provider_bookings(booking_date);
CREATE INDEX idx_client_provider_bookings_status ON client_provider_bookings(status);

-- ============================================
-- PROVIDER-SPACE BOOKINGS
-- ============================================
CREATE TABLE provider_space_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  space_id UUID NOT NULL REFERENCES spaces(id) ON DELETE CASCADE,
  
  -- Booking details
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_hours DECIMAL(4,2) NOT NULL,
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  cancelled_by VARCHAR(20), -- 'provider' or 'space_owner'
  cancellation_reason TEXT,
  
  -- Payment
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'partial_refund')),
  payment_method VARCHAR(50),
  payment_transaction_id VARCHAR(255),
  
  -- Notes
  provider_notes TEXT,
  space_owner_notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT check_space_booking_time_order CHECK (end_time > start_time)
);

CREATE INDEX idx_provider_space_bookings_provider ON provider_space_bookings(provider_id);
CREATE INDEX idx_provider_space_bookings_space ON provider_space_bookings(space_id);
CREATE INDEX idx_provider_space_bookings_date ON provider_space_bookings(booking_date);
CREATE INDEX idx_provider_space_bookings_status ON provider_space_bookings(status);

-- ============================================
-- REVIEWS (for both providers and spaces)
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Review target (either provider or space, not both)
  provider_id UUID REFERENCES provider_profiles(id) ON DELETE CASCADE,
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  
  -- Review content
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  
  -- Review status
  is_published BOOLEAN DEFAULT true,
  is_flagged BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT check_review_target CHECK (
    (provider_id IS NOT NULL AND space_id IS NULL) OR
    (provider_id IS NULL AND space_id IS NOT NULL)
  )
);

CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_reviews_provider ON reviews(provider_id);
CREATE INDEX idx_reviews_space ON reviews(space_id);
CREATE INDEX idx_reviews_published ON reviews(is_published);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  notification_type VARCHAR(50) NOT NULL, -- e.g., 'booking_confirmed', 'booking_reminder', 'review_received'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Reference to related entities
  booking_id UUID, -- Can reference either type of booking
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  is_emailed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- FAVORITES (clients can favorite providers/spaces)
-- ============================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Favorite target (either provider or space, not both)
  provider_id UUID REFERENCES provider_profiles(id) ON DELETE CASCADE,
  space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT check_favorite_target CHECK (
    (provider_id IS NOT NULL AND space_id IS NULL) OR
    (provider_id IS NULL AND space_id IS NOT NULL)
  ),
  CONSTRAINT unique_favorite UNIQUE (user_id, provider_id, space_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_provider ON favorites(provider_id);
CREATE INDEX idx_favorites_space ON favorites(space_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_profiles_updated_at BEFORE UPDATE ON client_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_provider_profiles_updated_at BEFORE UPDATE ON provider_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_provider_services_updated_at BEFORE UPDATE ON provider_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_provider_availability_updated_at BEFORE UPDATE ON provider_availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_space_owner_profiles_updated_at BEFORE UPDATE ON space_owner_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spaces_updated_at BEFORE UPDATE ON spaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_space_availability_updated_at BEFORE UPDATE ON space_availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_provider_bookings_updated_at BEFORE UPDATE ON client_provider_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_provider_space_bookings_updated_at BEFORE UPDATE ON provider_space_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment below to add sample data

/*
-- Sample client user
INSERT INTO users (email, password_hash, user_type, email_verified) 
VALUES ('client@example.com', '$2b$10$samplehash', 'client', true);

-- Sample provider user
INSERT INTO users (email, password_hash, user_type, email_verified) 
VALUES ('provider@example.com', '$2b$10$samplehash', 'provider', true);

-- Sample space owner user
INSERT INTO users (email, password_hash, user_type, email_verified) 
VALUES ('space@example.com', '$2b$10$samplehash', 'space_owner', true);
*/

-- ============================================
-- END OF SCHEMA
-- ============================================

