'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { FaCheckCircle, FaTimesCircle, FaStar, FaUser, FaCalendarAlt, FaClock, FaEnvelope, FaPhone } from 'react-icons/fa';
import Swal from 'sweetalert2';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface BookingsProps {
  activeSubmenu: string;
}

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  total_amount: number;
  payment_status: string;
  client_notes?: string;
  provider_notes?: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
}

export default function Bookings({ activeSubmenu }: BookingsProps) {
  const params = useParams();
  const userId = params.userId as string;
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());
  const [cancelling, setCancelling] = useState(false);
  const isMountedRef = useRef(true);

  // Cleanup SweetAlert on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Close any open SweetAlert instances
      try {
        if (Swal.isVisible()) {
          Swal.close();
        }
      } catch (e) {
        // Ignore errors during cleanup
        console.warn('Error closing SweetAlert on unmount:', e);
      }
    };
  }, []);

  // Helper function to safely show SweetAlert
  const safeSwalFire = async (options: any) => {
    if (!isMountedRef.current) return null;
    try {
      return await Swal.fire(options);
    } catch (error) {
      console.error('SweetAlert error:', error);
      return null;
    }
  };

  const loadBookings = async () => {
      try {
        // Clear bookings immediately when switching tabs to prevent showing stale data
        setBookings([]);
        setLoading(true);
        
        const token = localStorage.getItem('token');
        if (!token || !userId) {
          setLoading(false);
          return;
        }

        // Helper function to check if a booking is in the past
        const isPastBooking = (booking: Booking): boolean => {
          const bookingDate = new Date(booking.booking_date);
          const [hours, minutes] = booking.end_time.split(':').map(Number);
          const bookingDateTime = new Date(bookingDate);
          bookingDateTime.setHours(hours, minutes, 0, 0);
          return bookingDateTime < new Date();
        };

        let data: Booking[] = [];
        
        // For past section, we need both completed AND confirmed bookings to filter by date
        if (activeSubmenu === 'past') {
          // Fetch both completed and confirmed bookings
          const [completedRes, confirmedRes] = await Promise.all([
            fetch(`http://localhost:4000/api/bookings/provider/${userId}/completed`, {
              headers: { 'Authorization': `Bearer ${token}` }
            }),
            fetch(`http://localhost:4000/api/bookings/provider/${userId}/confirmed`, {
              headers: { 'Authorization': `Bearer ${token}` }
            })
          ]);
          
          const completedData = completedRes.ok ? await completedRes.json() : [];
          const confirmedData = confirmedRes.ok ? await confirmedRes.json() : [];
          
          // Combine and filter: show completed OR past confirmed bookings
          data = [...completedData, ...confirmedData].filter((booking: Booking) => {
            return booking.status === 'completed' || 
                   (booking.status === 'confirmed' && isPastBooking(booking));
          });
        } else {
          // For other sections, use the original logic
          let url = `http://localhost:4000/api/bookings/provider/${userId}`;
          
          if (activeSubmenu === 'requests') {
            url = `http://localhost:4000/api/bookings/provider/${userId}/pending`;
          } else if (activeSubmenu === 'upcoming') {
            url = `http://localhost:4000/api/bookings/provider/${userId}/confirmed`;
          } else if (activeSubmenu === 'canceled') {
            url = `http://localhost:4000/api/bookings/provider/${userId}/cancelled`;
          }

          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            data = await response.json();
          }
        }

        // Filter and sort bookings based on submenu
        let filtered = data;
        
        if (activeSubmenu === 'upcoming') {
          // For upcoming: only show confirmed bookings that haven't passed yet
          filtered = data.filter((booking: Booking) => {
            return booking.status === 'confirmed' && !isPastBooking(booking);
          });
        }
          
        // Sort bookings: sooner appointments first (by date, then by time)
        // For past, reverse sort (most recent first)
        const sorted = filtered.sort((a: Booking, b: Booking) => {
          // First compare dates
          const dateA = new Date(a.booking_date);
          const dateB = new Date(b.booking_date);
          if (dateA.getTime() !== dateB.getTime()) {
            return activeSubmenu === 'past' 
              ? dateB.getTime() - dateA.getTime()  // Most recent first for past
              : dateA.getTime() - dateB.getTime(); // Soonest first for upcoming
          }
          // If same date, compare start times
          const timeA = a.start_time.split(':').map(Number);
          const timeB = b.start_time.split(':').map(Number);
          const minutesA = timeA[0] * 60 + timeA[1];
          const minutesB = timeB[0] * 60 + timeB[1];
          return activeSubmenu === 'past'
            ? minutesB - minutesA  // Most recent first for past
            : minutesA - minutesB;  // Soonest first for upcoming
        });
        setBookings(sorted);
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    setSelectedBookings(new Set()); // Clear selections when switching tabs
    loadBookings();
    const refresh = () => loadBookings();
    window.addEventListener('refreshBookings', refresh);
    return () => window.removeEventListener('refreshBookings', refresh);
  }, [userId, activeSubmenu]);

  const formatDate = (dateString: string, includeWeekday: boolean = true) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    };
    if (includeWeekday) {
      options.weekday = 'short';
    }
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour12 = parseInt(hours) === 0 ? 12 : parseInt(hours) > 12 ? parseInt(hours) - 12 : parseInt(hours);
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const parseServiceInfo = (providerNotes: string | null) => {
    if (!providerNotes) return null;
    try {
      return JSON.parse(providerNotes);
    } catch (e) {
      return null;
    }
  };

  const formatLocation = (locationType: string | undefined) => {
    if (!locationType) return 'N/A';
    switch (locationType) {
      case 'studio':
        return "Provider's Studio";
      case 'home':
        return 'Come to Me';
      case 'online':
        return 'Online';
      default:
        return locationType;
    }
  };

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedBookings.size === bookings.length) {
      setSelectedBookings(new Set());
    } else {
      setSelectedBookings(new Set(bookings.map(b => b.id)));
    }
  };

  const handleCancelSelected = async () => {
    if (selectedBookings.size === 0) return;

    const result = await safeSwalFire({
      title: 'Cancel Bookings?',
      text: `Are you sure you want to cancel ${selectedBookings.size} booking${selectedBookings.size > 1 ? 's' : ''}? The client will be notified via email.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#8B7355',
      confirmButtonText: 'Yes, cancel them',
      cancelButtonText: 'No, keep them'
    });

    if (!result || !result.isConfirmed) return;

    setCancelling(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        await safeSwalFire({
          icon: 'error',
          title: 'Error',
          text: 'Please log in again',
          confirmButtonColor: '#8B7355'
        });
        return;
      }

      const cancelPromises = Array.from(selectedBookings).map(bookingId =>
        fetch(`http://localhost:4000/api/bookings/${bookingId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: 'cancelled' })
        })
      );

      const results = await Promise.allSettled(cancelPromises);
      const successful = results.filter(r => r.status === 'fulfilled' && r.value.ok).length;
      const failed = results.length - successful;

      if (successful > 0) {
        await safeSwalFire({
          icon: 'success',
          title: 'Bookings Cancelled',
          text: `${successful} booking${successful > 1 ? 's' : ''} cancelled successfully. ${failed > 0 ? `${failed} failed.` : 'Clients have been notified via email.'}`,
          confirmButtonColor: '#8B7355'
        });
        
        setSelectedBookings(new Set());
        window.dispatchEvent(new Event('refreshBookings'));
      } else {
        await safeSwalFire({
          icon: 'error',
          title: 'Cancellation Failed',
          text: 'Failed to cancel bookings. Please try again.',
          confirmButtonColor: '#8B7355'
        });
      }
    } catch (error) {
      console.error('Error cancelling bookings:', error);
      await safeSwalFire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while cancelling bookings.',
        confirmButtonColor: '#8B7355'
      });
    } finally {
      setCancelling(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.historyContent}>
          <h2 className={styles.sectionTitle}>
            {activeSubmenu === 'requests' && 'Booking Requests'}
            {activeSubmenu === 'upcoming' && 'Upcoming Sessions'}
            {activeSubmenu === 'past' && 'Past Sessions'}
            {activeSubmenu === 'canceled' && 'Canceled Sessions'}
          </h2>
          <div className={styles.placeholderText}>
            <p>Loading bookings...</p>
          </div>
        </div>
      );
    }

    if (bookings.length === 0) {
      return (
        <div className={styles.historyContent}>
          <h2 className={styles.sectionTitle}>
            {activeSubmenu === 'requests' && 'Booking Requests'}
            {activeSubmenu === 'upcoming' && 'Upcoming Sessions'}
            {activeSubmenu === 'past' && 'Past Sessions'}
            {activeSubmenu === 'canceled' && 'Canceled Sessions'}
          </h2>
          <div className={styles.placeholderText}>
            <p>
              {activeSubmenu === 'requests' && 'No booking requests at this time.'}
              {activeSubmenu === 'upcoming' && 'No upcoming sessions scheduled.'}
              {activeSubmenu === 'past' && 'No past sessions yet.'}
              {activeSubmenu === 'canceled' && 'No canceled sessions.'}
            </p>
          </div>
        </div>
      );
    }

    if (activeSubmenu === 'upcoming' || activeSubmenu === 'past' || activeSubmenu === 'canceled') {
      // Table format for upcoming, past, and canceled
      return (
        <div className={styles.historyContent}>
          <h2 className={styles.sectionTitle}>
            {activeSubmenu === 'upcoming' && 'Upcoming Sessions'}
            {activeSubmenu === 'past' && 'Past Sessions'}
            {activeSubmenu === 'canceled' && 'Canceled Sessions'}
          </h2>
          {activeSubmenu === 'upcoming' && selectedBookings.size > 0 && (
            <div className={styles.cancelActionsBar}>
              <span className={styles.selectedCount}>
                {selectedBookings.size} booking{selectedBookings.size > 1 ? 's' : ''} selected
              </span>
              <button
                className={styles.cancelBtn}
                onClick={handleCancelSelected}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling...' : 'Cancel Selected'}
              </button>
            </div>
          )}
          <div className={`${styles.bookingsTableWrapper} ${activeSubmenu === 'canceled' ? styles.compactTableWrapper : ''}`}>
            <table className={`${styles.bookingsTable} ${activeSubmenu === 'canceled' ? styles.compactTable : ''}`}>
              <thead>
                <tr>
                  {activeSubmenu === 'upcoming' && <th className={styles.tableHeaderCheckbox}>
                    <input
                      type="checkbox"
                      checked={selectedBookings.size === bookings.length && bookings.length > 0}
                      onChange={handleSelectAll}
                      className={styles.checkbox}
                    />
                  </th>}
                  <th>Date</th>
                  {activeSubmenu !== 'canceled' && <th>Time</th>}
                  <th>Service</th>
                  <th>Client</th>
                  {activeSubmenu !== 'canceled' && <th>Location</th>}
                  <th>Total</th>
                  {(activeSubmenu === 'past' || activeSubmenu === 'canceled') && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const serviceInfo = parseServiceInfo(booking.provider_notes);
                  const addOns = serviceInfo?.add_ons || [];
                  const isSelected = selectedBookings.has(booking.id);
                  return (
                    <tr key={booking.id} className={isSelected ? styles.selectedRow : ''}>
                      {activeSubmenu === 'upcoming' && (
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectBooking(booking.id)}
                            className={styles.checkbox}
                          />
                        </td>
                      )}
                      <td>{formatDate(booking.booking_date, activeSubmenu !== 'past' && activeSubmenu !== 'canceled')}</td>
                      {activeSubmenu !== 'canceled' && <td>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</td>}
                      <td>
                        <div className={styles.serviceName}>{serviceInfo?.name || 'Service'}</div>
                        {activeSubmenu !== 'canceled' && addOns.length > 0 && (
                          <div className={styles.addOnsList}>
                            {addOns.map((addOn: any, idx: number) => (
                              <span key={addOn.id || idx}>
                                + {addOn.name}
                                {idx < addOns.length - 1 ? <br /> : ''}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td>{booking.first_name} {booking.last_name}</td>
                      {activeSubmenu !== 'canceled' && <td>{formatLocation(serviceInfo?.location_type)}</td>}
                      <td>${parseFloat(booking.total_amount).toFixed(2)}</td>
                      {(activeSubmenu === 'past' || activeSubmenu === 'canceled') && (
                        <td>
                          <button 
                            className={styles.secondaryBtn}
                            onClick={() => {
                              // Navigate to messages section
                              const event = new CustomEvent('switchSection', { 
                                detail: { section: 'messages', submenu: 'communication' } 
                              });
                              window.dispatchEvent(event);
                              // Store client info for messaging
                              if (booking.user_id) {
                                localStorage.setItem('messageClientId', booking.user_id);
                                localStorage.setItem('messageClientName', `${booking.first_name} ${booking.last_name}`);
                              }
                            }}
                          >
                            Message Client
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.historyContent}>
        <h2 className={styles.sectionTitle}>
          {activeSubmenu === 'requests' && 'Booking Requests'}
          {activeSubmenu === 'upcoming' && 'Upcoming Sessions'}
          {activeSubmenu === 'past' && 'Past Sessions'}
          {activeSubmenu === 'canceled' && 'Canceled Sessions'}
        </h2>
        
        <div className={styles.bookingsList}>
          {bookings.map((booking) => {
            const serviceInfo = parseServiceInfo(booking.provider_notes);
            
            const showActions = activeSubmenu === 'requests' && booking.status === 'pending';
            const handleStatus = async (newStatus: 'confirmed' | 'cancelled') => {
              try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const resp = await fetch(`http://localhost:4000/api/bookings/${booking.id}/status`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                  body: JSON.stringify({ status: newStatus })
                });
                if (!resp.ok) {
                  const errText = await resp.text().catch(() => '');
                  alert(`Failed to update booking: ${resp.status} ${errText}`);
                  return;
                }
                // reload
                window.dispatchEvent(new Event('refreshBookings'));
                // if accepted, move to upcoming tab
                if (newStatus === 'confirmed') {
                  // Optimistically remove from current list if in requests
                  setBookings(prev => prev.filter(b => b.id !== booking.id));
                  const evt = new CustomEvent('switchSubmenu', { detail: { submenu: 'upcoming' } });
                  window.dispatchEvent(evt);
                }
              } catch (e) {}
            };

            return (
              <div key={booking.id} className={styles.bookingCard}>
                <div className={styles.bookingHeader}>
                  <div className={styles.bookingClient}>
                    <FaUser className={styles.clientIcon} />
                    <div>
                      <h3 className={styles.clientName}>
                        {booking.first_name} {booking.last_name}
                      </h3>
                      {booking.email && (
                        <div className={styles.clientContact}>
                          <FaEnvelope /> {booking.email}
                        </div>
                      )}
                      {booking.phone_number && (
                        <div className={styles.clientContact}>
                          <FaPhone /> {booking.phone_number}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.bookingHeaderRight}>
                    <div className={styles.bookingStatus}>
                      <span className={`${styles.statusBadge} ${styles[booking.status]}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.bookingDetails}>
                  <div className={styles.bookingMeta}>
                    <div className={styles.bookingDate}><FaCalendarAlt /> {formatDate(booking.booking_date)}</div>
                    <div className={styles.bookingTime}><FaClock /> {formatTime(booking.start_time)} - {formatTime(booking.end_time)}</div>
                  </div>
                  {serviceInfo && (
                    <div className={styles.bookingService}>
                      <strong>Service:</strong> {serviceInfo.name} ({booking.duration_minutes} min)
                    </div>
                  )}
                  {serviceInfo?.location_type && (
                    <div className={styles.bookingLocation}>
                      <strong>Location:</strong> {
                        serviceInfo.location_type === 'home' ? 'Client Location' :
                        serviceInfo.location_type === 'studio' ? 'Provider Studio' :
                        serviceInfo.location_type === 'online' ? 'Online' : 'Provider Studio'
                      }
                    </div>
                  )}
                </div>
                
                <div className={styles.bookingAmount}>
                  <strong>Total:</strong> ${parseFloat(booking.total_amount).toFixed(2)} ({booking.payment_status})
                </div>
                
                {booking.client_notes && (
                  <div className={styles.bookingNotes}>
                    <strong>Client Notes:</strong> {booking.client_notes}
                  </div>
                )}

                {showActions && (
                  <div className={styles.bookingFooter}>
                    <div className={styles.bookingActions}>
                      <button className={styles.approveBtn} onClick={() => handleStatus('confirmed')}>Accept</button>
                      <button className={styles.declineBtn} onClick={() => handleStatus('cancelled')}>Decline</button>
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboardSection}>
      {renderContent()}
    </div>
  );
}
