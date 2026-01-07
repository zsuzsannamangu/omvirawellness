'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { FaMapMarkerAlt, FaHome, FaBuilding, FaCar, FaVideo } from 'react-icons/fa';
import { API_URL } from '@/config/api';
import { getGoogleMapsApiKey, isGoogleMapsLoaded } from '@/config/googleMaps';
import Swal from 'sweetalert2';
import styles from '@/styles/BookingConfirmation.module.scss';


export default function BookingConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [provider, setProvider] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Location options
  const [locationType, setLocationType] = useState<'home' | 'studio' | 'travel' | 'online'>('studio');
  const [userAddress, setUserAddress] = useState<string>('');
  const [userCity, setUserCity] = useState<string>('');
  const [userState, setUserState] = useState<string>('');
  const [userZipCode, setUserZipCode] = useState<string>('');
  const [travelRadius, setTravelRadius] = useState<number>(10);
  const [addressValidated, setAddressValidated] = useState<boolean | null>(null);
  
  // Distance checking
  const [distanceCheck, setDistanceCheck] = useState<{
    distance: number | null;
    withinRange: boolean;
    message: string;
    checked: boolean;
  } | null>(null);
  const [isCheckingDistance, setIsCheckingDistance] = useState(false);
  
  // Add-ons
  const [selectedAddOns, setSelectedAddOns] = useState<{[key: number]: boolean}>({});
  
  // Form validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Provider modal
  const [showProviderModal, setShowProviderModal] = useState(false);

  // Ref for address section to enable scrolling
  const addressSectionRef = useRef<HTMLDivElement>(null);
  // Ref for address input to enable Google Places Autocomplete
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  // Normalize date string (YYYY-MM-DD) into local Date for display only
  const formatLocalDateLong = (dateString: string) => {
    const [y, m, d] = dateString.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Convert 12-hour time (e.g., "9:00 AM") to 24-hour format (e.g., "09:00")
  const convertTo24Hour = (time12Hour: string): string => {
    if (!time12Hour) return '';
    
    // Check if it's already in 24-hour format (HH:MM)
    if (/^\d{1,2}:\d{2}$/.test(time12Hour) && !time12Hour.includes('AM') && !time12Hour.includes('PM')) {
      const [hours, minutes] = time12Hour.split(':').map(Number);
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    
    // Parse 12-hour format (e.g., "9:00 AM" or "2:30 PM")
    const match = time12Hour.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) {
      console.error('Invalid time format:', time12Hour);
      return '';
    }
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  useEffect(() => {
    const load = async () => {
      if (!params?.id) return;

      // Get booking details from URL params
      const serviceName = searchParams.get('service');
      const date = searchParams.get('date');
      const time = searchParams.get('time');

      try {
        const resp = await fetch(`${API_URL}/providers/${params.id}`);
        if (resp.ok) {
          const data = await resp.json();
          const mainPhoto = data.profile_photo_url || '/images/screenshots/Jenn.png';
          // Parse work_location if it's a string
          const workLocation = typeof data.work_location === 'string' 
            ? JSON.parse(data.work_location) 
            : (data.work_location || []);
          
          // Transform work_location array to locationOptions object
          const locationOptions = {
            hasHomeStudio: Array.isArray(workLocation) && workLocation.includes('at-my-place'),
            travelsToClient: Array.isArray(workLocation) && workLocation.includes('at-client-location'),
            hasBookedLocation: Array.isArray(workLocation) && workLocation.includes('from-booked-studio'),
            offersOnline: Array.isArray(workLocation) && workLocation.includes('online'),
            homeStudioFee: 0, // Default, could be added to database later
            travelFee: data.travel_fee || 0,
            onlineFee: 0 // Default, could be added to database later
          };

          const providerTransformed = {
            id: data.id,
            name: data.contact_name || data.business_name,
            image: mainPhoto,
            location: [data.city, data.state].filter(Boolean).join(', ') || 'Location not specified',
            serviceDetails: data.services || [],
            rating: data.average_rating || 4.5,
            reviewCount: data.total_reviews || 0,
            bio: data.bio || '',
            locationOptions: locationOptions,
            studioAddress: data.address_line1 ? `${data.address_line1}, ${data.city}, ${data.state} ${data.zip_code || ''}`.trim() : undefined,
            maxDistance: data.max_distance || null,
            providerCity: data.city,
            providerState: data.state,
            providerZipCode: data.zip_code || null,
            requiresDeposit: false, // Default, could be added to database later
            depositAmount: 0, // Default
            addOns: typeof data.add_ons === 'string' ? JSON.parse(data.add_ons) : (data.add_ons || [])
          };
          setProvider(providerTransformed);

          // Pick service by exact name, fall back to constructing minimal service from query
          if (serviceName) {
            const svc = (providerTransformed.serviceDetails || []).find((s: any) => s.name === serviceName);
            setSelectedService(svc || { name: serviceName, price: 0, duration: '' });
          }
        } else {
          console.error('Provider not found or API error:', resp.status);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error fetching provider:', error);
        setIsLoading(false);
        return;
      } finally {
        if (date) setSelectedDate(date);
        if (time) setSelectedTime(time);
        setIsLoading(false);
      }
    };

    load();
  }, [params?.id, searchParams]);

  // Load client address from profile if logged in
  useEffect(() => {
    const loadClientAddress = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (!token || !user) return;
        
        const userData = JSON.parse(user);
        if (userData.user_type !== 'client') return;
        
        // Fetch client profile to get address
        const response = await fetch(`${API_URL}/auth/profile/client`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const profile = await response.json();
          if (profile.profile) {
            if (profile.profile.address_line1) {
              setUserAddress(profile.profile.address_line1);
            }
            if (profile.profile.city) {
              setUserCity(profile.profile.city);
            }
            if (profile.profile.state) {
              setUserState(profile.profile.state);
            }
            if (profile.profile.zip_code) {
              setUserZipCode(profile.profile.zip_code);
            }
          }
        }
      } catch (error) {
        console.error('Error loading client address:', error);
      }
    };
    
    loadClientAddress();
  }, []);

  // Load Google Maps Places API script
  useEffect(() => {
    const apiKey = getGoogleMapsApiKey();
    if (!apiKey) {
      // No API key configured - autocomplete won't work
      return;
    }

    // Check if script is already loaded
    if (isGoogleMapsLoaded()) {
      return;
    }

    // Check if script is already in the DOM
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Script exists, wait for it to load
      const checkLoaded = setInterval(() => {
        if (isGoogleMapsLoaded()) {
          clearInterval(checkLoaded);
        }
      }, 100);
      return () => clearInterval(checkLoaded);
    }

    // Load the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error('Failed to load Google Maps Places API');
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup: don't remove script as it might be used elsewhere
    };
  }, []);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    // Check if Google Maps is loaded
    const checkAndInit = () => {
      if (!isGoogleMapsLoaded() || !addressInputRef.current || locationType !== 'home') {
        // Clean up existing autocomplete
        if (autocompleteRef.current) {
          (window as any).google?.maps?.event?.clearInstanceListeners?.(autocompleteRef.current);
          autocompleteRef.current = null;
        }
        return;
      }

      // Initialize autocomplete
      const autocomplete = new (window as any).google.maps.places.Autocomplete(
        addressInputRef.current,
        {
          types: ['address'],
          componentRestrictions: { country: 'us' } // Restrict to US addresses
        }
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (!place.address_components) {
          return;
        }

        // Parse address components
        let streetNumber = '';
        let route = '';
        let city = '';
        let state = '';
        let zipCode = '';

        for (const component of place.address_components) {
          const types = component.types;
          
          if (types.includes('street_number')) {
            streetNumber = component.long_name;
          }
          if (types.includes('route')) {
            route = component.long_name;
          }
          if (types.includes('locality')) {
            city = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            state = component.short_name; // Use short name for state (e.g., "CA" instead of "California")
          }
          if (types.includes('postal_code')) {
            zipCode = component.long_name;
          }
        }

        // Set address fields
        const fullAddress = [streetNumber, route].filter(Boolean).join(' ');
        setUserAddress(fullAddress || place.formatted_address || '');
        if (city) setUserCity(city);
        if (state) setUserState(state);
        if (zipCode) setUserZipCode(zipCode);

        // Clear distance check when address changes
        setDistanceCheck(null);
        setAddressValidated(null);
      });

      autocompleteRef.current = autocomplete;
    };

    // Try to initialize
    checkAndInit();

    // If Google Maps isn't loaded yet, check periodically
    if (!isGoogleMapsLoaded()) {
      const interval = setInterval(() => {
        if (isGoogleMapsLoaded()) {
          clearInterval(interval);
          checkAndInit();
        }
      }, 500);

      return () => {
        clearInterval(interval);
        if (autocompleteRef.current) {
          (window as any).google?.maps?.event?.clearInstanceListeners?.(autocompleteRef.current);
          autocompleteRef.current = null;
        }
      };
    }

    return () => {
      if (autocompleteRef.current) {
        (window as any).google?.maps?.event?.clearInstanceListeners?.(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [locationType]);

  const handleAddOnChange = (addOnId: number) => {
    setSelectedAddOns(prev => ({
      ...prev,
      [addOnId]: !prev[addOnId]
    }));
  };

  const validateAddress = async () => {
    if (!userAddress.trim()) {
      setAddressValidated(null);
      return;
    }
    
    if (locationType === 'home') {
      // For "Come to Me" - check distance
      await checkDistance();
      if (distanceCheck && distanceCheck.withinRange) {
        setAddressValidated(true);
      } else {
        setAddressValidated(false);
      }
    } else if (locationType === 'travel') {
      // For "On Location" - just save the travel preference (always valid)
      setAddressValidated(true);
    }
  };

  // Check distance when address is entered and provider offers travel
  const checkDistance = async () => {
    if (!provider || !provider.locationOptions?.travelsToClient) return;
    if (!userAddress.trim() || !userCity.trim() || !userState.trim()) {
      setDistanceCheck({
        distance: null,
        withinRange: false,
        message: 'Please enter a complete address (street, city, and state) to check distance',
        checked: false
      });
      return;
    }
    
    // If provider doesn't have max_distance set, allow booking (assume they travel anywhere)
    if (!provider.maxDistance) {
      setDistanceCheck({
        distance: null,
        withinRange: true,
        message: 'Provider will travel to your location',
        checked: true
      });
      setAddressValidated(true);
      return;
    }

    setIsCheckingDistance(true);
    try {
      const response = await fetch(`${API_URL}/providers/${params?.id}/check-distance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientAddress: userAddress,
          clientCity: userCity,
          clientState: userState,
          clientZipCode: userZipCode
        })
      });

      if (response.ok) {
        const data = await response.json();
        setDistanceCheck({
          distance: data.distance,
          withinRange: data.withinRange,
          message: data.message,
          checked: true
        });
        
        // Show SweetAlert based on result
        if (data.withinRange) {
          Swal.fire({
            icon: 'success',
            title: 'Location Confirmed',
            text: data.distance !== null 
              ? `You are ${data.distance} miles away. The provider will travel to your location.`
              : "You are within the provider's travel range. The provider will travel to your location.",
            confirmButtonColor: '#4a90e2',
            confirmButtonText: 'Continue Booking'
          });
        } else {
          // Outside range - show warning
          Swal.fire({
            icon: 'warning',
            title: 'Outside Travel Range',
            html: `<p>${data.message}</p><p style="margin-top: 12px;">Please select a different location option or contact the provider to discuss travel arrangements.</p>`,
            confirmButtonColor: '#4a90e2',
            confirmButtonText: 'OK'
          });
          
          // If outside range, switch to a different location option
          if (locationType === 'home') {
            setLocationType('studio');
          }
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Unable to check distance. Please contact the provider directly.';
        const isAddressInvalid = errorData.addressValid === false;
        
        setDistanceCheck({
          distance: null,
          withinRange: false,
          message: errorMessage,
          checked: true
        });
        
        Swal.fire({
          icon: isAddressInvalid ? 'warning' : 'error',
          title: isAddressInvalid ? 'Invalid Address' : 'Distance Check Failed',
          text: errorMessage,
          confirmButtonColor: '#4a90e2',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error checking distance:', error);
      const errorMessage = 'Unable to check distance. Please contact the provider directly.';
      setDistanceCheck({
        distance: null,
        withinRange: false,
        message: errorMessage,
        checked: true
      });
      
      Swal.fire({
        icon: 'error',
        title: 'Distance Check Failed',
        text: errorMessage,
        confirmButtonColor: '#4a90e2',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsCheckingDistance(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAddress(e.target.value);
    // Clear validation when user starts typing again
    setAddressValidated(null);
    // Clear distance check when address changes
    setDistanceCheck(null);
  };

  const handleLocationChange = (type: 'home' | 'studio' | 'travel' | 'online') => {
    setLocationType(type);
    setAddressValidated(null);
    setUserAddress('');
    setDistanceCheck(null);
  };

  const calculateTotal = () => {
    if (!selectedService) return 0;
    
    // Ensure price is a number
    let total = typeof selectedService.price === 'number' 
      ? selectedService.price 
      : parseFloat(selectedService.price) || 0;
    
    // Add location fee - "Come to Me" also uses travelFee
    if (locationType === 'home' && provider?.locationOptions?.travelFee) {
      total += parseFloat(provider.locationOptions.travelFee) || 0;
    } else if (locationType === 'travel' && provider?.locationOptions?.travelFee) {
      total += parseFloat(provider.locationOptions.travelFee) || 0;
    } else if (locationType === 'online' && provider?.locationOptions?.onlineFee) {
      total += parseFloat(provider.locationOptions.onlineFee) || 0;
    }
    
    // Add add-ons
    Object.entries(selectedAddOns).forEach(([addOnId, isSelected]) => {
      if (isSelected) {
        const addOn = provider?.addOns?.find((a: any) => a.id === parseInt(addOnId));
        if (addOn) {
          total += parseFloat(addOn.price) || 0;
        }
      }
    });
    
    return total;
  };

  const calculateDeposit = () => {
    if (!provider?.requiresDeposit) return 0;
    const total = calculateTotal();
    return Math.round(total * (provider.depositAmount / 100));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (locationType === 'home' && (!userAddress.trim() || !userCity.trim() || !userState.trim())) {
      if (!userAddress.trim()) newErrors.address = 'Please enter your street address';
      if (!userCity.trim()) newErrors.city = 'Please enter your city';
      if (!userState.trim()) newErrors.state = 'Please enter your state';
    } else if (locationType === 'travel' && !userAddress.trim()) {
      newErrors.address = 'Please enter your address for booking';
    }
    
    // Check distance for "Come to Me" option
    if (locationType === 'home' && provider?.maxDistance && (!distanceCheck || !distanceCheck.checked || !distanceCheck.withinRange)) {
      newErrors.distance = 'Your location is outside the provider\'s travel range';
    }
    
    if (locationType === 'travel' && travelRadius < 1) {
      newErrors.radius = 'Please select a travel radius';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if booking is ready to submit
  const isBookingReady = () => {
    // Must have date and time selected
    if (!selectedDate || !selectedTime) {
      return false;
    }

    // Must have a location type selected
    if (!locationType) {
      return false;
    }

    // For "home" location: must have complete address and be within travel range
    if (locationType === 'home') {
      if (!userAddress.trim() || !userCity.trim() || !userState.trim()) {
        return false;
      }
      // If provider has maxDistance, must check distance and be within range
      if (provider?.maxDistance) {
        if (!distanceCheck || !distanceCheck.checked || !distanceCheck.withinRange) {
          return false;
        }
      }
      // If no maxDistance, just need address entered (provider travels anywhere)
    }

    // For "travel" location: must have address
    if (locationType === 'travel') {
      if (!userAddress.trim()) {
        return false;
      }
    }

    // For "studio" and "online": no address needed, always ready if location is available
    // (availability is already checked by the disabled state of location options)

    return true;
  };

  const handleBooking = async () => {
    // Prevent double submission
    if (isSubmitting) {
      return;
    }
    
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      alert('Please sign in to book an appointment.');
      window.location.href = '/login';
      return;
    }
    
    let userData;
    try {
      userData = JSON.parse(user);
    } catch (e) {
      alert('Error reading user data. Please sign in again.');
      window.location.href = '/login';
      return;
    }
    
    // Check if user is a client
    if (userData.user_type !== 'client') {
      alert('Only clients can book appointments. Please sign in with a client account.');
      window.location.href = '/login';
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare booking data
      const selectedAddOnsList = provider.addOns?.filter((addOn: any) => selectedAddOns[addOn.id]) || [];
      
      // Convert time from 12-hour format to 24-hour format
      const time24Hour = convertTo24Hour(selectedTime);
      if (!time24Hour) {
        throw new Error('Invalid time format. Please select a valid time.');
      }
      
      const bookingData = {
        provider_id: provider.id, // provider user_id
        service_name: selectedService.name,
        service_duration: typeof selectedService.duration === 'number' 
          ? selectedService.duration 
          : parseInt(selectedService.duration) || 60,
        service_price: typeof selectedService.price === 'number'
          ? selectedService.price
          : parseFloat(selectedService.price) || 0,
        booking_date: selectedDate,
        start_time: time24Hour, // Use converted 24-hour format
        location_type: locationType,
        location_details: locationType === 'home' || locationType === 'travel' ? userAddress : 
                          locationType === 'online' ? 'Online' : 
                          provider.location || 'Provider Studio',
        add_ons: selectedAddOnsList.map((addOn: any) => ({
          id: addOn.id,
          name: addOn.name,
          price: parseFloat(addOn.price) || 0
        })),
        total_amount: calculateTotal(),
        client_notes: null // Can add a notes field later
      };
      
      // Submit booking to API
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        const errorMessage = errorData.error || errorData.details || 'Failed to create booking';
        console.error('Booking error response:', errorData);
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      
      // Navigate to success page
      const successData = {
        bookingId: result.booking.id,
        providerId: provider.id,
        service: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        locationType,
        userAddress: locationType === 'home' ? userAddress : (locationType === 'travel' ? userAddress : ''),
        travelRadius: locationType === 'travel' ? travelRadius : 0,
        addOns: selectedAddOnsList,
        total: calculateTotal(),
        deposit: calculateDeposit()
      };
      
      localStorage.setItem('bookingData', JSON.stringify(successData));
      window.location.href = `/search/${params?.id}/book/success`;
    } catch (error: any) {
      console.error('Error creating booking:', error);
      alert(`Error creating booking: ${error.message || 'Please try again'}`);
      setIsSubmitting(false);
    }
  };

  if (isLoading || !provider || !selectedDate || !selectedTime) {
    return (
      <div className={styles.loading}>
        <div>Loading booking details...</div>
      </div>
    );
  }

  const total = calculateTotal();
  const deposit = calculateDeposit();

  return (
    <div className={styles.bookingConfirmationPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href={`/search/${params?.id}`} className={styles.backButton}>
            ← Back to Provider
          </Link>
          <Link href="/" className={styles.logo}>
            <Image
              src="/Omvira_logo_long.png"
              alt="Omvira Wellness"
              width={600}
              height={200}
              className={styles.logoImage}
            />
          </Link>
        </div>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.bookingContainer}>
          {/* Left Column - Booking Details */}
          <div className={styles.bookingDetails}>
            <h1 className={styles.pageTitle}>Confirm Your Booking</h1>
            
            {/* Compact Booking Summary */}
            <div className={styles.bookingSummaryCard}>
              <div className={styles.bookingSummaryContent}>
                <div className={styles.bookingDetails}>
                  <h4 className={styles.serviceTitle}>
                    {selectedService?.name}
                    {selectedService?.duration ? (() => {
                      const d = selectedService.duration;
                      if (typeof d === 'number') {
                        return ` (${d} min.)`;
                      }
                      const s = String(d).trim();
                      if (!s) return '';
                      // If it already contains "min" or "hour", use as-is, otherwise add "min."
                      if (/min|hour/i.test(s)) {
                        return ` (${s})`;
                      }
                      return ` (${s} min.)`;
                    })() : ''}
                  </h4>
                  <div className={styles.appointmentDateTime}>
                    {formatLocalDateLong(selectedDate)}, {selectedTime}
                  </div>
                  <button 
                    onClick={() => setShowProviderModal(true)}
                    className={styles.providerLink}
                  >
                    with {provider.name}
                  </button>
                  <div className={styles.locationText}>
                    {provider.location}
                  </div>
                </div>
                
                <div className={styles.summaryActions}>
                  <Link href={`/search/${params?.id}`} className={styles.modifyButton}>
                    Modify
                  </Link>
                </div>
              </div>
            </div>

            {/* Location Selection */}
            <div className={styles.locationCard}>
              <h3>Location</h3>
              <div className={styles.locationOptions}>
                <div 
                  className={`${styles.locationOption} ${locationType === 'studio' ? styles.selected : ''} ${!provider?.locationOptions?.hasBookedLocation ? styles.disabled : ''}`}
                  onClick={() => provider?.locationOptions?.hasBookedLocation && handleLocationChange('studio')}
                >
                  <FaBuilding className={styles.locationIcon} />
                  <div className={styles.locationInfo}>
                    <h4>Provider's Studio</h4>
                    <p>{provider.studioAddress}</p>
                    {provider?.locationOptions?.homeStudioFee > 0 && (
                      <span className={styles.locationFee}>+${provider.locationOptions.homeStudioFee}</span>
                    )}
                  </div>
                </div>

                <div 
                  className={`${styles.locationOption} ${locationType === 'home' ? styles.selected : ''} ${!provider?.locationOptions?.travelsToClient || (distanceCheck && distanceCheck.checked && !distanceCheck.withinRange) ? styles.disabled : ''}`}
                  onClick={() => {
                    if (provider?.locationOptions?.travelsToClient) {
                      // If distance hasn't been checked yet, allow selection (will check when address is entered)
                      if (!distanceCheck || distanceCheck.withinRange || !distanceCheck.checked) {
                        handleLocationChange('home');
                      }
                    }
                  }}
                >
                  <FaHome className={styles.locationIcon} />
                  <div className={styles.locationInfo}>
                    <h4>Come to Me</h4>
                    {distanceCheck && distanceCheck.checked && !distanceCheck.withinRange ? (
                      <p style={{ color: '#d32f2f', fontSize: '0.875rem', marginTop: '4px' }}>
                        {provider.maxDistance 
                          ? `Provider is willing to travel up to ${provider.maxDistance} miles from their location${provider.providerZipCode ? ` at ${provider.providerZipCode}` : ''}. Your location is outside this range.`
                          : 'Your location is outside the provider\'s travel range'}
                      </p>
                    ) : provider?.maxDistance ? (
                      <p style={{ fontSize: '0.875rem', color: '#666' }}>
                        Provider will travel up to {provider.maxDistance} miles from their location{provider.providerZipCode ? ` at ${provider.providerZipCode}` : ''}
                      </p>
                    ) : (
                      <p>Provider will travel to your location</p>
                    )}
                    {provider?.locationOptions?.travelFee > 0 && (
                      <span className={styles.locationFee}>+${provider.locationOptions.travelFee}</span>
                    )}
                  </div>
                </div>

          <div 
            className={`${styles.locationOption} ${locationType === 'travel' ? styles.selected : ''} ${!provider?.locationOptions?.travelsToClient ? styles.disabled : ''}`}
            onClick={() => provider?.locationOptions?.travelsToClient && handleLocationChange('travel')}
          >
            <FaCar className={styles.locationIcon} />
            <div className={styles.locationInfo}>
              <h4>On Location</h4>
              <p>Provider will book a studio for the session.</p>
              {provider?.locationOptions?.travelFee > 0 && (
                <span className={styles.locationFee}>+${provider.locationOptions.travelFee}</span>
              )}
            </div>
          </div>

          <div 
            className={`${styles.locationOption} ${locationType === 'online' ? styles.selected : ''} ${!provider?.locationOptions?.offersOnline ? styles.disabled : ''}`}
            onClick={() => provider?.locationOptions?.offersOnline && handleLocationChange('online')}
          >
            <FaVideo className={styles.locationIcon} />
            <div className={styles.locationInfo}>
              <h4>Online</h4>
              <p>Virtual session via video call</p>
              {provider?.locationOptions?.onlineFee > 0 && (
                <span className={styles.locationFee}>+${provider.locationOptions.onlineFee}</span>
              )}
            </div>
          </div>
              </div>

              {/* Address Input for home and travel options */}
              {(locationType === 'home' || locationType === 'travel') && (
                <div className={styles.addressSection} ref={addressSectionRef}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="address">Please enter your address</label>
                    {locationType === 'home' ? (
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {/* Street address on top line */}
                          <input
                            ref={addressInputRef}
                            type="text"
                            id="address"
                            value={userAddress}
                            onChange={handleAddressChange}
                            placeholder="Start typing your address..."
                            className={`${styles.addressInput} ${errors.address ? styles.error : ''}`}
                            autoComplete="off"
                            data-1p-ignore
                            style={{ width: '100%' }}
                          />
                          {/* City, State, ZIP on second line */}
                          <div className={styles.addressInputGroup} style={{ display: 'flex', gap: '12px' }}>
                            <input
                              type="text"
                              id="city"
                              value={userCity}
                              onChange={(e) => setUserCity(e.target.value)}
                              placeholder="City"
                              className={`${styles.addressInput} ${styles.addressInputSmall} ${errors.city ? styles.error : ''}`}
                              autoComplete="off"
                              data-1p-ignore
                              style={{ flex: 1 }}
                            />
                            <input
                              type="text"
                              id="state"
                              value={userState}
                              onChange={(e) => setUserState(e.target.value)}
                              placeholder="State"
                              className={`${styles.addressInput} ${styles.addressInputSmall} ${errors.state ? styles.error : ''}`}
                              autoComplete="off"
                              data-1p-ignore
                              maxLength={2}
                              style={{ width: '80px' }}
                            />
                            <input
                              type="text"
                              id="zipCode"
                              value={userZipCode}
                              onChange={(e) => setUserZipCode(e.target.value.replace(/\D/g, ''))}
                              placeholder="Zip"
                              className={`${styles.addressInput} ${styles.addressInputSmall} ${errors.zipCode ? styles.error : ''}`}
                              autoComplete="off"
                              data-1p-ignore
                              maxLength={5}
                              style={{ width: '80px' }}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={validateAddress}
                          disabled={!userAddress.trim() || !userCity.trim() || !userState.trim() || isCheckingDistance}
                          className={styles.checkAddressButton}
                          style={{ marginTop: '12px', color: 'white' }}
                        >
                          {isCheckingDistance ? 'Checking...' : 'Check Distance'}
                        </button>
                      </>
                    ) : (
                      <input
                        type="text"
                        id="address"
                        value={userAddress}
                        onChange={handleAddressChange}
                        placeholder="Enter your full address"
                        className={`${styles.addressInput} ${errors.address ? styles.error : ''}`}
                        autoComplete="off"
                        data-1p-ignore
                      />
                    )}
                    {errors.address && <span className={styles.errorText}>{errors.address}</span>}
                    {errors.city && <span className={styles.errorText}>{errors.city}</span>}
                    {errors.state && <span className={styles.errorText}>{errors.state}</span>}
                    {errors.distance && <span className={styles.errorText}>{errors.distance}</span>}
                  </div>

                  {locationType === 'travel' && (
                    <>
                      <div className={styles.inputGroup}>
                        <label htmlFor="radius">What is your travel radius?</label>
                        <div className={styles.radiusSelector}>
                          <input
                            type="range"
                            min="1"
                            max="25"
                            value={travelRadius}
                            onChange={(e) => setTravelRadius(parseInt(e.target.value))}
                            className={styles.radiusSlider}
                          />
                          <span className={styles.radiusValue}>{travelRadius} miles</span>
                        </div>
                        {errors.radius && <span className={styles.errorText}>{errors.radius}</span>}
                      </div>
                      
                      <div className={styles.inputGroup}>
                        <button
                          type="button"
                          onClick={validateAddress}
                          disabled={!userAddress.trim()}
                          className={styles.checkAddressButton}
                        >
                          Save Travel Preference
                        </button>
                      </div>
                    </>
                  )}

                  {distanceCheck && distanceCheck.checked && locationType === 'home' && (
                    <div className={`${styles.validationMessage} ${distanceCheck.withinRange ? styles.valid : styles.invalid}`}>
                      {distanceCheck.withinRange ? (
                        <>
                          <span className={styles.checkmark}>✓</span>
                          {distanceCheck.distance !== null 
                            ? `You are ${distanceCheck.distance} miles away. Provider will travel to your location.`
                            : "You are within the provider's travel range. Provider will travel to your location."}
                        </>
                      ) : (
                        <>
                          <span className={styles.errorIcon}>✗</span>
                          {distanceCheck.message}
                        </>
                      )}
                    </div>
                  )}
                  
                  {addressValidated !== null && userAddress.trim() && locationType === 'travel' && (
                    <div className={`${styles.validationMessage} ${addressValidated ? styles.valid : styles.invalid}`}>
                      {addressValidated ? (
                        <>
                          <span className={styles.checkmark}>✓</span>
                          "Great! Your travel preferences have been saved. Your provider will book a studio and email you the details."
                        </>
                      ) : (
                        <>
                          <span className={styles.xmark}>✗</span>
                          {locationType === 'home' ? 
                            "Unfortunately, you are outside of this provider's travel radius. Please select a different location." :
                            "Unfortunately, you are outside of this provider's travel radius. Please select a different location or change your travel radius."
                          }
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Add-ons */}
            <div className={styles.addOnsCard}>
              <h3>Add-ons (Optional)</h3>
              <div className={styles.addOnsList}>
                {provider.addOns?.map((addOn: any) => (
                  <div 
                    key={addOn.id} 
                    className={`${styles.addOnItem} ${selectedAddOns[addOn.id] ? styles.selected : ''}`}
                    onClick={() => handleAddOnChange(addOn.id)}
                  >
                    <div className={styles.addOnInfo}>
                      <h4>{addOn.name}</h4>
                      <p>{addOn.description}</p>
                      <span className={styles.addOnPrice}>+${addOn.price}</span>
                    </div>
                    <div className={styles.addOnToggle}>
                      <input
                        type="checkbox"
                        id={`addon-${addOn.id}`}
                        checked={selectedAddOns[addOn.id] || false}
                        onChange={() => handleAddOnChange(addOn.id)}
                        className={styles.addOnCheckbox}
                      />
                      <label htmlFor={`addon-${addOn.id}`} className={styles.addOnLabel}></label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div className={styles.paymentSummary}>
            <div className={styles.summaryCard}>
              <h3>Booking Summary</h3>
              
              {(() => {
                const hasLocationFee = (locationType === 'home' && provider?.locationOptions?.travelFee > 0) ||
                  (locationType === 'travel' && provider?.locationOptions?.travelFee > 0) ||
                  (locationType === 'online' && provider?.locationOptions?.onlineFee > 0);
                const hasAddOns = Object.values(selectedAddOns).some(selected => selected === true);
                const hasIntermediateItems = hasLocationFee || hasAddOns;
                
                return (
                  <div className={styles.summaryItem}>
                    <span>{selectedService.name}</span>
                    <span>${parseFloat(selectedService.price || 0).toFixed(2)}</span>
                  </div>
                );
              })()}

              {/* Location Fee */}
              {locationType === 'home' && provider?.locationOptions?.travelFee > 0 && (
                <div className={styles.summaryItem}>
                  <span>Travel Fee</span>
                  <span>${parseFloat(provider.locationOptions.travelFee || 0).toFixed(2)}</span>
                </div>
              )}
              
              {locationType === 'travel' && provider?.locationOptions?.travelFee > 0 && (
                <div className={styles.summaryItem}>
                  <span>Travel Fee</span>
                  <span>${parseFloat(provider.locationOptions.travelFee || 0).toFixed(2)}</span>
                </div>
              )}

              {locationType === 'online' && provider?.locationOptions?.onlineFee > 0 && (
                <div className={styles.summaryItem}>
                  <span>Online Fee</span>
                  <span>${parseFloat(provider.locationOptions.onlineFee || 0).toFixed(2)}</span>
                </div>
              )}

              {Object.entries(selectedAddOns).map(([addOnId, isSelected]) => {
                if (!isSelected) return null;
                const addOn = provider.addOns?.find((a: any) => a.id === parseInt(addOnId));
                if (!addOn) return null;
                return (
                  <div key={addOnId} className={styles.summaryItem}>
                    <span>{addOn.name}</span>
                    <span>${parseFloat(addOn.price || 0).toFixed(2)}</span>
                  </div>
                );
              })}

              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {provider.requiresDeposit && (
                <div className={styles.depositInfo}>
                  <p className={styles.depositText}>
                    This provider requires a {provider.depositAmount}% deposit to secure your booking.
                  </p>
                  <div className={styles.depositAmount}>
                    <span>Deposit Amount</span>
                    <span>${deposit.toFixed(2)}</span>
                  </div>
                  <div className={styles.remainingAmount}>
                    <span>Remaining Balance</span>
                    <span>${(total - deposit).toFixed(2)}</span>
                  </div>
                </div>
              )}

              <button
                className={styles.bookButton}
                onClick={handleBooking}
                disabled={isSubmitting || !isBookingReady()}
                style={{
                  opacity: (!isBookingReady() || isSubmitting) ? 0.6 : 1,
                  cursor: (!isBookingReady() || isSubmitting) ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting 
                  ? 'Processing...' 
                  : provider.requiresDeposit 
                    ? `Pay $${deposit.toFixed(2)} Deposit` 
                    : `Pay $${total.toFixed(2)}`
                }
              </button>

              <div className={styles.bookingInfo}>
                <p>• Free cancellation up to 24 hours before</p>
                <p>• Secure payment processing</p>
                <p>• Confirmation sent via email</p>
                {provider.requiresDeposit && (
                  <p>• Remaining balance due at appointment</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Provider Modal */}
      {showProviderModal && (
        <div className={styles.modalOverlay} onClick={() => setShowProviderModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <button 
                className={styles.closeButton}
                onClick={() => setShowProviderModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.providerModalInfo}>
                <Image
                  src={provider.image}
                  alt={provider.name}
                  width={60}
                  height={60}
                  className={styles.modalProviderImage}
                />
                <div className={styles.modalProviderDetails}>
                  <h4>{provider.name}</h4>
                  <div className={styles.modalRating}>
                    <span className={styles.stars}>★★★★★</span>
                    <span>{provider.rating} ({provider.reviewCount} reviews)</span>
                  </div>
                  <p>📍 {provider.location}</p>
                </div>
              </div>
              
              <div className={styles.modalBio}>
                <p>{provider.bio}</p>
              </div>
              
              <div className={styles.modalServices}>
                <h5>Services</h5>
                <ul>
                  {provider.serviceDetails.map((service: any, index: number) => (
                    <li key={index}>
                      <strong>{service.name}</strong> - {service.duration} - ${service.price}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
