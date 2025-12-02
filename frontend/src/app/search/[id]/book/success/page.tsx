'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaCreditCard, FaClipboardList } from 'react-icons/fa';
import styles from '@/styles/BookingSuccess.module.scss';

export default function BookingSuccessPage() {
  const params = useParams();
  const [bookingData, setBookingData] = useState<any>(null);
  const [dashboardUrl, setDashboardUrl] = useState<string>('/login');

  useEffect(() => {
    // Get booking data from localStorage
    const storedData = localStorage.getItem('bookingData');
    if (storedData) {
      setBookingData(JSON.parse(storedData));
      // Clear the stored data after displaying
      localStorage.removeItem('bookingData');
    }

    // Get user ID for dashboard URL
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.id && userData.user_type === 'client') {
          setDashboardUrl(`/dashboard/${userData.id}`);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  if (!bookingData) {
    return (
      <div className={styles.loading}>
        <div>Loading booking confirmation...</div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLocationText = () => {
    switch (bookingData.locationType) {
      case 'studio':
        return 'Provider\'s Studio - 123 Wellness Way, Los Angeles, CA 90210';
      case 'home':
        return 'Your Location (Provider will travel to you)';
      case 'travel':
        return `On Location (within ${bookingData.travelRadius} miles of your address)`;
      case 'online':
        return 'Online Session (Virtual)';
      default:
        return 'Provider\'s Studio - 123 Wellness Way, Los Angeles, CA 90210';
    }
  };

  // Check if Extended Session add-on was selected
  const hasExtendedSession = bookingData.addOns && 
    bookingData.addOns.some((addOn: any) => 
      addOn.name === 'Extended Session'
    );

  const getEndTime = () => {
    const startTime = bookingData.time;
    const baseDuration = 60; // Base session is 60 minutes
    
    const totalMinutes = baseDuration + (hasExtendedSession ? 15 : 0);
    
    // Parse start time and add duration
    const [time, period] = startTime.split(' ');
    const [hours, minutes] = time.split(':');
    let startMinutes = parseInt(hours) * 60 + parseInt(minutes);
    
    if (period === 'PM' && parseInt(hours) !== 12) {
      startMinutes += 12 * 60;
    }
    if (period === 'AM' && parseInt(hours) === 12) {
      startMinutes -= 12 * 60;
    }
    
    const endMinutes = startMinutes + totalMinutes;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    
    const displayHours = endHours > 12 ? endHours - 12 : endHours;
    const displayMinutes = endMins.toString().padStart(2, '0');
    const endPeriod = endHours >= 12 ? 'PM' : 'AM';
    
    return `${displayHours}:${displayMinutes} ${endPeriod}`;
  };

  const getSelectedAddOns = () => {
    if (!bookingData.addOns) return [];
    return bookingData.addOns;
  };

  return (
    <div className={styles.bookingSuccessPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
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
        <div className={styles.successContainer}>
          {/* Success Icon and Title */}
          <div className={styles.successHeader}>
            {/* <FaCheckCircle className={styles.successIcon} /> */}
            <h1 className={styles.successTitle}>You're All Set!</h1>
            <p className={styles.successSubtitle}>
              Your appointment has been successfully booked.
            </p>
            <p className={styles.successSubtitle}>
              You'll receive a confirmation email shortly.
            </p>
          </div>

          {/* Booking Details Card */}
          <div className={styles.bookingDetailsCard}>
            <h2 className={styles.cardTitle}>Booking Confirmation</h2>
            
            <div className={styles.bookingInfo}>
              <div className={styles.infoItem}>
                <FaCalendarAlt className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <h3>Appointment Details</h3>
                  <p className={styles.appointmentDate}>{formatDate(bookingData.date)}</p>
                  <p className={styles.appointmentTime}>{bookingData.time} - {getEndTime()}</p>
                  <p className={styles.sessionDuration}>
                    {hasExtendedSession 
                      ? '75 minute session' 
                      : '60 minute session'
                    }
                  </p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <FaMapMarkerAlt className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <h3>Location</h3>
                  <p className={styles.locationText}>{getLocationText()}</p>
                  {bookingData.userAddress && bookingData.locationType === 'home' && (
                    <p className={styles.userAddress}>{bookingData.userAddress}</p>
                  )}
                  {bookingData.locationType === 'travel' && (
                    <p className={styles.addressNote}>You will receive the address shortly</p>
                  )}
                  {bookingData.locationType === 'online' && (
                    <p className={styles.addressNote}>You will receive the meeting link shortly</p>
                  )}
                </div>
              </div>

              <div className={styles.infoItem}>
                <FaClipboardList className={styles.infoIcon} />
                <div className={styles.infoContent}>
                  <h3>Service Booked</h3>
                  <div className={styles.serviceItemCompact}>
                    <span className={styles.serviceNameCompact}>{bookingData.service}</span>
                    <span className={styles.servicePriceCompact}>${bookingData.total}</span>
                  </div>
                  {getSelectedAddOns().length > 0 && (
                    <div className={styles.addOnsSectionCompact}>
                      <ul className={styles.addOnsListCompact}>
                        {getSelectedAddOns().map((addOn: any, index: number) => (
                          <li key={index} className={styles.addOnItemCompact}>
                            <span>{addOn.name}</span>
                            <span className={styles.addOnPriceCompact}>+${addOn.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className={styles.paymentSummary}>
              <h3>Payment</h3>
              <div className={styles.paymentDetails}>
                <div className={styles.paymentItem}>
                  <span className={styles.paymentLabel}>Total:</span>
                  <span className={styles.paymentValue}>${bookingData.total}</span>
                </div>
                {bookingData.deposit > 0 && (
                  <>
                    <div className={styles.paymentItem}>
                      <span className={styles.paymentLabel}>Deposit Paid:</span>
                      <span className={styles.paymentValue}>${bookingData.deposit}</span>
                    </div>
                    <div className={styles.paymentItemRemaining}>
                      <span className={styles.paymentLabelRemaining}>Remaining to Pay at Appointment:</span>
                      <span className={styles.paymentValueRemaining}>${bookingData.total - bookingData.deposit}</span>
                    </div>
                  </>
                )}
                {bookingData.deposit === 0 && (
                  <div className={styles.paymentItem}>
                    <span className={styles.paymentLabel}>Total Paid:</span>
                    <span className={styles.paymentValue}>${bookingData.total}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className={styles.nextSteps}>
              <h3>What's Next?</h3>
              <ul className={styles.stepsList}>
                <li>You'll receive a confirmation email with all the details</li>
                <li>The provider will contact you 24 hours before your appointment</li>
                <li>If you need to reschedule or cancel, please do so at least 24 hours in advance</li>
                {bookingData.deposit > 0 && (
                  <li>Please bring payment for the remaining balance to your appointment</li>
                )}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <Link href="/search" className={styles.primaryButton}>
              Find More Providers
            </Link>
            <Link href={dashboardUrl} className={styles.secondaryButton}>
              View My Bookings
            </Link>
          </div>

          {/* Contact Info */}
          <div className={styles.contactInfo}>
            <p>Questions about your booking?</p>
            <p>Contact us at <a href="mailto:support@omvirawellness.com" className={styles.contactLink}>support@omvirawellness.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
