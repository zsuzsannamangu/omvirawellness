'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { FaMapMarkerAlt, FaHome, FaBuilding, FaCar, FaVideo } from 'react-icons/fa';
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
  const [travelRadius, setTravelRadius] = useState<number>(10);
  const [addressValidated, setAddressValidated] = useState<boolean | null>(null);
  
  // Add-ons
  const [selectedAddOns, setSelectedAddOns] = useState<{[key: number]: boolean}>({});
  
  // Form validation
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Provider modal
  const [showProviderModal, setShowProviderModal] = useState(false);

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

  useEffect(() => {
    const load = async () => {
      if (!params?.id) return;

      // Get booking details from URL params
      const serviceName = searchParams.get('service');
      const date = searchParams.get('date');
      const time = searchParams.get('time');

      try {
        const resp = await fetch(`http://localhost:4000/api/providers/${params.id}`);
        if (resp.ok) {
          const data = await resp.json();
          const mainPhoto = data.profile_photo_url || '/images/default-provider.jpg';
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

  const handleAddOnChange = (addOnId: number) => {
    setSelectedAddOns(prev => ({
      ...prev,
      [addOnId]: !prev[addOnId]
    }));
  };

  const validateAddress = () => {
    if (!userAddress.trim()) {
      setAddressValidated(null);
      return;
    }
    
    if (locationType === 'home') {
      // For "Come to Me" - check if user is within provider's travel radius
      const isValid = Math.random() > 0.3; // 70% chance of being valid
      setAddressValidated(isValid);
    } else if (locationType === 'travel') {
      // For "On Location" - just save the travel preference (always valid)
      setAddressValidated(true);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAddress(e.target.value);
    // Clear validation when user starts typing again
    setAddressValidated(null);
  };

  const handleLocationChange = (type: 'home' | 'studio' | 'travel' | 'online') => {
    setLocationType(type);
    setAddressValidated(null);
    setUserAddress('');
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
    
      if ((locationType === 'travel' || locationType === 'home') && !userAddress.trim()) {
        newErrors.address = 'Please enter your address for booking';
      }
    
    if (locationType === 'travel' && travelRadius < 1) {
      newErrors.radius = 'Please select a travel radius';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBooking = () => {
    if (validateForm()) {
      // Navigate to success page
      const bookingData = {
        providerId: provider.id,
        service: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        locationType,
        userAddress: locationType === 'home' ? userAddress : (locationType === 'travel' ? userAddress : ''),
        travelRadius: locationType === 'travel' ? travelRadius : 0,
        addOns: provider.addOns?.filter((addOn: any) => selectedAddOns[addOn.id]) || [],
        total: calculateTotal(),
        deposit: calculateDeposit()
      };
      
      // Store booking data and navigate to success page
      localStorage.setItem('bookingData', JSON.stringify(bookingData));
      window.location.href = `/search/${params?.id}/book/success`;
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
            Omvira Wellness
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
                  className={`${styles.locationOption} ${locationType === 'home' ? styles.selected : ''} ${!provider?.locationOptions?.travelsToClient ? styles.disabled : ''}`}
                  onClick={() => provider?.locationOptions?.travelsToClient && handleLocationChange('home')}
                >
                  <FaHome className={styles.locationIcon} />
                  <div className={styles.locationInfo}>
                    <h4>Come to Me</h4>
                    <p>Provider will travel to your location</p>
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
                <div className={styles.addressSection}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="address">Please enter your address</label>
                    {locationType === 'home' ? (
                      <div className={styles.addressInputGroup}>
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
                        <button
                          type="button"
                          onClick={validateAddress}
                          disabled={!userAddress.trim()}
                          className={styles.checkAddressButton}
                        >
                          Check Address
                        </button>
                      </div>
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

                  {addressValidated !== null && userAddress.trim() && (
                    <div className={`${styles.validationMessage} ${addressValidated ? styles.valid : styles.invalid}`}>
                      {addressValidated ? (
                        <>
                          <span className={styles.checkmark}>✓</span>
                          {locationType === 'home' ? 
                            "Yay! You are in the provider's travel zone. Provider will travel to your location." :
                            "Great! Your travel preferences have been saved. Your provider will book a studio and email you the details."
                          }
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
              >
                {provider.requiresDeposit ? `Pay $${deposit.toFixed(2)} Deposit` : `Pay $${total.toFixed(2)}`}
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
