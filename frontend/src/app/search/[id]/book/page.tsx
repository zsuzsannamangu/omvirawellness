'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { FaMapMarkerAlt, FaHome, FaBuilding, FaCar, FaVideo } from 'react-icons/fa';
import styles from '@/styles/BookingConfirmation.module.scss';

// Sample provider data (same as detail page)
const getProviderData = (id: string) => {
  const providers: any = {
    '1': {
      id: 1,
      name: 'Sarah Chen',
      image: '/images/yoga4.jpg',
      location: 'Los Angeles',
      startingPrice: 85,
      services: ['Private Yoga', 'Yoga Therapy'],
      rating: 4.9,
      reviewCount: 127,
      bio: 'I\'ve been practicing yoga for over 15 years and teaching for 8 years. My approach combines traditional Hatha and Vinyasa styles with modern therapeutic techniques.',
      photos: [
        '/images/yoga4.jpg',
        '/images/yoga5.jpg',
        '/images/yoga6.jpg'
      ],
      serviceDetails: [
        {
          name: 'Private Yoga Session',
          duration: '60 min',
          price: 85,
          description: 'Personalized yoga session tailored to your needs and goals'
        },
        {
          name: 'Yoga Therapy',
          duration: '90 min',
          price: 120,
          description: 'Therapeutic yoga focused on healing and rehabilitation'
        }
      ],
      // Provider settings
      requiresDeposit: true,
      depositAmount: 25, // 25% of service price
      acceptsHomeVisits: true,
      hasStudio: true,
      studioAddress: '123 Wellness Center, Los Angeles, CA 90210',
      maxTravelDistance: 15, // miles
    locationOptions: {
      hasHomeStudio: true,
      travelsToClient: true,
      hasBookedLocation: true,
      offersOnline: true,
      travelRadius: 15, // miles
      homeStudioFee: 0,
      travelFee: 25,
      onlineFee: 0
    },
      addOns: [
        {
          id: 1,
          name: 'Yoga Mat Rental',
          price: 5,
          description: 'High-quality yoga mat provided'
        },
        {
          id: 2,
          name: 'Props Package',
          price: 10,
          description: 'Blocks, straps, and bolsters included'
        },
        {
          id: 3,
          name: 'Extended Session',
          price: 20,
          description: 'Add 15 minutes to your session'
        },
        {
          id: 4,
          name: 'Nutrition Consultation',
          price: 30,
          description: '15-minute post-session nutrition advice'
        }
      ]
    }
  };
  return providers[id] || providers['1'];
};

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

  useEffect(() => {
    if (params?.id) {
      const providerData = getProviderData(params.id as string);
      setProvider(providerData);
      
      // Get booking details from URL params
      const serviceName = searchParams.get('service');
      const date = searchParams.get('date');
      const time = searchParams.get('time');
      
      if (serviceName && providerData?.serviceDetails) {
        const service = providerData.serviceDetails.find((s: any) => s.name === serviceName);
        if (service) {
          setSelectedService(service);
        }
      }
      
      if (date) setSelectedDate(date);
      if (time) setSelectedTime(time);
      
      // Set loading to false after data is loaded
      setIsLoading(false);
    }
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
    
    let total = selectedService.price;
    
    // Add location fee
    if (locationType === 'home' && provider?.locationOptions?.homeStudioFee) {
      total += provider.locationOptions.homeStudioFee;
    } else if (locationType === 'travel' && provider?.locationOptions?.travelFee) {
      total += provider.locationOptions.travelFee;
    } else if (locationType === 'online' && provider?.locationOptions?.onlineFee) {
      total += provider.locationOptions.onlineFee;
    }
    
    // Add add-ons
    Object.entries(selectedAddOns).forEach(([addOnId, isSelected]) => {
      if (isSelected) {
        const addOn = provider?.addOns?.find((a: any) => a.id === parseInt(addOnId));
        if (addOn) {
          total += addOn.price;
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

  if (isLoading || !provider || !selectedService || !selectedDate || !selectedTime) {
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
                  <h4 className={styles.serviceTitle}>{selectedService.name} ({selectedService.duration})</h4>
                  <div className={styles.appointmentDateTime}>
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric'
                    })}, {selectedTime}
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
                  className={`${styles.locationOption} ${locationType === 'home' ? styles.selected : ''} ${!provider?.locationOptions?.hasHomeStudio ? styles.disabled : ''}`}
                  onClick={() => provider?.locationOptions?.hasHomeStudio && handleLocationChange('home')}
                >
                  <FaHome className={styles.locationIcon} />
                  <div className={styles.locationInfo}>
                    <h4>Come to Me</h4>
                    <p>Provider will travel to your location</p>
                    {provider?.locationOptions?.homeStudioFee > 0 && (
                      <span className={styles.locationFee}>+${provider.locationOptions.homeStudioFee}</span>
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
              
              <div className={styles.summaryItem}>
                <span>{selectedService.name}</span>
                <span>${selectedService.price}</span>
              </div>

              {/* Location Fee */}
              {locationType === 'home' && provider?.locationOptions?.homeStudioFee > 0 && (
                <div className={styles.summaryItem}>
                  <span>Come to Me Fee</span>
                  <span>${provider.locationOptions.homeStudioFee}</span>
                </div>
              )}
              
              {locationType === 'travel' && provider?.locationOptions?.travelFee > 0 && (
                <div className={styles.summaryItem}>
                  <span>Travel Fee</span>
                  <span>${provider.locationOptions.travelFee}</span>
                </div>
              )}

              {locationType === 'online' && provider?.locationOptions?.onlineFee > 0 && (
                <div className={styles.summaryItem}>
                  <span>Online Fee</span>
                  <span>${provider.locationOptions.onlineFee}</span>
                </div>
              )}

              {Object.entries(selectedAddOns).map(([addOnId, isSelected]) => {
                if (!isSelected) return null;
                const addOn = provider.addOns?.find((a: any) => a.id === parseInt(addOnId));
                if (!addOn) return null;
                return (
                  <div key={addOnId} className={styles.summaryItem}>
                    <span>{addOn.name}</span>
                    <span>${addOn.price}</span>
                  </div>
                );
              })}

              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>${total}</span>
              </div>

              {provider.requiresDeposit && (
                <div className={styles.depositInfo}>
                  <p className={styles.depositText}>
                    This provider requires a {provider.depositAmount}% deposit to secure your booking.
                  </p>
                  <div className={styles.depositAmount}>
                    <span>Deposit Amount</span>
                    <span>${deposit}</span>
                  </div>
                  <div className={styles.remainingAmount}>
                    <span>Remaining Balance</span>
                    <span>${total - deposit}</span>
                  </div>
                </div>
              )}

              <button 
                className={styles.bookButton}
                onClick={handleBooking}
              >
                {provider.requiresDeposit ? `Pay $${deposit} Deposit` : `Pay $${total}`}
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
