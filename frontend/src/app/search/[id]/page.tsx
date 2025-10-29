'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { FaCalendarAlt, FaHeart, FaRegHeart } from 'react-icons/fa';
import styles from '@/styles/ProviderDetail.module.scss';
import BookingOptions from '@/components/BookingOptions';


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

  slots.forEach((slot) => {
    if (!slot.date || !slot.time) return;

    const normalizedSlotDate = normalizeDateString(slot.date);

    if (!slot.isRecurring) {
      // One-time slot
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
            if (!availability[dateStr]) {
              availability[dateStr] = [];
            }
            availability[dateStr].push(...timeSlots);
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    }
  });

  // Remove duplicates and sort time slots for each date
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
  const [currentMonth, setCurrentMonth] = useState(new Date()); // Current month
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
    if (params?.id) {
        try {
          const response = await fetch(`http://localhost:4000/api/providers/${params.id}`);
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
            const mainPhoto = data.profile_photo_url || '/images/default-provider.jpg';
            
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
              services: [data.business_type],
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

  // Load favorites from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFavorites = localStorage.getItem('favoriteProviders');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, []);

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
  const totalReviewPages = Math.ceil(provider?.reviews?.length / reviewsPerPage) || 1;
  const currentReviews = provider?.reviews?.slice(
    (currentReviewPage - 1) * reviewsPerPage,
    currentReviewPage * reviewsPerPage
  ) || [];

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
    return Object.keys(provider.availability).sort();
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
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const isDateInCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  // Helper to format date as YYYY-MM-DD in local timezone
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isDateAvailable = (date: Date) => {
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

  const toggleFavorite = () => {
    if (!provider) return;
    
    setFavorites(prev => {
      const newFavorites = prev.includes(provider.id) 
        ? prev.filter(id => id !== provider.id)
        : [...prev, provider.id];
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('favoriteProviders', JSON.stringify(newFavorites));
      }
      
      return newFavorites;
    });
  };

  return (
    <div className={styles.providerDetailPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/search" className={styles.backButton}>
            ← Back to Search
          </Link>
          <Link href="/" className={styles.logo}>
            Omvira Wellness
          </Link>
          <button className={styles.shareButton}>
            Share
          </button>
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
            <button
              className={`${styles.favoriteButton} ${favorites.includes(provider.id) ? styles.favorited : ''}`}
              onClick={toggleFavorite}
              title={favorites.includes(provider.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              {favorites.includes(provider.id) ? <FaHeart /> : <FaRegHeart />}
            </button>
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
              <h2>Services</h2>
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
              <h2>Availability</h2>

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
                        {getCalendarDays().map((date, index) => (
                          <button
                            key={index}
                            onClick={() => handleDateSelect(date)}
                            className={`${styles.calendarDay} ${!isDateInCurrentMonth(date) ? styles.otherMonth : ''
                              } ${isDateAvailable(date) ? styles.available : styles.unavailable
                              } ${isDateSelected(date) ? styles.selected : ''
                              }`}
                            disabled={!isDateAvailable(date)}
                          >
                            {date.getDate()}
                          </button>
                        ))}
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
                      <div className={styles.avatar}>
                        {review.name.charAt(0)}
                      </div>
                      <div className={styles.reviewerDetails}>
                        <span className={styles.reviewerName}>{review.name}</span>
                        <span className={styles.reviewDate}>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className={styles.reviewComment}>{review.comment}</p>
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
    </div>
  );
}