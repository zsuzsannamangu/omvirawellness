'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { FaCalendarAlt, FaHeart, FaRegHeart, FaSearch, FaShareAlt } from 'react-icons/fa';
import styles from '@/styles/ProviderDetail.module.scss';
import BookingOptions from '@/components/BookingOptions';
import FavoriteAuthModal from '@/components/FavoriteAuthModal';
import { isClientAuthenticated, getClientId, getFavoriteStatus, addFavorite, removeFavorite } from '@/services/favorites';
import { SERVICE_CATEGORIES } from '@/config/categories';
import { API_URL } from '@/config/api';

// Format business type string: map category IDs to display names
// Only show categories that are in the unified SERVICE_CATEGORIES list
const formatBusinessType = (businessType: string | null | undefined): string => {
  if (!businessType) return '';
  
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
    
  // If no valid categories found, return empty string
  return validCategories.length > 0 ? validCategories.join(', ') : '';
};


// Transform availability slots from database format to calendar format
// Database format: [{ date: '2024-12-20', time: '09:00', duration: 60, isRecurring: false, ... }]
// Calendar format: { '2024-12-20': ['9:00 AM', '10:00 AM'], ... }
const transformAvailability = (slots: any[]): { [key: string]: string[] } => {
  if (!slots || !Array.isArray(slots) || slots.length === 0) {
    return {};
  }

  const availability: { [key: string]: string[] } = {};
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 6); // Generate up to 6 months ahead

  // Helper to normalize date string to YYYY-MM-DD
  const normalizeDateString = (value: string): string => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Helper to convert time from HH:MM to H:MM AM/PM
  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${String(minutes).padStart(2, '0')} ${ampm}`;
  };

  // Helper to generate time slots - only return the start time (single slot)
  const generateTimeSlots = (startTime: string, duration: number): string[] => {
    // Only return the start time as a single available slot
    // Duration is just for information, not for creating multiple booking slots
    return [formatTime(startTime)];
  };

  // First, collect all blocked slots to filter them out
  const blockedSlots = new Set<string>(); // Store as "YYYY-MM-DD|HH:MM"
  slots.forEach((slot) => {
    if (slot.type === 'blocked' && slot.date && slot.time) {
      const normalizedDate = normalizeDateString(slot.date);
      const normalizedTime = String(slot.time).slice(0, 5); // Get HH:MM format
      blockedSlots.add(`${normalizedDate}|${normalizedTime}`);
    }
  });

  slots.forEach((slot) => {
    if (slot.type && slot.type !== 'available') return; // skip blocked
    if (!slot.date || !slot.time) return;

    const normalizedSlotDate = normalizeDateString(slot.date);
    const normalizedTime = String(slot.time).slice(0, 5); // Get HH:MM format

    if (!slot.isRecurring) {
      // One-time slot - check if it's blocked
      const slotKey = `${normalizedSlotDate}|${normalizedTime}`;
      if (blockedSlots.has(slotKey)) return;
      
      if (!availability[normalizedSlotDate]) {
        availability[normalizedSlotDate] = [];
      }
      const timeSlots = generateTimeSlots(slot.time, slot.duration || 60);
      availability[normalizedSlotDate].push(...timeSlots);
    } else if (slot.recurringPattern) {
      // Recurring slot
      if (slot.recurringPattern.frequency === 'weekly' && slot.recurringPattern.daysOfWeek) {
        const [slotYear, slotMonth, slotDay] = normalizedSlotDate.split('-').map(Number);
        const startDate = new Date(slotYear, slotMonth - 1, slotDay);
        
        // Check end date limit
        let endDate = maxDate;
        if (slot.recurringPattern.endDate) {
          const normalizedEndDate = normalizeDateString(slot.recurringPattern.endDate);
          const [endYear, endMonth, endDay] = normalizedEndDate.split('-').map(Number);
          const calculatedEndDate = new Date(endYear, endMonth - 1, endDay);
          if (calculatedEndDate < endDate) {
            endDate = calculatedEndDate;
          }
        }

        // Generate all dates that match the pattern
        const currentDate = new Date(startDate);
        const timeSlots = generateTimeSlots(slot.time, slot.duration || 60);

        while (currentDate <= endDate) {
          const dayOfWeek = currentDate.getDay();
          if (slot.recurringPattern.daysOfWeek.includes(dayOfWeek)) {
            const dateStr = normalizeDateString(
              `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
            );
            // Check if this specific date+time is blocked
            const slotKey = `${dateStr}|${normalizedTime}`;
            if (!blockedSlots.has(slotKey)) {
              if (!availability[dateStr]) {
                availability[dateStr] = [];
              }
              availability[dateStr].push(...timeSlots);
            }
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    }
  });

  // Remove duplicates and sort time slots for each date
  // Also remove dates that have no available slots (all blocked)
  Object.keys(availability).forEach(date => {
    availability[date] = Array.from(new Set(availability[date])).sort((a, b) => {
      // Parse time strings like "9:00 AM" or "2:30 PM"
      const parseTime = (timeStr: string): number => {
        const [timePart, period] = timeStr.split(' ');
        const [hours, minutes] = timePart.split(':').map(Number);
        let totalMinutes = hours * 60 + minutes;
        if (period === 'PM' && hours !== 12) {
          totalMinutes += 12 * 60; // Add 12 hours for PM (except 12 PM)
        } else if (period === 'AM' && hours === 12) {
          totalMinutes -= 12 * 60; // 12 AM is midnight
        }
        return totalMinutes;
      };
      return parseTime(a) - parseTime(b);
    });
    
    // Remove dates with no available time slots (all were blocked)
    if (availability[date].length === 0) {
      delete availability[date];
    }
  });

  return availability;
};

