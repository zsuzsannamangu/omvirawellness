'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import styles from '@/styles/Search.module.scss';
import FavoriteAuthModal from '@/components/FavoriteAuthModal';
import { isClientAuthenticated, getClientId, getFavoriteStatus, addFavorite, removeFavorite } from '@/services/favorites';
import { API_URL } from '@/config/api';

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
  const [areaFilter, setAreaFilter] = useState('');
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
        const response = await fetch(`${API_URL}/providers`);
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
      const areaParam = urlParams.get('area');
      const dateParam = urlParams.get('date');
      const timeParam = urlParams.get('time');

      if (queryParam) {
        setSearchQuery(queryParam);
      }

      if (areaParam) {
        setAreaFilter(areaParam);
      }

      if (serviceParam) {
        setSelectedCategories([serviceParam]);
        setSelectedService(serviceParam);
      }

      if (dateParam || timeParam) {
        try {
          sessionStorage.setItem(
            'omvira_search_intent',
            JSON.stringify({ date: dateParam || null, time: timeParam || null })
          );
        } catch {
          /* ignore */
        }
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
    setAreaFilter('');
    setSelectedService('');
    setSelectedLocation('');
    setSelectedPriceRange('');
    setSortBy('Most Relevant');
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.delete('area');
      const qs = params.toString();
      window.history.replaceState(null, '', qs ? `${window.location.pathname}?${qs}` : window.location.pathname);
    }
  };

  // Helper function to extract word stems (simple stemming)
  const getWordStem = (word: string): string => {
    const lower = word.toLowerCase();
    // Remove common suffixes
    if (lower.endsWith('ist') || lower.endsWith('ists')) {
      return lower.replace(/ists?$/, '');
    }
    if (lower.endsWith('er') || lower.endsWith('ers')) {
      return lower.replace(/ers?$/, '');
    }
    if (lower.endsWith('ing')) {
      return lower.replace(/ing$/, '');
    }
    if (lower.endsWith('ed')) {
      return lower.replace(/ed$/, '');
    }
    if (lower.endsWith('s') && lower.length > 3) {
      return lower.slice(0, -1);
    }
    return lower;
  };

  // Helper function to check if two words match (handles variations)
  const wordsMatch = (word1: string, word2: string): boolean => {
    const w1 = word1.toLowerCase();
    const w2 = word2.toLowerCase();
    
    // Exact match
    if (w1 === w2) return true;
    
    // One contains the other
    if (w1.includes(w2) || w2.includes(w1)) return true;
    
    // Stem matching
    const stem1 = getWordStem(w1);
    const stem2 = getWordStem(w2);
    if (stem1 === stem2) return true;
    if (stem1.includes(stem2) || stem2.includes(stem1)) return true;
    
    // Check if stems share a common root (at least 4 characters)
    const minLength = Math.min(stem1.length, stem2.length);
    if (minLength >= 4) {
      for (let i = 4; i <= minLength; i++) {
        if (stem1.substring(0, i) === stem2.substring(0, i)) {
          return true;
        }
      }
    }
    
    return false;
  };

  // Helper function to check if search query matches a category
  const matchesCategory = (query: string, businessType: string | null | undefined): boolean => {
    if (!businessType) return false;
    
    const queryLower = query.toLowerCase().trim();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
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
        // Get all possible keywords from the category
        const categoryName = category.name.toLowerCase();
        const categoryDisplay = category.displayName.toLowerCase();
        const categoryId = category.id.toLowerCase();
        
        // Split category into words
        const categoryWords = [
          ...categoryName.split(/\s+/),
          ...categoryDisplay.split(/\s+/),
          ...categoryId.replace(/-/g, ' ').split(/\s+/)
        ].filter(w => w.length > 2);
        
        // Check if any query word matches any category word (with variations)
        for (const queryWord of queryWords) {
          for (const categoryWord of categoryWords) {
            if (wordsMatch(queryWord, categoryWord)) {
              return true;
            }
          }
          
          // Also check if query word is contained in full category strings
          if (categoryName.includes(queryWord) || 
              categoryDisplay.includes(queryWord) ||
              queryWord.includes(categoryName) ||
              queryWord.includes(categoryDisplay)) {
            return true;
          }
        }
        
        // Check full string matches (backward compatibility)
        if (categoryName.includes(queryLower) || 
            categoryDisplay.includes(queryLower) ||
            queryLower.includes(categoryName) ||
            queryLower.includes(categoryDisplay)) {
          return true;
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
    
    // Category matches (high priority) - uses flexible word matching
    if (matchesCategory(query, provider.business_type)) {
      score += 80;
      // Boost if exact category match
      const formattedType = formatBusinessType(provider.business_type).toLowerCase();
      if (formattedType.includes(queryLower)) score += 30;
      
      // Additional boost for word-level matches in category
      const categoryWords = formattedType.split(/\s+/);
      for (const queryWord of queryWords) {
        for (const catWord of categoryWords) {
          if (wordsMatch(queryWord, catWord)) {
            score += 15; // Boost for word variation matches
          }
        }
      }
    }
    
    // Bio and specialties matches (medium priority) - with word variation support
    const bio = (provider.bio || '').toLowerCase();
    const specialties = (provider.specialties || '').toLowerCase();
    if (bio.includes(queryLower)) score += 40;
    if (specialties.includes(queryLower)) score += 35;
    
    const bioWords = bio.split(/\s+/);
    const specialtiesWords = specialties.split(/\s+/);
    for (const word of queryWords) {
      // Exact matches
      if (bio.includes(word)) score += 5;
      if (specialties.includes(word)) score += 4;
      
      // Word variation matches
      for (const bioWord of bioWords) {
        if (wordsMatch(word, bioWord)) score += 3;
      }
      for (const specWord of specialtiesWords) {
        if (wordsMatch(word, specWord)) score += 3;
      }
    }
    
    // Service name matches (medium priority) - with word variation support
    if (provider.services && Array.isArray(provider.services)) {
      for (const service of provider.services) {
        const serviceName = (service.name || '').toLowerCase();
        if (serviceName.includes(queryLower)) score += 30;
        
        const serviceWords = serviceName.split(/\s+/);
        for (const word of queryWords) {
          // Exact matches
          if (serviceName.includes(word)) score += 3;
          // Word variation matches
          for (const serviceWord of serviceWords) {
            if (wordsMatch(word, serviceWord)) score += 2;
          }
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

    // City / region / ZIP from homepage
    if (areaFilter && areaFilter.trim()) {
      const raw = areaFilter.trim().toLowerCase();
      const tokens = raw.split(/[,\s]+/).filter((t) => t.length >= 2);
      filtered = filtered.filter((provider) => {
        const city = (provider.city || '').toLowerCase();
        const state = (provider.state || '').toLowerCase();
        const zip = String(
          (provider as { zip_code?: string; zipCode?: string }).zip_code ||
            (provider as { zipCode?: string }).zipCode ||
            ''
        ).toLowerCase();
        if (city.includes(raw) || state.includes(raw) || zip.includes(raw)) {
          return true;
        }
        return tokens.some(
          (t) => city.includes(t) || state.includes(t) || zip.includes(t)
        );
      });
    }

    // Apply service filter FIRST (if selected)
    // This way, when user filters by category and then searches, we search within that category
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

    // THEN apply search query filter (searches within the already-filtered results)
    // Enhanced keyword-based search filter with word variation support
    // When a service filter is selected, search is used for sorting/prioritizing, not filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const queryWords = query.split(/\s+/).filter(w => w.length > 0);
      const hasServiceFilter = selectedService && selectedService !== 'Service';
      
      // If a service filter is active, don't filter by search - just use it for sorting
      // This way, filtering by "Reflexology" and searching "therapist" shows all Reflexology providers
      // but prioritizes those that mention "therapist" or "therapy" in their bio/specialties
      if (!hasServiceFilter) {
        // No filter - apply strict search matching
        filtered = filtered.filter(provider => {
        const nameMatch = (provider.contact_name || '').toLowerCase();
        const businessNameMatch = (provider.business_name || '').toLowerCase();
        const bio = (provider.bio || '').toLowerCase();
        const specialties = (provider.specialties || '').toLowerCase();
        const city = (provider.city || '').toLowerCase();
        const state = (provider.state || '').toLowerCase();
        
        // Check name matches (exact or partial)
        if (nameMatch.includes(query) || businessNameMatch.includes(query)) {
          return true;
        }
        
        // Check category matches (keyword-based with variations)
        if (matchesCategory(query, provider.business_type)) {
          return true;
        }
        
        // Check bio and specialties with word matching
        for (const queryWord of queryWords) {
          if (queryWord.length < 2) continue;
          const bioWords = bio.split(/\s+/);
          const specialtiesWords = specialties.split(/\s+/);
          
          for (const bioWord of bioWords) {
            if (wordsMatch(queryWord, bioWord)) return true;
          }
          for (const specWord of specialtiesWords) {
            if (wordsMatch(queryWord, specWord)) return true;
          }
        }
        
        // Also check full string matches in bio/specialties
        if (bio.includes(query) || specialties.includes(query)) {
          return true;
        }
        
        // Check service names with word matching
        if (provider.services && Array.isArray(provider.services)) {
          for (const service of provider.services) {
            const serviceName = (service.name || '').toLowerCase();
            if (serviceName.includes(query)) {
              return true;
            }
            
            // Word-by-word matching for service names
            const serviceWords = serviceName.split(/\s+/);
            for (const queryWord of queryWords) {
              if (queryWord.length < 2) continue;
              for (const serviceWord of serviceWords) {
                if (wordsMatch(queryWord, serviceWord)) return true;
              }
            }
          }
        }
        
        // Check location
        if (city.includes(query) || state.includes(query)) {
          return true;
        }
        
        // Word-by-word matching for multi-word queries (more flexible)
        if (queryWords.length > 1) {
          let matchingWords = 0;
          for (const word of queryWords) {
            if (word.length < 2) continue; // Skip very short words
            
            const wordMatches = 
              nameMatch.includes(word) ||
              businessNameMatch.includes(word) ||
              bio.includes(word) ||
              specialties.includes(word) ||
              city.includes(word) ||
              state.includes(word) ||
              matchesCategory(word, provider.business_type) ||
              // Check word variations in bio/specialties
              bio.split(/\s+/).some(bw => wordsMatch(word, bw)) ||
              specialties.split(/\s+/).some(sw => wordsMatch(word, sw));
            
            if (wordMatches) {
              matchingWords++;
            }
          }
          // Match if at least half the words match (more forgiving)
          if (matchingWords >= Math.ceil(queryWords.length / 2)) {
            return true;
          }
        }
        
        return false;
        });
      }
      
      // Always sort by relevance score when there's a search query
      // This ensures best matches appear first
      // When a filter is active, all filtered providers are shown but sorted by search relevance
      filtered.sort((a, b) => {
        const scoreA = calculateRelevanceScore(a, searchQuery);
        const scoreB = calculateRelevanceScore(b, searchQuery);
        return scoreB - scoreA; // Higher score first
      });
    }


    // Location filter
    if (selectedLocation && selectedLocation !== 'Location') {
      filtered = filtered.filter(provider => {
        if (!provider.work_location || !Array.isArray(provider.work_location)) return false;
        
        if (selectedLocation === 'Comes to Me') {
          return provider.work_location.includes('at-client-location');
        } else if (selectedLocation === "Provider's Studio") {
          return provider.work_location.includes('at-my-place');
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
      // Most Relevant (default)
      if (searchQuery.trim()) {
        // Use relevance score when there's a search query
        const scoreA = calculateRelevanceScore(a, searchQuery);
        const scoreB = calculateRelevanceScore(b, searchQuery);
        if (scoreB !== scoreA) {
          return scoreB - scoreA; // Higher score first
        }
        // If scores are equal, fall back to rating * reviews
        return ((b.average_rating || 0) * (b.total_reviews || 0)) - ((a.average_rating || 0) * (a.total_reviews || 0));
      } else {
        // No search query - use rating + reviews
        return ((b.average_rating || 0) * (b.total_reviews || 0)) - ((a.average_rating || 0) * (a.total_reviews || 0));
      }
    });

    return sorted;
  }, [providers, searchQuery, areaFilter, selectedService, selectedLocation, selectedPriceRange, sortBy]);

  return (
    <>
      <div className={styles.searchPage}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <Link href="/" className={styles.logo} aria-label="Omvira Wellness Home">
              Omvira Wellness
            </Link>
            
            <div className={styles.searchBar} role="search" aria-label="Search for providers">
              <label htmlFor="provider-search" className="visually-hidden">
                Search for a provider
              </label>
              <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input
                id="provider-search"
                type="search"
                placeholder="Search for a provider"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Search for a provider"
                role="searchbox"
              />
            </div>

            <div className={styles.headerActions}>
              {dashboardUrl && (
                <Link href={dashboardUrl} className={styles.dashboardLink} aria-label="Back to Dashboard">
                  <span className={styles.dashboardArrow} aria-hidden="true">←</span>
                  Back to Dashboard
                </Link>
              )}
              <button 
                ref={buttonRef}
                className={styles.menuButton}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
                aria-controls="side-menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

      {/* Side Menu */}
      {isMenuOpen && (
        <nav 
          id="side-menu"
          ref={menuRef} 
          className={styles.sideMenu}
          role="navigation"
          aria-label="Main navigation"
        >
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
        </nav>
      )}

      <main id="main-content" className={styles.mainContent}>
        {/* Filter Bar */}
        <aside className={styles.filterBar} role="complementary" aria-label="Search filters">
          <button 
            className={styles.resetButton}
            onClick={handleResetFilters}
            aria-label="Reset all search filters"
          >
            RESET FILTERS
          </button>
          
          <div className={styles.filterDropdowns} role="group" aria-label="Filter options">
            <label htmlFor="service-filter" className="visually-hidden">
              Filter by service
            </label>
            <select 
              id="service-filter"
              className={styles.filterDropdown}
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              aria-label="Filter by service"
            >
              <option value="">Service</option>
              {SERVICE_CATEGORIES.map((category) => (
                <option key={category.id} value={category.displayName}>
                  {category.displayName}
                </option>
              ))}
            </select>
            
            <label htmlFor="location-filter" className="visually-hidden">
              Filter by location
            </label>
            <select 
              id="location-filter"
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
        </aside>

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
          <section id="search-results" aria-label="Search results" role="region">
            <h2 className="visually-hidden">Provider Search Results</h2>
            <div 
              className={styles.providersGrid}
              role="list"
              aria-label={`${filteredAndSortedProviders.length} provider${filteredAndSortedProviders.length !== 1 ? 's' : ''} found`}
            >
              {filteredAndSortedProviders.length === 0 ? (
                <div className={styles.noResults} role="status" aria-live="polite">
                  {providers.length === 0 ? (
                    'No providers found'
                  ) : (
                  <div>
                    <p style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
                      No providers found {searchQuery ? `for "${searchQuery}"` : ''}
                      {areaFilter ? ` near "${areaFilter}"` : ''}{' '}
                      {selectedService || selectedLocation || selectedPriceRange || areaFilter ? 'with your current filters' : ''}
                    </p>
                    <p style={{ marginBottom: '12px', color: '#666', fontSize: '16px' }}>
                      {searchQuery ? (
                        <>Try searching with different keywords like "yoga", "massage", "coaching", or browse by category below.</>
                      ) : (
                        <>Try adjusting your filters or browse by category below.</>
                      )}
                    </p>
                    
                    {(selectedService || selectedLocation || selectedPriceRange) && (
                      <p style={{ marginBottom: '16px', fontSize: '14px', color: '#999' }}>
                        <button 
                          onClick={handleResetFilters}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#4a90e2',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        >
                          Reset all filters
                        </button> to see all providers
                      </p>
                    )}
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                      <p style={{ width: '100%', marginBottom: '8px', fontSize: '14px', color: '#666', fontWeight: '600' }}>
                        Popular categories:
                      </p>
                      {SERVICE_CATEGORIES.slice(0, 8).map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedService(category.displayName);
                          }}
                          style={{
                            padding: '8px 16px',
                            background: '#f0f0f0',
                            border: '1px solid #ddd',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#e0e0e0';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#f0f0f0';
                          }}
                        >
                          {category.displayName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              filteredAndSortedProviders.map((provider: any) => (
                <article key={provider.id} role="listitem">
                  <Link href={`/search/${provider.id}`} className={styles.providerCardLink} aria-label={`View ${provider.contact_name || provider.business_name}'s profile`}>
                    <div className={styles.providerCard}>
                      <div className={styles.providerImage}>
                        <Image
                          src={provider.profile_photo_url || '/images/screenshots/Jenn.png'}
                          alt={`${provider.contact_name || provider.business_name} profile photo`}
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
                </article>
              ))
            )}
          </div>
          </section>
        )}

        <FavoriteAuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </main>
      </div>
    </>
  );
} 