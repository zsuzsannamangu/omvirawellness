'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import styles from '@/styles/Search.module.scss';
import FavoriteAuthModal from '@/components/FavoriteAuthModal';
import { isClientAuthenticated, getClientId, getFavoriteStatus, addFavorite, removeFavorite } from '@/services/favorites';

// Helper function to find next available date from availability slots
const getNextAvailableDate = (availability: any): string | null => {
  if (!availability || !Array.isArray(availability) || availability.length === 0) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Normalize date string to YYYY-MM-DD
  const normalizeDateString = (value: string): string => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // First, collect all blocked slots to filter them out later
  const blockedSlots = new Set<string>(); // Store as "YYYY-MM-DD|HH:MM"
  availability.forEach((slot: any) => {
    if (slot.type === 'blocked' && slot.date && slot.time) {
      const normalizedDate = normalizeDateString(slot.date);
      const normalizedTime = String(slot.time).slice(0, 5); // Get HH:MM format
      blockedSlots.add(`${normalizedDate}|${normalizedTime}`);
    }
  });

  // Collect all available dates (one-time and recurring)
  const availableDates: string[] = [];
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 6); // Look up to 6 months ahead

  availability.forEach((slot: any) => {
    // Skip blocked slots (these are slots that have been booked)
    if (slot.type === 'blocked') return;
    if (!slot.date || !slot.time) return;

    const normalizedSlotDate = normalizeDateString(slot.date);
    const normalizedTime = String(slot.time).slice(0, 5); // Get HH:MM format

    if (!slot.isRecurring) {
      // One-time availability - check if it's blocked
      const slotKey = `${normalizedSlotDate}|${normalizedTime}`;
      if (blockedSlots.has(slotKey)) return;
      
      // Parse as local date to avoid timezone issues
      const [slotYear, slotMonth, slotDay] = normalizedSlotDate.split('-').map(Number);
      const slotDate = new Date(slotYear, slotMonth - 1, slotDay);
      slotDate.setHours(0, 0, 0, 0);
      // Include today and future dates
      if (slotDate >= today) {
        availableDates.push(normalizedSlotDate);
      }
    } else if (slot.recurringPattern) {
      // Recurring availability
      if (slot.recurringPattern.frequency === 'weekly' && slot.recurringPattern.daysOfWeek) {
        const [slotYear, slotMonth, slotDay] = normalizedSlotDate.split('-').map(Number);
        const startDate = new Date(slotYear, slotMonth - 1, slotDay);
        startDate.setHours(0, 0, 0, 0);

        // Check end date limit
        let endDate = maxDate;
        if (slot.recurringPattern.endDate) {
          const normalizedEndDate = normalizeDateString(slot.recurringPattern.endDate);
          const [endYear, endMonth, endDay] = normalizedEndDate.split('-').map(Number);
          const calculatedEndDate = new Date(endYear, endMonth - 1, endDay);
          calculatedEndDate.setHours(0, 0, 0, 0);
          if (calculatedEndDate < endDate) {
            endDate = calculatedEndDate;
          }
        }

        // Generate dates that match the pattern
        const currentDate = new Date(Math.max(startDate.getTime(), today.getTime()));
        
        while (currentDate <= endDate) {
          const dayOfWeek = currentDate.getDay();
          if (slot.recurringPattern.daysOfWeek.includes(dayOfWeek)) {
            const dateStr = normalizeDateString(
              `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
            );
            // Check if this specific date+time is blocked
            const slotKey = `${dateStr}|${normalizedTime}`;
            if (!blockedSlots.has(slotKey)) {
              availableDates.push(dateStr);
            }
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    }
  });

  // Remove duplicates, sort, and find the first one today or after
  const uniqueDates = Array.from(new Set(availableDates)).sort();
  
  // Parse today as local date (YYYY-MM-DD components)
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  
  const nextDate = uniqueDates.find(date => {
    // Parse date string as local date to avoid timezone issues
    const [year, month, day] = date.split('-').map(Number);
    
    // Compare year, month, day directly
    // Find the first date that is today or later (but we'll handle "today" separately in display)
    if (year > todayYear) return true;
    if (year < todayYear) return false;
    if (month > todayMonth) return true;
    if (month < todayMonth) return false;
    // Include today and future days
    return day >= todayDay;
  });

  return nextDate || null;
};

// Format date for display
const formatNextAvailability = (dateString: string | null): string => {
  if (!dateString) return 'No availability';
  
  // Parse date string as local date to avoid timezone issues
  const [year, month, day] = dateString.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  // Get today and tomorrow as local dates
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Compare dates
  const dateTime = dateObj.getTime();
  const todayTime = today.getTime();
  const tomorrowTime = tomorrow.getTime();
  
  if (dateTime === todayTime) {
    return 'Today';
  } else if (dateTime === tomorrowTime) {
    return 'Tomorrow';
  } else {
    // Format as "Mon, Jan 15" or "Jan 15, 2025" if it's next year
    const sameYear = dateObj.getFullYear() === now.getFullYear();
    
    if (sameYear) {
      return dateObj.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric'
      });
    } else {
      return dateObj.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    }
  }
};


const categories = [
  'Private Yoga',
  'Yoga Therapy', 
  'Massage',
  'Skincare',
  'Reiki',
  'Energy Work',
  'Ayurveda',
  'Acupuncture',
  'Personal Training',
  'Doula Care',
  'Hair Styling',
  'Nail Care',
  'Makeup'
];

// Format business type string: capitalize and add proper spacing
const formatBusinessType = (businessType: string | null | undefined): string => {
  if (!businessType) return 'Wellness Services';
  
  return businessType
    .split(',')
    .map(item => {
      const trimmed = item.trim();
      // Capitalize first letter of each word
      return trimmed
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    })
    .join(', ');
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [comesToMe, setComesToMe] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('Most Relevant');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fetch providers from API
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        console.log('Fetching providers from API...');
        const response = await fetch('http://localhost:4000/api/providers');
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched providers from API:', data);
          console.log('Number of providers:', data.length);
          
          setProviders(data || []);
        } else {
          console.error('API failed with status:', response.status);
          const errorData = await response.text();
          console.error('Error data:', errorData);
          setProviders([]);
        }
      } catch (error) {
        console.error('Error fetching providers:', error);
        setProviders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // Check authentication and load favorites
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isClientAuthenticated();
      setIsAuthenticated(authenticated);
      return authenticated;
    };

    const loadFavorites = async () => {
      if (!checkAuth()) {
        return;
      }

      try {
        const clientId = getClientId();
        if (!clientId) return;

        // Wait for providers to load first
        if (providers.length > 0) {
          const providerIds = providers.map(p => p.id);
          const favoriteStatus = await getFavoriteStatus(clientId, providerIds);
          setFavorites(favoriteStatus);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, [providers]);

  // Handle URL parameters on component mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryParam = urlParams.get('q');
      const serviceParam = urlParams.get('service');
      
      if (queryParam) {
        setSearchQuery(queryParam);
      }
      
      if (serviceParam) {
        setSelectedCategories([serviceParam]);
      }
    }
  }, []);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleFavorite = async (providerId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // Check if user is authenticated
    if (!isClientAuthenticated()) {
      setShowAuthModal(true);
      return;
    }

    const clientId = getClientId();
    if (!clientId) {
      setShowAuthModal(true);
      return;
    }

    try {
      const isCurrentlyFavorited = favorites[providerId];
      
      if (isCurrentlyFavorited) {
        // Remove from favorites
        await removeFavorite(clientId, providerId);
        setFavorites(prev => {
          const newFavorites = { ...prev };
          delete newFavorites[providerId];
          return newFavorites;
        });
      } else {
        // Add to favorites
        await addFavorite(clientId, providerId);
        setFavorites(prev => ({
          ...prev,
          [providerId]: true
        }));
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      if (error.message === 'Not authenticated') {
        setShowAuthModal(true);
      }
    }
  };

  return (
    <div className={styles.searchPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            Omvira Wellness
          </Link>
          
          <div className={styles.searchBar}>
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search for a provider"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <button 
            ref={buttonRef}
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Side Menu */}
      {isMenuOpen && (
        <div ref={menuRef} className={styles.sideMenu}>
          <div className={styles.menuContent}>
            <Link href="/login" className={styles.menuItem}>
              Login
            </Link>
            <Link href="/signup" className={styles.menuItem}>
              Sign Up
            </Link>
            <Link href="/providers" className={styles.menuItem}>
              For Providers
            </Link>
          </div>
        </div>
      )}

      <div className={styles.mainContent}>
        {/* Filter Bar */}
        <div className={styles.filterBar}>
          <button className={styles.resetButton}>RESET FILTERS</button>
          
          <div className={styles.filterDropdowns}>
            <select className={styles.filterDropdown}>
              <option>Service</option>
              <option>Private Yoga</option>
              <option>Yoga Therapy</option>
              <option>Massage</option>
              <option>Skincare</option>
              <option>Reiki</option>
              <option>Energy Work</option>
              <option>Ayurveda</option>
              <option>Acupuncture</option>
              <option>Personal Training</option>
              <option>Doula Care</option>
              <option>Hair Styling</option>
              <option>Nail Care</option>
              <option>Makeup</option>
            </select>
            
            <select className={styles.filterDropdown}>
              <option>Location</option>
              <option>Comes to Me</option>
              <option>Provider's Studio</option>
              <option>Provider's Home</option>
              <option>Virtual Session</option>
            </select>
            
            <select className={styles.filterDropdown}>
              <option>Price Range</option>
              <option>$0 - $50</option>
              <option>$50 - $100</option>
              <option>$100 - $150</option>
              <option>$150 - $200</option>
              <option>$200+</option>
            </select>
          </div>
        </div>

        {/* Sort Section */}
        <div className={styles.sortSection}>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortDropdown}
          >
            <option value="Most Relevant">Popularity</option>
            <option value="Highest Rated">Highest Rated</option>
            <option value="Lowest Price">Lowest Price</option>
            <option value="Highest Price">Highest Price</option>
            <option value="Most Reviews">Most Experienced</option>
          </select>
        </div>

        {/* Provider Grid */}
        {loading ? (
          <div className={styles.loading}>Loading providers...</div>
        ) : (
          <div className={styles.providersGrid}>
            {providers.length === 0 ? (
              <div className={styles.noResults}>No providers found</div>
            ) : (
              providers.map((provider: any) => (
                <Link key={provider.id} href={`/search/${provider.id}`} className={styles.providerCardLink}>
                  <div className={styles.providerCard}>
                    <div className={styles.providerImage}>
                      <Image
                        src={provider.profile_photo_url || '/images/default-provider.jpg'}
                        alt={provider.contact_name || provider.business_name || 'Provider'}
                        width={300}
                        height={200}
                        className={styles.image}
                      />
                      {(() => {
                        // Parse availability if it's a string
                        let availability = [];
                        if (provider.availability) {
                          if (typeof provider.availability === 'string') {
                            try {
                              availability = JSON.parse(provider.availability);
                            } catch (e) {
                              availability = [];
                            }
                          } else if (Array.isArray(provider.availability)) {
                            availability = provider.availability;
                          }
                        }
                        
                        const nextDate = getNextAvailableDate(availability);
                        const formattedDate = formatNextAvailability(nextDate);
                        
                        return (
                          <div className={styles.duration}>
                            Next: {formattedDate}
                          </div>
                        );
                      })()}
                    </div>
                    
                    <div className={styles.providerInfo}>
                      <div className={styles.providerNameRow}>
                        <h3 className={styles.providerName}>{provider.contact_name || provider.business_name}</h3>
                        {isAuthenticated && (
                          <button
                            className={`${styles.favoriteButton} ${favorites[provider.id] ? styles.favorited : ''}`}
                            onClick={(e) => toggleFavorite(provider.id, e)}
                            title={favorites[provider.id] ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            {favorites[provider.id] ? <FaHeart /> : <FaRegHeart />}
                          </button>
                        )}
                      </div>
                      <p className={styles.providerServices}>{formatBusinessType(provider.business_type)}</p>
                      <p className={styles.providerLocation}>{provider.city}, {provider.state}</p>
                      <div className={styles.providerRating}>
                        <span className={styles.stars}>★★★★★</span>
                        <span className={styles.ratingText}>
                          {provider.average_rating || '4.5'} ({provider.total_reviews || 0} reviews)
                        </span>
                      </div>
                      {provider.services && provider.services.length > 0 && (
                        <p className={styles.startingPrice}>From ${provider.services[0].price}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
      
      <FavoriteAuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
} 