export default function ProviderDetailPage() {
  const params = useParams();
  const [provider, setProvider] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // Closed by default, opens when clicked
  // Initialize currentMonth to first day of current month to avoid timezone issues
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const visitTrackedRef = useRef(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProvider = async () => {
    if (params?.id) {
        try {
          const response = await fetch(`${API_URL}/providers/${params.id}`);
          console.log('Fetching provider with ID:', params.id);
          console.log('Response status:', response.status);
          if (response.ok) {
            const data = await response.json();
            console.log('Provider data received:', data);
            
            if (!data || !data.id) {
              console.error('Invalid provider data received:', data);
              setLoading(false);
              return;
            }
            
            // Transform API data to match the expected structure
            const mainPhoto = data.profile_photo_url || '/images/screenshots/Jenn.png';
            
            // Transform availability from database format to calendar format
            const availabilityData = transformAvailability(data.availability || []);
            
            // Parse work_location if it's a string
            const workLocation = typeof data.work_location === 'string' 
              ? JSON.parse(data.work_location) 
              : (data.work_location || []);
            
            // Parse credentials - backend should return it as an array, but handle if it's still a string
            const credentials = Array.isArray(data.credentials) 
              ? data.credentials 
              : (typeof data.credentials === 'string' 
                  ? (data.credentials.startsWith('[') ? JSON.parse(data.credentials) : data.credentials.split(',').map((s: string) => s.trim()))
                  : []);

            // Parse certifications
            let certifications = [];
            if (data.certifications) {
              if (typeof data.certifications === 'string') {
                try {
                  certifications = JSON.parse(data.certifications);
                } catch (e) {
                  certifications = [];
                }
              } else if (Array.isArray(data.certifications)) {
                certifications = data.certifications;
              }
            }

            const transformedProvider = {
              id: data.id,
              name: data.contact_name || data.business_name,
              businessName: data.business_name || null,
              image: mainPhoto,
              location: `${data.city}, ${data.state}`,
              startingPrice: data.services && data.services.length > 0 ? data.services[0].price : 0,
              services: [formatBusinessType(data.business_type)],
              rating: data.average_rating || 4.5,
              reviewCount: data.total_reviews || 0,
              bio: data.bio || '',
              specialties: data.specialties || '',
              languages: credentials || [],
              licenseNumber: data.license_number || null,
              certifications: certifications,
              photos: [mainPhoto], // Only use the actual photo if it exists
              serviceDetails: data.services || [],
              availability: availabilityData,
              workLocation: workLocation,
              travelsToClient: Array.isArray(workLocation) && workLocation.includes('at-client-location'),
              travelFee: data.travel_fee || 0,
              maxDistance: data.max_distance || null,
              travelPolicy: data.travel_policy || '',
            };
            
            setProvider(transformedProvider);
            if (transformedProvider?.serviceDetails?.length > 0) {
              setSelectedService(transformedProvider.serviceDetails[0]);
            }

            // Track profile visit (only once per page load)
            if (!visitTrackedRef.current) {
              visitTrackedRef.current = true;
              
              const trackVisit = async () => {
                try {
                  const userData = localStorage.getItem('user');
                  let visitorId = null;
                  
                  // Check if logged-in user is NOT the provider themselves
                  if (userData) {
                    const user = JSON.parse(userData);
                    if (user.id !== data.id) {
                      visitorId = user.id;
                    } else {
                      // Provider viewing their own profile, don't track
                      return;
                    }
                  }
                  
                  await fetch(`${API_URL}/providers/${params.id}/visit`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ visitorId })
                  });
                } catch (error) {
                  // Silently fail - tracking shouldn't break the page
                }
              };
              trackVisit();
            }

            // Check if this is the logged-in provider viewing their own profile
            try {
              const userData = localStorage.getItem('user');
              if (userData) {
                const user = JSON.parse(userData);
                if (user.user_type === 'provider' && user.id === data.id) {
                  setIsOwnProfile(true);
                }
              }
            } catch (e) {
              console.error('Error checking own profile:', e);
            }

            // Fetch reviews separately
            try {
              const reviewsResponse = await fetch(`${API_URL}/reviews/provider/${data.id}`);
              if (reviewsResponse.ok) {
                const reviewsData = await reviewsResponse.json();
                // Transform reviews to match expected format
                const transformedReviews = Array.isArray(reviewsData) ? reviewsData.map((review: any) => ({
                  id: review.id,
                  rating: review.rating,
                  comment: review.comment || '',
                  title: review.title || '',
                  name: review.reviewer_first_name && review.reviewer_last_name
                    ? `${review.reviewer_first_name} ${review.reviewer_last_name}`
                    : review.reviewer_email?.split('@')[0] || 'Anonymous',
                  date: new Date(review.created_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  }),
                  recommends: true // Default to true since recommends column doesn't exist in DB yet
                })) : [];
                setReviews(transformedReviews);
              }
            } catch (reviewError) {
              console.error('Error fetching reviews:', reviewError);
              setReviews([]);
            }
          } else {
            const errorText = await response.text();
            console.error('Provider not found or API error:', response.status, errorText);
            setLoading(false);
            // Don't fall back to sample data - show error or empty state
            return;
          }
        } catch (error) {
          console.error('Error fetching provider:', error);
          setLoading(false);
          // Don't fall back to sample data - show error or empty state
          return;
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchProvider();
  }, [params?.id]);

  // Set dashboard URL on mount
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (userData && token) {
        const user = JSON.parse(userData);
        if (user.user_type === 'client') {
          setDashboardUrl(`/dashboard/${user.id}`);
          setIsClient(true);
        } else if (user.user_type === 'provider') {
          setDashboardUrl(`/providers/dashboard/${user.id}`);
          setIsClient(false);
        } else {
          setIsClient(false);
        }
      } else {
        setDashboardUrl(null);
        setIsClient(false);
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
      setDashboardUrl(null);
      setIsClient(false);
    }
  }, []);

  // Check authentication and load favorite status
  useEffect(() => {
    const checkAuthAndFavorite = async () => {
      const authenticated = isClientAuthenticated();
      setIsAuthenticated(authenticated);

      if (!authenticated || !provider?.id) {
        return;
      }

      try {
        const clientId = getClientId();
        if (!clientId) return;

        const favoriteStatus = await getFavoriteStatus(clientId, [provider.id]);
        setIsFavorited(!!favoriteStatus[provider.id]);
      } catch (error) {
        console.error('Error loading favorite status:', error);
      }
    };

    checkAuthAndFavorite();
  }, [provider]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const calendarWidget = document.querySelector(`.${styles.calendarWidget}`);
      const dateInput = document.querySelector(`.${styles.dateInput}`);
      const calendarButton = document.querySelector(`.${styles.calendarButton}`);

      if (
        isCalendarOpen &&
        calendarWidget &&
        !calendarWidget.contains(target) &&
        !dateInput?.contains(target) &&
        !calendarButton?.contains(target)
      ) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className={styles.loading}>
        <div>Provider not found. Please check the URL or try again later.</div>
      </div>
    );
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % provider.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + provider.photos.length) % provider.photos.length);
  };

  const reviewsPerPage = 4;
  const totalReviewPages = Math.ceil(reviews.length / reviewsPerPage) || 1;
  const currentReviews = reviews.slice(
    (currentReviewPage - 1) * reviewsPerPage,
    currentReviewPage * reviewsPerPage
  );

  const goToReviewPage = (page: number) => {
    setCurrentReviewPage(page);
  };

  const nextReviewPage = () => {
    if (currentReviewPage < totalReviewPages) {
      setCurrentReviewPage(currentReviewPage + 1);
    }
  };

  const prevReviewPage = () => {
    if (currentReviewPage > 1) {
      setCurrentReviewPage(currentReviewPage - 1);
    }
  };

  const formatDate = (dateString: string) => {
    // Parse date string (YYYY-MM-DD) as local date to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !provider?.availability) return [];
    return provider.availability[selectedDate] || [];
  };

  const handleDateChange = (dateString: string) => {
    setSelectedDate(dateString);
    setSelectedSlot(''); // Reset selected time when date changes
  };

  const getAvailableDates = () => {
    if (!provider?.availability) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Filter out past dates
    return Object.keys(provider.availability)
      .filter(dateString => {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        date.setHours(0, 0, 0, 0);
        return date >= today;
      })
      .sort();
  };


  const formatDateForDisplay = (dateString: string) => {
    // Parse date string (YYYY-MM-DD) as local date to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        today.setDate(1); // Set to first day of month for comparison
        
        const prevMonth = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
        prevMonth.setHours(0, 0, 0, 0);
        
        // Don't allow navigation to past months (months before current month)
        if (prevMonth < today) {
          return prev; // Stay on current month
        }
        newMonth.setMonth(prev.getMonth() - 1);
        newMonth.setDate(1); // Ensure we're on the first day
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
        newMonth.setDate(1); // Ensure we're on the first day
      }
      return newMonth;
    });
  };

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Create first day of month using local date constructor (year, month, day)
    const firstDay = new Date(year, month, 1);
    
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = firstDay.getDay();
    
    // Calculate how many days to go back to get to Sunday
    // If first day is Thursday (day 4), we go back 4 days to get to Sunday
    const daysToGoBack = dayOfWeek;
    
    // Start from the first day and go back to Sunday
    const startDate = new Date(year, month, 1);
    startDate.setDate(1 - daysToGoBack);

    const days = [];

    // Generate 42 days (6 weeks) starting from the calculated start date
    for (let i = 0; i < 42; i++) {
      // Create a new date for each day, incrementing from start date
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }

    return days;
  };

  const isDateInCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth() && 
           date.getFullYear() === currentMonth.getFullYear();
  };

  // Helper to format date as YYYY-MM-DD in local timezone
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if a date is in the past (before today)
  const isDateInPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0); // Reset time to start of day
    return compareDate < today;
  };

  const isDateAvailable = (date: Date) => {
    // Don't allow past dates
    if (isDateInPast(date)) {
      return false;
    }
    const dateString = formatDateString(date);
    return provider?.availability && provider.availability[dateString];
  };

  const isDateSelected = (date: Date) => {
    const dateString = formatDateString(date);
    return selectedDate === dateString;
  };

  const handleDateSelect = (date: Date) => {
    const dateString = formatDateString(date);
    if (isDateAvailable(date)) {
      setSelectedDate(dateString);
      setSelectedSlot('');
      setIsCalendarOpen(false);
    }
  };

  const formatSelectedDate = (dateString: string) => {
    // Parse date string (YYYY-MM-DD) as local date to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleFavorite = async () => {
    if (!provider) return;
    
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
      if (isFavorited) {
        // Remove from favorites
        await removeFavorite(clientId, provider.id);
        setIsFavorited(false);
      } else {
        // Add to favorites
        await addFavorite(clientId, provider.id);
        setIsFavorited(true);
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      if (error.message === 'Not authenticated') {
        setShowAuthModal(true);
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/search');
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  const handleShare = async () => {
    const currentUrl = window.location.href;
    
    // Try Web Share API first (mobile-friendly)
    if (navigator.share) {
      try {
        await navigator.share({
          title: provider?.name || 'Provider Profile',
          text: `Check out ${provider?.name || 'this provider'} on Omvira Wellness`,
          url: currentUrl,
        });
        return;
      } catch (error: any) {
        // User cancelled or error occurred, fall back to clipboard
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        } else {
          // User cancelled, don't proceed to clipboard
          return;
        }
      }
    }
    
    // Fallback: Copy to clipboard using modern API
    try {
      // Check if clipboard API is available and we're in a secure context
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentUrl);
        alert('Link copied to clipboard!');
        return;
      }
    } catch (error: any) {
      console.error('Failed to copy link with clipboard API:', error);
      // Fall through to legacy method
    }
    
    // Legacy fallback: Use execCommand for older browsers or when clipboard API fails
    try {
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      
      // Safely remove the textarea
      try {
        if (textArea) {
          const parent = textArea.parentNode;
          if (parent) {
            parent.removeChild(textArea);
          } else {
            // If no parent, try remove() method as fallback
            textArea.remove();
          }
        }
      } catch (error) {
        // Silently fail if element was already removed
        // Try remove() as final fallback
        try {
          if (textArea && textArea.remove) {
            textArea.remove();
          }
        } catch (e) {
          // Element already removed or doesn't exist
        }
      }
      
      if (successful) {
        alert('Link copied to clipboard!');
      } else {
        throw new Error('execCommand failed');
      }
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Last resort: show the URL in a prompt
      prompt('Copy this link:', currentUrl);
    }
  };

  return (
    <div className={styles.providerDetailPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            Omvira Wellness
          </Link>
          
          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <div className={styles.searchInputContainer}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search for a provider"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className={styles.searchInput}
              />
            </div>
          </form>

          <div className={styles.headerRight}>
            {dashboardUrl ? (
              <Link href={dashboardUrl} className={styles.backButton}>
                ← Back to Dashboard
              </Link>
            ) : (
              <Link href="/search" className={styles.backButton}>
                ← Back to Search
              </Link>
            )}
            <button 
              className={styles.shareButton} 
              onClick={handleShare}
              aria-label="Share"
              title="Share"
            >
              <FaShareAlt />
              <span className={styles.shareButtonText}>Share</span>
            </button>
          </div>
        </div>
      </header>

      <div className={styles.mainContent}>
        {/* Photo Gallery */}
        <div className={styles.photoSection}>
          <div className={styles.photoGallery}>
            {provider.photos.length > 1 && (
            <button className={styles.photoNav} onClick={prevPhoto}>
              ‹
            </button>
            )}
            <Image
              src={provider.photos[currentPhotoIndex]}
              alt={provider.name}
              width={800}
              height={450}
              className={styles.mainPhoto}
            />
            {provider.photos.length > 1 && (
            <button className={styles.photoNav} onClick={nextPhoto}>
              ›
            </button>
            )}
          </div>
          {provider.photos.length > 1 && (
          <div className={styles.photoThumbnails}>
            {provider.photos.map((photo: string, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentPhotoIndex(index)}
                className={`${styles.thumbnail} ${index === currentPhotoIndex ? styles.active : ''}`}
              >
                <Image
                  src={photo}
                  alt={`${provider.name} photo ${index + 1}`}
                  width={80}
                  height={60}
                  className={styles.thumbnailImage}
                />
              </button>
            ))}
          </div>
          )}
        </div>
        <div className={styles.providerMainSection}>
          <div className={styles.providerNameRow}>
            <h1 className={styles.providerName}>{provider.name}</h1>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {isOwnProfile && (
                <Link 
                  href={`/providers/dashboard/${provider.id}?section=profile`}
                  className={styles.editProfileButton}
                >
                  Edit Profile
                </Link>
              )}
              {isAuthenticated && !isOwnProfile && (
                <button
                  className={`${styles.favoriteButton} ${isFavorited ? styles.favorited : ''}`}
                  onClick={toggleFavorite}
                  title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isFavorited ? <FaHeart /> : <FaRegHeart />}
                </button>
              )}
            </div>
          </div>
          <div className={styles.rating}>
            <span className={styles.stars}>★★★★★</span>
            <span className={styles.ratingText}>{provider.rating} ({provider.reviewCount} reviews)</span>
          </div>
          <p className={styles.providerTitle}>{provider.services.join(' • ')}</p>
          <p className={styles.providerLocation}>{provider.location}</p>
        </div>

        {/* Provider Info */}
        <div className={styles.providerInfo}>
          {/* Business Name */}
          {provider.businessName && (
            <div className={styles.bioSection}>
              <h2>Business Name</h2>
              <p className={styles.bio}>{provider.businessName}</p>
            </div>
          )}

          {/* Bio */}
          {provider.bio && (
          <div className={styles.bioSection}>
            <h2>About {provider.name}</h2>
            <p className={styles.bio}>{provider.bio}</p>
          </div>
          )}

          {/* Specialties */}
          {provider.specialties && (
            <div className={styles.bioSection}>
              <h2>Specialties</h2>
              <p className={styles.bio}>{provider.specialties}</p>
            </div>
          )}

          {/* Travel Information */}
          {provider.travelsToClient && (
            <div className={styles.bioSection}>
              <h2>Travel Services</h2>
              <p className={styles.bio}>
                {provider.travelFee > 0 
                  ? `Travel fee: $${provider.travelFee}` 
                  : 'Free travel'}
                {provider.maxDistance && ` • Up to ${provider.maxDistance} miles`}
                {provider.travelPolicy && (
                  <>
                    <br />
                    <br />
                    <strong>Travel Policy:</strong> {provider.travelPolicy}
                  </>
                )}
              </p>
            </div>
          )}

          {/* Languages Spoken */}
          {provider.languages && provider.languages.length > 0 && (
            <div className={styles.bioSection}>
              <h2>Languages Spoken</h2>
              <p className={styles.bio}>{provider.languages.join(', ')}</p>
                    </div>
          )}

          {/* Certifications */}
          {provider.certifications && provider.certifications.length > 0 && (
            <div className={styles.bioSection}>
              <h2>Certifications</h2>
              {provider.certifications.map((cert: any, index: number) => {
                const formatDate = (dateString: string) => {
                  if (!dateString) return null;
                  const date = new Date(dateString);
                  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                };
                
                return (
                  <div key={index} style={{ marginBottom: '16px' }}>
                    <p className={styles.bio} style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {cert.name}
                    </p>
                    <p className={styles.bio} style={{ color: '#666', marginBottom: '4px' }}>
                      {cert.issuer}
                    </p>
                    {(cert.issueDate || cert.expirationDate) && (
                      <p className={styles.bio} style={{ color: '#666', fontSize: '0.9rem', marginBottom: '4px' }}>
                        {cert.issueDate && `Issued: ${formatDate(cert.issueDate)}`}
                        {cert.issueDate && cert.expirationDate && ' • '}
                        {cert.expirationDate && `Expires: ${formatDate(cert.expirationDate)}`}
                        {cert.issueDate && !cert.expirationDate && ' • No expiration'}
                      </p>
                    )}
                    {cert.licenseNumber && (
                      <p className={styles.bio} style={{ color: '#666', fontSize: '0.9rem', fontStyle: 'italic' }}>
                        License Number: {cert.licenseNumber}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Book with [Provider Name] Section */}
          <div className={styles.bookSection}>
            <h2 className={styles.bookSectionTitle}>Book with {provider.name}</h2>

          {/* Services */}
          <div className={styles.servicesSection}>
              <h2>Select Service</h2>
            <div className={styles.servicesList}>
              {provider.serviceDetails.map((service: any, index: number) => (
                <div
                  key={index}
                  onClick={() => setSelectedService(service)}
                  className={`${styles.serviceItem} ${selectedService?.name === service.name ? styles.selected : ''}`}
                >
                  <div className={styles.serviceInfo}>
                    <h3>{service.name}</h3>
                    <p className={styles.serviceDescription}>{service.description}</p>
                    <div className={styles.serviceMeta}>
                        <span className={styles.duration}>{service.duration} minutes</span>
                      <span className={styles.price}>${service.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className={styles.availabilitySection}>
              <h2>Select Date and Time</h2>

            {/* Date Selection */}
            <div className={styles.dateSelection}>
              <label className={styles.dateLabel}>Date</label>
              <div className={styles.dateInputContainer}>
                <input
                  type="text"
                  value={selectedDate ? formatSelectedDate(selectedDate) : ''}
                  onClick={toggleCalendar}
                  readOnly
                  className={styles.dateInput}
                  placeholder="Select a date"
                />
                <button
                  className={styles.calendarButton}
                  onClick={toggleCalendar}
                >
                  <FaCalendarAlt />
                </button>
              </div>

              {/* Calendar Widget */}
              {isCalendarOpen && (
                <div className={styles.calendarWidget}>
                  <div className={styles.calendarHeader}>
                    <button
                      className={styles.calendarNavButton}
                      onClick={() => navigateMonth('prev')}
                      disabled={(() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        today.setDate(1); // Set to first day of month for comparison
                        
                        const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
                        prevMonth.setHours(0, 0, 0, 0);
                        
                        // Disable if previous month is before current month
                        return prevMonth < today;
                      })()}
                    >
                      ‹
                    </button>
                    <h3 className={styles.calendarMonth}>
                      {currentMonth.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </h3>
                    <button
                      className={styles.calendarNavButton}
                      onClick={() => navigateMonth('next')}
                    >
                      ›
                    </button>
                  </div>

                  <div className={styles.calendarLegend}>
                    <div className={styles.legendItem}>
                      <div className={styles.legendDot} style={{ backgroundColor: '#10b981' }}></div>
                      <span>Available</span>
                    </div>
                    <div className={styles.legendItem}>
                      <div className={styles.legendDot} style={{ backgroundColor: '#9ca3af' }}></div>
                      <span>Unavailable</span>
                    </div>
                  </div>

                  <div className={styles.calendarGrid}>
                    <div className={styles.calendarWeekdays}>
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className={styles.weekday}>{day}</div>
                      ))}
                    </div>
                    <div className={styles.calendarDays}>
                      {getCalendarDays().map((date, index) => {
                        const isPast = isDateInPast(date);
                        const isAvailable = isDateAvailable(date);
                        const isSelected = isDateSelected(date);
                        const isCurrentMonth = isDateInCurrentMonth(date);
                        
                        // For past dates from other months, render empty div to maintain grid alignment
                        if (!isCurrentMonth && isPast) {
                          return <div key={`empty-${index}`} className={styles.calendarDay} style={{ visibility: 'hidden' }}></div>;
                        }
                        
                        return (
                          <button
                            key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                            onClick={() => handleDateSelect(date)}
                            className={`${styles.calendarDay} ${!isCurrentMonth ? styles.otherMonth : ''
                              } ${isAvailable ? styles.available : styles.unavailable
                              } ${isSelected ? styles.selected : ''
                              } ${isPast ? styles.pastDate : ''
                              }`}
                            disabled={!isAvailable || isPast}
                          >
                            {date.getDate()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className={styles.timeSelection}>
                <div className={styles.timeHeader}>
                  <h3>Time (PDT)</h3>
                </div>
                <div className={styles.timeSlotsGrid}>
                  {getAvailableTimeSlots().map((slot: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSlot(slot)}
                      className={`${styles.timeSlot} ${selectedSlot === slot ? styles.selected : ''}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
            </div>
          </div>

          {/* Reviews */}
          <div className={styles.reviewsSection}>
            <h2>Reviews</h2>

            {/* Overall Rating Summary */}
            <div className={styles.overallRating}>
              <div className={styles.ratingSummary}>
                <div className={styles.ratingDisplay}>
                  <span className={styles.starIcon}>★</span>
                  <span className={styles.ratingNumber}>{provider.rating}</span>
                  <span className={styles.ratingOutOf}>out of 5</span>
                  <span className={styles.reviewCount}>({provider.reviewCount} reviews)</span>
                </div>
                <p className={styles.verifiedText}>All reviews are from verified clients</p>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className={styles.reviewsList}>
              {currentReviews.map((review: any) => (
                <div key={review.id} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewRating}>
                      <div className={styles.stars}>
                        {'★'.repeat(review.rating)}
                      </div>
                      <span className={styles.ratingNumber}>{review.rating}</span>
                      <span className={styles.itemTag}>This service</span>
                      {review.recommends && (
                        <div className={styles.recommends}>
                          <span className={styles.checkmark}>✓</span>
                          <span>Recommends</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.reviewerInfo}>
                      <span className={styles.reviewerName}>{review.name}</span>
                      <span className={styles.reviewSeparator}>|</span>
                      <span className={styles.reviewDate}>{review.date}</span>
                    </div>
                  </div>
                  {review.comment && (
                    <p className={styles.reviewComment}>{review.comment}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalReviewPages > 1 && (
              <div className={styles.reviewPagination}>
                <button
                  className={styles.paginationButton}
                  onClick={prevReviewPage}
                  disabled={currentReviewPage === 1}
                >
                  ‹
                </button>
                {Array.from({ length: totalReviewPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`${styles.paginationPage} ${currentReviewPage === page ? styles.active : ''}`}
                    onClick={() => goToReviewPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className={styles.paginationButton}
                  onClick={nextReviewPage}
                  disabled={currentReviewPage === totalReviewPages}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className={styles.bookingSidebar}>
          <div className={styles.bookingCard}>
            <div className={styles.priceInfo}>
              <span className={styles.priceLabel}>From</span>
              <span className={styles.priceAmount}>${selectedService?.price || provider.startingPrice}</span>
            </div>

            {selectedService && (
              <div className={styles.selectedService}>
                <h3>{selectedService.name}</h3>
                <p>{(() => {
                  const d = selectedService?.duration;
                  if (d == null) return '';
                  if (typeof d === 'number') return `${d} minutes`;
                  const s = String(d);
                  return /min|hour/i.test(s) ? s : `${s} minutes`;
                })()}</p>
              </div>
            )}

            {selectedDate && selectedSlot && (
              <div className={styles.selectedTime}>
                <h4>Selected Appointment</h4>
                <p className={styles.selectedDate}>{formatDate(selectedDate)}</p>
                <p className={styles.selectedTimeSlot}>{selectedSlot}</p>
              </div>
            )}

            <BookingOptions
              isAuthenticated={isAuthenticated}
              canBook={selectedService && selectedDate && selectedSlot}
              bookingUrl={`/search/${params?.id}/book?service=${selectedService?.name}&date=${selectedDate}&time=${selectedSlot}`}
              serviceName={selectedService?.name}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
            />

            <div className={styles.bookingInfo}>
              <p>• Free cancellation up to 24 hours before</p>
              <p>• Secure payment processing</p>
              <p>• Confirmation sent via email</p>
            </div>
          </div>
        </div>
      </div>

      <FavoriteAuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}