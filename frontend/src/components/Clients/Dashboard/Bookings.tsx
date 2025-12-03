'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import styles from '@/styles/Clients/Dashboard.module.scss';
import ReviewPopup from './ReviewPopup';
import RescheduleModal from './RescheduleModal';

interface BookingsProps {
  activeSubmenu: string;
}

export default function Bookings({ activeSubmenu }: BookingsProps) {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<{
    providerName: string;
    serviceName: string;
    providerId: string;
    bookingId: string;
  } | null>(null);
  const [selectedRescheduleBooking, setSelectedRescheduleBooking] = useState<{
    bookingId: string;
    providerId: string;
    providerName: string;
    serviceName: string;
    currentDate: string;
    currentTime: string;
  } | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadBookings = useCallback(async () => {
      try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (!token || !user) {
          setBookings([]);
          setLoading(false);
          return;
        }
        const userData = JSON.parse(user);
        const clientId = userData.id;

        // Always fetch all, then filter per tab so 'upcoming' can include pending
        const baseUrl = `http://localhost:4000/api/bookings/client/${clientId}`;
        const resp = await fetch(baseUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (resp.ok) {
          const data = await resp.json();
          const list = Array.isArray(data) ? data : [];
          
          // Helper function to check if a booking is in the past
          const isPastBooking = (booking: any): boolean => {
            if (!booking.booking_date || !booking.start_time) return false;
            
            try {
              // Parse booking date - handle both ISO string and YYYY-MM-DD format
              let bookingDate: Date;
              if (typeof booking.booking_date === 'string') {
                // Check if it's YYYY-MM-DD format
                if (/^\d{4}-\d{2}-\d{2}$/.test(booking.booking_date)) {
                  const [year, month, day] = booking.booking_date.split('-').map(Number);
                  bookingDate = new Date(year, month - 1, day);
                } else {
                  // Try parsing as ISO string
                  bookingDate = new Date(booking.booking_date);
                }
              } else if (booking.booking_date instanceof Date) {
                bookingDate = booking.booking_date;
              } else {
                return false;
              }
              
              // Parse time - handle HH:MM or HH:MM:SS format
              const timeStr = String(booking.start_time);
              const timeParts = timeStr.split(':');
              const hours = parseInt(timeParts[0], 10);
              const minutes = parseInt(timeParts[1] || '0', 10);
              
              // Create a date object for the booking date+time (local time)
              const bookingDateTime = new Date(
                bookingDate.getFullYear(),
                bookingDate.getMonth(),
                bookingDate.getDate(),
                hours,
                minutes,
                0, // seconds
                0  // milliseconds
              );
              
              // Get current date+time (local time), reset seconds/milliseconds for fair comparison
              const now = new Date();
              now.setSeconds(0, 0);
              
              // Consider it past if the booking date+time is before now
              const isPast = bookingDateTime < now;
              
              // Debug logging (can be removed later)
              if (isPast) {
                console.log('Past booking detected:', {
                  booking_date: booking.booking_date,
                  start_time: booking.start_time,
                  bookingDateTime: bookingDateTime.toISOString(),
                  now: now.toISOString(),
                  status: booking.status
                });
              }
              
              return isPast;
            } catch (error) {
              console.error('Error checking if booking is past:', error, booking);
              return false;
            }
          };
          
          let filtered = list;
          if (activeSubmenu === 'upcoming') {
            // Upcoming: status is pending/confirmed AND date is in the future
            filtered = list.filter((b: any) => {
              if (b.status === 'cancelled') return false;
              return (b.status === 'pending' || b.status === 'confirmed') && !isPastBooking(b);
            });
            
            // Sort upcoming bookings chronologically (earlier first)
            filtered.sort((a: any, b: any) => {
              // Compare dates first
              const dateA = new Date(a.booking_date);
              const dateB = new Date(b.booking_date);
              
              if (dateA.getTime() !== dateB.getTime()) {
                return dateA.getTime() - dateB.getTime(); // Earlier date first
              }
              
              // If same date, compare times
              const timeA = String(a.start_time).split(':').map(Number);
              const timeB = String(b.start_time).split(':').map(Number);
              const timeAMinutes = timeA[0] * 60 + (timeA[1] || 0);
              const timeBMinutes = timeB[0] * 60 + (timeB[1] || 0);
              
              return timeAMinutes - timeBMinutes; // Earlier time first
            });
          } else if (activeSubmenu === 'past') {
            // Past: either status is completed, OR date is in the past (regardless of status, unless cancelled)
            filtered = list.filter((b: any) => {
              if (b.status === 'cancelled') return false;
              return b.status === 'completed' || isPastBooking(b);
            });
            
            // Sort past bookings reverse chronologically (most recent first)
            filtered.sort((a: any, b: any) => {
              const dateA = new Date(a.booking_date);
              const dateB = new Date(b.booking_date);
              
              if (dateA.getTime() !== dateB.getTime()) {
                return dateB.getTime() - dateA.getTime(); // Later date first (most recent)
              }
              
              // If same date, compare times (later time first)
              const timeA = String(a.start_time).split(':').map(Number);
              const timeB = String(b.start_time).split(':').map(Number);
              const timeAMinutes = timeA[0] * 60 + (timeA[1] || 0);
              const timeBMinutes = timeB[0] * 60 + (timeB[1] || 0);
              
              return timeBMinutes - timeAMinutes; // Later time first (most recent)
            });
          } else if (activeSubmenu === 'canceled') {
            filtered = list.filter((b: any) => b.status === 'cancelled');
            
            // Sort canceled bookings reverse chronologically (most recent first)
            filtered.sort((a: any, b: any) => {
              const dateA = new Date(a.booking_date);
              const dateB = new Date(b.booking_date);
              
              if (dateA.getTime() !== dateB.getTime()) {
                return dateB.getTime() - dateA.getTime(); // Later date first
              }
              
              const timeA = String(a.start_time).split(':').map(Number);
              const timeB = String(b.start_time).split(':').map(Number);
              const timeAMinutes = timeA[0] * 60 + (timeA[1] || 0);
              const timeBMinutes = timeB[0] * 60 + (timeB[1] || 0);
              
              return timeBMinutes - timeAMinutes; // Later time first
            });
          }
          setBookings(filtered);
        } else {
          setBookings([]);
        }
      } catch (e) {
        setBookings([]);
      } finally {
        setLoading(false);
      }
  }, [activeSubmenu]);

  useEffect(() => {
    setLoading(true);
    setBookings([]); // Clear previous bookings to prevent flashing old data
    loadBookings();
  }, [loadBookings]);

  // Auto-refresh when the tab gains focus and every 15s
  useEffect(() => {
    const onFocus = () => loadBookings();
    window.addEventListener('focus', onFocus);
    const id = setInterval(() => loadBookings(), 15000);
    return () => {
      window.removeEventListener('focus', onFocus);
      clearInterval(id);
    };
  }, [activeSubmenu]);

  const handleLeaveReview = (booking: any) => {
    const providerName = booking.contact_name || booking.business_name || 'Provider';
    const svc = (() => {
      try {
        const info = booking.provider_notes ? JSON.parse(booking.provider_notes) : null;
        return info?.name || 'Service';
      } catch { return 'Service'; }
    })();
    
    setSelectedBooking({ 
      providerName, 
      serviceName: svc,
      providerId: booking.provider_user_id || '',
      bookingId: booking.id
    });
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (reviewData: any) => {
    if (!selectedBooking) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please sign in to submit a review.');
        return;
      }

      const response = await fetch('http://localhost:4000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          provider_id: selectedBooking.providerId,
          booking_id: selectedBooking.bookingId,
          rating: reviewData.rating,
          title: reviewData.comment.substring(0, 100) || null, // Use first 100 chars as title
          comment: reviewData.comment,
          recommends: reviewData.recommends
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to submit review');
      }

      const result = await response.json();
      alert('Thank you for your review!');
      
      // Refresh bookings to update UI
      loadBookings();
      
      setReviewModalOpen(false);
      setSelectedBooking(null);
    } catch (error: any) {
      console.error('Error submitting review:', error);
      alert(`Error submitting review: ${error.message || 'Please try again'}`);
    }
  };

  const handleReviewClose = () => {
    setReviewModalOpen(false);
    setSelectedBooking(null);
  };

  const handleReschedule = async (booking: any) => {
    const providerName = booking.contact_name || booking.business_name || 'Provider';
    const svc = (() => {
      try {
        const info = booking.provider_notes ? JSON.parse(booking.provider_notes) : null;
        return info?.name || 'Service';
      } catch { return 'Service'; }
    })();
    
    setSelectedRescheduleBooking({
      bookingId: booking.id,
      providerId: booking.provider_user_id || '',
      providerName,
      serviceName: svc,
      currentDate: booking.booking_date,
      currentTime: booking.start_time
    });
    setRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = async (newDate: string, newTime: string) => {
    if (!selectedRescheduleBooking) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please sign in to reschedule appointments.');
        return;
      }

      const response = await fetch(`http://localhost:4000/api/bookings/${selectedRescheduleBooking.bookingId}/reschedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          new_date: newDate,
          new_time: newTime
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to reschedule booking');
      }

      alert('Appointment rescheduled successfully!');
      setRescheduleModalOpen(false);
      setSelectedRescheduleBooking(null);
      loadBookings();
    } catch (error: any) {
      console.error('Error rescheduling booking:', error);
      throw error;
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please sign in to cancel appointments.');
        return;
      }

      const response = await fetch(`http://localhost:4000/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cancellation_reason: null // Can add a reason field later if needed
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to cancel booking');
      }

      const result = await response.json();
      alert('Appointment cancelled successfully.');
      
      // Refresh bookings to update UI
      loadBookings();
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      alert(`Error cancelling appointment: ${error.message || 'Please try again'}`);
    }
  };
  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.upcomingContent}>
          <h2 className={styles.sectionTitle}>
            {activeSubmenu === 'upcoming' && 'Upcoming'}
            {activeSubmenu === 'book-new' && 'Book New Appointment'}
            {activeSubmenu === 'past' && 'Past Appointments'}
            {activeSubmenu === 'canceled' && 'Canceled Appointments'}
          </h2>
          <div className={styles.placeholderText}>Loading...</div>
        </div>
      );
    }

    switch (activeSubmenu) {
      case 'upcoming':
        return (
          <div className={styles.upcomingContent}>
            <h2 className={styles.sectionTitle}>Upcoming</h2>
            <div className={styles.sessionsList}>
              {bookings.length === 0 ? (
                <div className={styles.placeholderText}>No upcoming bookings.</div>
              ) : (
                bookings.map((b) => {
                  const date = new Date(b.booking_date);
                  const day = String(date.getDate());
                  const month = date.toLocaleString('en-US', { month: 'short' });
                  const providerName = b.contact_name || b.business_name || 'Provider';
                  const svc = (() => {
                    try {
                      const info = b.provider_notes ? JSON.parse(b.provider_notes) : null;
                      return info?.name || 'Service';
                    } catch { return 'Service'; }
                  })();
                  const formatTime = (t: string) => {
                    const [h, m] = t.split(':').map((x: string)=>parseInt(x,10));
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    const hh = h % 12 === 0 ? 12 : h % 12;
                    return `${hh}:${String(m).padStart(2,'0')} ${ampm}`;
                  };
                  const statusLabel = b.status.charAt(0).toUpperCase() + b.status.slice(1);
                  return (
                    <div key={b.id} className={styles.sessionCard}>
                      <span className={`${styles.statusBadge} ${styles[b.status]} ${styles.statusTopRight}`}>{statusLabel}</span>
                      <div className={styles.sessionDate}>
                        <span className={styles.day}>{day}</span>
                        <span className={styles.month}>{month}</span>
                      </div>
                      <div className={styles.sessionDetails}>
                        <h4 className={styles.sessionTitle}>{svc}</h4>
                        <p className={styles.sessionProvider}>with {providerName}</p>
                        <p className={styles.sessionTime}>{formatTime(b.start_time)} - {formatTime(b.end_time)}</p>
                      </div>
                      <div className={styles.sessionRight}>
                        <div className={styles.sessionActions}>
                          <button 
                            className={styles.actionBtn}
                            onClick={() => handleReschedule(b)}
                          >
                            Reschedule
                          </button>
                          <button 
                            className={styles.actionBtn}
                            onClick={() => handleCancelBooking(b.id)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );

      case 'book-new':
        return (
          <div className={styles.bookNewContent}>
            <h2 className={styles.sectionTitle}>Book New Appointment</h2>
            <div className={styles.placeholderText}>Browse providers to book a new appointment.</div>
          </div>
        );

      case 'past':
        return (
          <div className={styles.pastContent}>
            <h2 className={styles.sectionTitle}>Past Appointments</h2>
            <div className={styles.sessionsList}>
              {bookings.length === 0 ? (
                <div className={styles.placeholderText}>No past appointments.</div>
              ) : (
                bookings.map((b) => {
                  const date = new Date(b.booking_date);
                  const day = String(date.getDate());
                  const month = date.toLocaleString('en-US', { month: 'short' });
                  const providerName = b.contact_name || b.business_name || 'Provider';
                  const svc = (() => {
                    try { const info = b.provider_notes ? JSON.parse(b.provider_notes) : null; return info?.name || 'Service'; } catch { return 'Service'; }
                  })();
                  const formatTime = (t: string) => { const [h, m] = t.split(':').map((x: string)=>parseInt(x,10)); const ampm = h >= 12 ? 'PM' : 'AM'; const hh = h % 12 === 0 ? 12 : h % 12; return `${hh}:${String(m).padStart(2,'0')} ${ampm}`; };
                  return (
                    <div key={b.id} className={styles.sessionCard}>
                      <div className={styles.sessionDate}>
                        <span className={styles.day}>{day}</span>
                        <span className={styles.month}>{month}</span>
                      </div>
                      <div className={styles.sessionDetails}>
                        <h4 className={styles.sessionTitle}>{svc}</h4>
                        <p className={styles.sessionProvider}>with {providerName}</p>
                        <p className={styles.sessionTime}>{formatTime(b.start_time)} - {formatTime(b.end_time)}</p>
                        <div className={styles.sessionStatus}>
                          <span className={styles.statusCompleted}>Completed</span>
                        </div>
                      </div>
                      <div className={styles.sessionRight}>
                        <div className={styles.sessionActions}>
                          {b.has_review ? (
                            <span className={styles.reviewLeftText}>You reviewed this provider</span>
                          ) : (
                            <button 
                              className={styles.actionBtn}
                              onClick={() => handleLeaveReview(b)}
                            >
                              Leave a Review
                            </button>
                          )}
                          {b.provider_user_id && (
                            <Link 
                              href={`/search/${b.provider_user_id}`}
                              className={styles.actionBtn}
                            >
                              Book Again
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );

      case 'canceled':
        return (
          <div className={styles.canceledContent}>
            <h2 className={styles.sectionTitle}>Canceled Appointments</h2>
            <div className={styles.sessionsList}>
              {bookings.length === 0 ? (
                <div className={styles.placeholderText}>No canceled appointments.</div>
              ) : (
                bookings.map((b) => {
                  const date = new Date(b.booking_date);
                  const day = String(date.getDate());
                  const month = date.toLocaleString('en-US', { month: 'short' });
                  const providerName = b.contact_name || b.business_name || 'Provider';
                  const svc = (() => { try { const info = b.provider_notes ? JSON.parse(b.provider_notes) : null; return info?.name || 'Service'; } catch { return 'Service'; }})();
                  const formatTime = (t: string) => { const [h, m] = t.split(':').map((x: string)=>parseInt(x,10)); const ampm = h >= 12 ? 'PM' : 'AM'; const hh = h % 12 === 0 ? 12 : h % 12; return `${hh}:${String(m).padStart(2,'0')} ${ampm}`; };
                  return (
                    <div key={b.id} className={styles.sessionCard}>
                      <div className={styles.sessionDate}>
                        <span className={styles.day}>{day}</span>
                        <span className={styles.month}>{month}</span>
                      </div>
                      <div className={styles.sessionDetails}>
                        <h4 className={styles.sessionTitle}>{svc}</h4>
                        <p className={styles.sessionProvider}>with {providerName}</p>
                        <p className={styles.sessionTime}>{formatTime(b.start_time)} - {formatTime(b.end_time)}</p>
                        <div className={styles.sessionStatus}>
                          <span className={styles.statusCanceled}>Canceled</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );

      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className={styles.dashboardSection}>
      {renderContent()}
      <ReviewPopup
        isOpen={reviewModalOpen}
        onClose={handleReviewClose}
        providerName={selectedBooking?.providerName || ''}
        serviceName={selectedBooking?.serviceName || ''}
        onSubmit={handleReviewSubmit}
      />
      {selectedRescheduleBooking && (
        <RescheduleModal
          isOpen={rescheduleModalOpen}
          onClose={() => {
            setRescheduleModalOpen(false);
            setSelectedRescheduleBooking(null);
          }}
          onReschedule={handleRescheduleSubmit}
          providerId={selectedRescheduleBooking.providerId}
          providerName={selectedRescheduleBooking.providerName}
          currentDate={selectedRescheduleBooking.currentDate}
          currentTime={selectedRescheduleBooking.currentTime}
          serviceName={selectedRescheduleBooking.serviceName}
        />
      )}
    </div>
  );
}
