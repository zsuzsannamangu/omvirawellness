'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaCreditCard, FaClipboardList } from 'react-icons/fa';
import styles from '@/styles/BookingSuccess.module.scss';

export default function BookingSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  const [dashboardUrl, setDashboardUrl] = useState<string>('/login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get booking data from localStorage
    const storedData = localStorage.getItem('bookingData');
    if (storedData) {
      try {
        setBookingData(JSON.parse(storedData));
        setIsLoading(false);
        // Clear the stored data after displaying (with a delay to ensure page renders)
        setTimeout(() => {
          localStorage.removeItem('bookingData');
        }, 1000);
      } catch (error) {
        console.error('Error parsing booking data:', error);
        setIsLoading(false);
      }
    } else {
      // If no data found, redirect to dashboard after a short delay
      setIsLoading(false);
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

  // If no booking data after loading, redirect to dashboard
  useEffect(() => {
    if (!isLoading && !bookingData) {
      const timer = setTimeout(() => {
        router.push(dashboardUrl);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, bookingData, dashboardUrl, router]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div>Loading booking confirmation...</div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className={styles.loading}>
        <div>Taking you to your bookings...</div>
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
      <div className={styles.mainContent}>
        <div className={styles.successContainer}>
          {/* Success Icon and Title */}
          <div className={styles.successHeader}>
            {/* <FaCheckCircle className={styles.successIcon} /> */}
            <h1 className={styles.successTitle}>You're All Set!</h1>
            <p className={styles.successSubtitle}>
              Your appointment request has been successfully sent to the provider.
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
                  <p className={styles.locationText}>{bookingData.service} - ${bookingData.total}</p>
                  {getSelectedAddOns().length > 0 && (
                    <>
                      {getSelectedAddOns().map((addOn: any, index: number) => (
                        <p key={index} className={styles.addressNote}>
                          {addOn.name} - +${addOn.price}
                        </p>
                      ))}
                    </>
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
                <li>The provider will review your appointment request</li>
                <li>You'll receive a message once the provider confirms or declines your request</li>
                <li>Once confirmed, you'll receive all the appointment details</li>
                <li>You can cancel this request at any time from your bookings dashboard</li>
                {bookingData.deposit > 0 && (
                  <li>Payment will be processed after the provider confirms your appointment</li>
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
