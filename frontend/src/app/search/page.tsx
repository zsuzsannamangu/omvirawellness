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


import { SERVICE_CATEGORIES, getCategoryNames } from '@/config/categories';

const categories = getCategoryNames();

// Format business type string: map category IDs to display names
// Only show categories that are in the unified SERVICE_CATEGORIES list
const formatBusinessType = (businessType: string | null | undefined): string => {
  if (!businessType) return 'Wellness Services';
  
  const validCategories = businessType
    .split(',')
    .map(item => {
      const trimmed = item.trim().toLowerCase();
      // Find category by ID (handle both old format and new format)
      const category = SERVICE_CATEGORIES.find(cat => 
        cat.id === trimmed || 
        cat.id === trimmed.replace(/\s+/g, '-') ||
        cat.name.toLowerCase() === trimmed ||
        cat.displayName.toLowerCase() === trimmed
      );
      
      // Only return display name if category is found in unified list
      return category ? category.displayName : null;
    })
    .filter(Boolean) // Remove null values (categories not in unified list)
    .filter((cat): cat is string => cat !== null); // Type guard
    
  // If no valid categories found, return default
  return validCategories.length > 0 ? validCategories.join(', ') : 'Wellness Services';
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
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
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
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

  // Check for dashboard URL on client side only
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userDataStr = localStorage.getItem('user');
    
    if (!token || !userDataStr) {
      setDashboardUrl(null);
      return;
    }
    
    try {
      const userData = JSON.parse(userDataStr);
      const userId = userData.id || userData.userId;
      const userType = userData.user_type || userData.userType;
      
      if (userType === 'client') {
        setDashboardUrl(`/dashboard/${userId}`);
      } else if (userType === 'provider') {
        setDashboardUrl(`/providers/dashboard/${userId}`);
      } 
      // SPACES FEATURE - COMMENTED OUT FOR MVP
      // else if (userType === 'space_owner') {
      //   setDashboardUrl(`/spaces/dashboard/${userId}`);
      // }
    } catch (e) {
      console.error('Error parsing user data:', e);
      setDashboardUrl(null);
    }
  }, []);

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

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedService('');
    setSelectedLocation('');
    setSelectedPriceRange('');
    setSortBy('Most Relevant');
  };

  // Helper function to check if search query matches a category
  const matchesCategory = (query: string, businessType: string | null | undefined): boolean => {
    if (!businessType) return false;
    
    const queryLower = query.toLowerCase().trim();
    const businessTypes = businessType.toLowerCase().split(',').map((t: string) => t.trim());
    
    // Check each category in the provider's business_type
    for (const type of businessTypes) {
      // Find the category
      const category = SERVICE_CATEGORIES.find(cat => 
        cat.id === type || 
        cat.id === type.replace(/\s+/g, '-') ||
        cat.name.toLowerCase() === type ||
        cat.displayName.toLowerCase() === type
      );
      
      if (category) {
        // Check if query matches category name, display name, or ID
        const categoryName = category.name.toLowerCase();
        const categoryDisplay = category.displayName.toLowerCase();
        const categoryId = category.id.toLowerCase();
        
        // Direct matches
        if (categoryName.includes(queryLower) || 
            categoryDisplay.includes(queryLower) ||
            queryLower.includes(categoryName) ||
            queryLower.includes(categoryDisplay)) {
          return true;
        }
        
        // Keyword matching - check if query contains keywords related to this category
        const categoryKeywords = [
          categoryName,
          categoryDisplay,
          ...categoryName.split(' '),
          ...categoryDisplay.split(' '),
          categoryId.replace(/-/g, ' ')
        ];
        
        // Check if any keyword from the category matches the query
        for (const keyword of categoryKeywords) {
          if (keyword && keyword.length > 2) {
            if (queryLower.includes(keyword) || keyword.includes(queryLower)) {
              return true;
            }
          }
        }
      }
    }
    
    return false;
  };

  // Helper function to calculate search relevance score
  const calculateRelevanceScore = (provider: any, query: string): number => {
    const queryLower = query.toLowerCase().trim();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
    let score = 0;
    
    // Name matches (highest priority)
    const nameMatch = (provider.contact_name || '').toLowerCase();
    const businessNameMatch = (provider.business_name || '').toLowerCase();
    if (nameMatch.includes(queryLower)) score += 100;
    if (businessNameMatch.includes(queryLower)) score += 90;
    for (const word of queryWords) {
      if (nameMatch.includes(word)) score += 20;
      if (businessNameMatch.includes(word)) score += 18;
    }
    
    // Category matches (high priority)
    if (matchesCategory(query, provider.business_type)) {
      score += 80;
      // Boost if exact category match
      const formattedType = formatBusinessType(provider.business_type).toLowerCase();
      if (formattedType.includes(queryLower)) score += 30;
    }
    
    // Bio and specialties matches (medium priority)
    const bio = (provider.bio || '').toLowerCase();
    const specialties = (provider.specialties || '').toLowerCase();
    if (bio.includes(queryLower)) score += 40;
    if (specialties.includes(queryLower)) score += 35;
    for (const word of queryWords) {
      if (bio.includes(word)) score += 5;
      if (specialties.includes(word)) score += 4;
    }
    
    // Service name matches (medium priority)
    if (provider.services && Array.isArray(provider.services)) {
      for (const service of provider.services) {
        const serviceName = (service.name || '').toLowerCase();
        if (serviceName.includes(queryLower)) score += 30;
        for (const word of queryWords) {
          if (serviceName.includes(word)) score += 3;
        }
      }
    }
    
    // Location matches (lower priority)
    const city = (provider.city || '').toLowerCase();
    const state = (provider.state || '').toLowerCase();
    if (city.includes(queryLower)) score += 10;
    if (state.includes(queryLower)) score += 10;
    
    return score;
  };

  // Filter and sort providers
  const filteredAndSortedProviders = React.useMemo(() => {
    let filtered = [...providers];

    // Enhanced keyword-based search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const queryWords = query.split(/\s+/).filter(w => w.length > 0);
      
      filtered = filtered.filter(provider => {
        // Check name matches
        const nameMatch = (provider.contact_name || '').toLowerCase();
        const businessNameMatch = (provider.business_name || '').toLowerCase();
        if (nameMatch.includes(query) || businessNameMatch.includes(query)) {
          return true;
        }
        
        // Check category matches (keyword-based)
        if (matchesCategory(query, provider.business_type)) {
          return true;
        }
        
        // Check bio and specialties
        const bio = (provider.bio || '').toLowerCase();
        const specialties = (provider.specialties || '').toLowerCase();
        if (bio.includes(query) || specialties.includes(query)) {
          return true;
        }
        
        // Check service names
        if (provider.services && Array.isArray(provider.services)) {
          for (const service of provider.services) {
            const serviceName = (service.name || '').toLowerCase();
            if (serviceName.includes(query)) {
              return true;
            }
          }
        }
        
        // Check location
        const city = (provider.city || '').toLowerCase();
        const state = (provider.state || '').toLowerCase();
        if (city.includes(query) || state.includes(query)) {
          return true;
        }
        
        // Word-by-word matching for multi-word queries
        if (queryWords.length > 1) {
          let matchesAllWords = true;
          for (const word of queryWords) {
            if (word.length < 2) continue; // Skip very short words
            const wordMatches = 
              nameMatch.includes(word) ||
              businessNameMatch.includes(word) ||
              bio.includes(word) ||
              specialties.includes(word) ||
              city.includes(word) ||
              state.includes(word) ||
              matchesCategory(word, provider.business_type);
            
            if (!wordMatches) {
              matchesAllWords = false;
              break;
            }
          }
          if (matchesAllWords) return true;
        }
        
        return false;
      });
      
      // Sort by relevance score if there's a search query
      filtered.sort((a, b) => {
        const scoreA = calculateRelevanceScore(a, searchQuery);
        const scoreB = calculateRelevanceScore(b, searchQuery);
        return scoreB - scoreA; // Higher score first
      });
    }

    // Service filter
    if (selectedService && selectedService !== 'Service') {
      // Find the category by display name to get its ID
      const selectedCategory = SERVICE_CATEGORIES.find(cat => cat.displayName === selectedService);
      const categoryId = selectedCategory ? selectedCategory.id : selectedService.toLowerCase().replace(/\s+/g, '-');
      const categoryName = selectedCategory ? selectedCategory.name.toLowerCase() : selectedService.toLowerCase();
      const categoryDisplayName = selectedService.toLowerCase();
      
      filtered = filtered.filter(provider => {
        if (!provider.business_type) return false;
        const businessTypes = provider.business_type.toLowerCase().split(',').map((t: string) => t.trim());
        
        // Check if any stored category matches the selected one
        return businessTypes.some((type: string) => {
          // Match by ID
          if (type === categoryId) return true;
          
          // Match by name
          if (type === categoryName) return true;
          
          // Match by display name
          if (type === categoryDisplayName) return true;
          
          // Find stored category and check if it matches
          const storedCategory = SERVICE_CATEGORIES.find(cat => 
            cat.id === type || 
            cat.id === type.replace(/\s+/g, '-') ||
            cat.name.toLowerCase() === type ||
            cat.displayName.toLowerCase() === type
          );
          
          if (storedCategory && selectedCategory) {
            return storedCategory.id === selectedCategory.id;
          }
          
          // Fallback: partial match for backward compatibility
          return type.includes(categoryId) || type.includes(categoryName) || type.includes(categoryDisplayName);
        });
      });
    }

    // Location filter
    if (selectedLocation && selectedLocation !== 'Location') {
      filtered = filtered.filter(provider => {
        if (!provider.work_location || !Array.isArray(provider.work_location)) return false;
        
        if (selectedLocation === 'Comes to Me') {
          return provider.work_location.includes('at-client-location');
        } else if (selectedLocation === "Provider's Studio") {
          return provider.work_location.includes('from-booked-studio');
        } else if (selectedLocation === "Provider's Home") {
          return provider.work_location.includes('at-my-place');
        } else if (selectedLocation === 'Virtual Session') {
          return provider.work_location.includes('online');
        }
        return true;
      });
    }

    // Price range filter
    if (selectedPriceRange && selectedPriceRange !== 'Price Range') {
      filtered = filtered.filter(provider => {
        if (!provider.services || provider.services.length === 0) return false;
        const minPrice = Math.min(...provider.services.map((s: any) => parseFloat(s.price) || 0));
        
        if (selectedPriceRange === '$0 - $50') {
          return minPrice >= 0 && minPrice <= 50;
        } else if (selectedPriceRange === '$50 - $100') {
          return minPrice >= 50 && minPrice <= 100;
        } else if (selectedPriceRange === '$100 - $150') {
          return minPrice >= 100 && minPrice <= 150;
        } else if (selectedPriceRange === '$150 - $200') {
          return minPrice >= 150 && minPrice <= 200;
        } else if (selectedPriceRange === '$200+') {
          return minPrice >= 200;
        }
        return true;
      });
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'Highest Rated') {
        return (b.average_rating || 0) - (a.average_rating || 0);
      } else if (sortBy === 'Lowest Price') {
        const aMin = a.services?.length > 0 ? Math.min(...a.services.map((s: any) => parseFloat(s.price) || 999999)) : 999999;
        const bMin = b.services?.length > 0 ? Math.min(...b.services.map((s: any) => parseFloat(s.price) || 999999)) : 999999;
        return aMin - bMin;
      } else if (sortBy === 'Highest Price') {
        const aMax = a.services?.length > 0 ? Math.max(...a.services.map((s: any) => parseFloat(s.price) || 0)) : 0;
        const bMax = b.services?.length > 0 ? Math.max(...b.services.map((s: any) => parseFloat(s.price) || 0)) : 0;
        return bMax - aMax;
      } else if (sortBy === 'Most Experienced') {
        return (b.total_reviews || 0) - (a.total_reviews || 0);
      }
      // Most Relevant (default) - could be based on rating + reviews
      return ((b.average_rating || 0) * (b.total_reviews || 0)) - ((a.average_rating || 0) * (a.total_reviews || 0));
    });

    return sorted;
  }, [providers, searchQuery, selectedService, selectedLocation, selectedPriceRange, sortBy]);

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

          <div className={styles.headerActions}>
            {dashboardUrl && (
              <Link href={dashboardUrl} className={styles.dashboardLink}>
                <span className={styles.dashboardArrow}>←</span>
                Back to Dashboard
              </Link>
            )}
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
          <button 
            className={styles.resetButton}
            onClick={handleResetFilters}
          >
            RESET FILTERS
          </button>
          
          <div className={styles.filterDropdowns}>
            <select 
              className={styles.filterDropdown}
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option value="">Service</option>
              {SERVICE_CATEGORIES.map((category) => (
                <option key={category.id} value={category.displayName}>
                  {category.displayName}
                </option>
              ))}
            </select>
            
            <select 
              className={styles.filterDropdown}
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Location</option>
              <option value="Comes to Me">Comes to Me</option>
              <option value="Provider's Studio">Provider's Studio</option>
              <option value="Provider's Home">Provider's Home</option>
              <option value="Virtual Session">Virtual Session</option>
            </select>
            
            <select 
              className={styles.filterDropdown}
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
            >
              <option value="">Price Range</option>
              <option value="$0 - $50">$0 - $50</option>
              <option value="$50 - $100">$50 - $100</option>
              <option value="$100 - $150">$100 - $150</option>
              <option value="$150 - $200">$150 - $200</option>
              <option value="$200+">$200+</option>
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
            {filteredAndSortedProviders.length === 0 ? (
              <div className={styles.noResults}>
                {providers.length === 0 ? 'No providers found' : 'No providers match your filters. Try adjusting your search criteria.'}
              </div>
            ) : (
              filteredAndSortedProviders.map((provider: any) => (
                <Link key={provider.id} href={`/search/${provider.id}`} className={styles.providerCardLink}>
                  <div className={styles.providerCard}>
                    <div className={styles.providerImage}>
                      <Image
                        src={provider.profile_photo_url || '/images/screenshots/Jenn.png'}
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