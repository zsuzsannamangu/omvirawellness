'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaCheckCircle, FaTimesCircle, FaStar, FaUser, FaCalendarAlt, FaClock, FaEnvelope, FaPhone } from 'react-icons/fa';
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

  const loadBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId) {
          setLoading(false);
          return;
        }

        let url = `http://localhost:4000/api/bookings/provider/${userId}`;
        
        // Filter by status based on submenu
        if (activeSubmenu === 'requests') {
          url = `http://localhost:4000/api/bookings/provider/${userId}/pending`;
        } else if (activeSubmenu === 'upcoming') {
          url = `http://localhost:4000/api/bookings/provider/${userId}/confirmed`;
        } else if (activeSubmenu === 'past') {
          url = `http://localhost:4000/api/bookings/provider/${userId}/completed`;
        } else if (activeSubmenu === 'canceled') {
          url = `http://localhost:4000/api/bookings/provider/${userId}/cancelled`;
        }

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Sort bookings: sooner appointments first (by date, then by time)
          const sorted = data.sort((a: Booking, b: Booking) => {
            // First compare dates
            const dateA = new Date(a.booking_date);
            const dateB = new Date(b.booking_date);
            if (dateA.getTime() !== dateB.getTime()) {
              return dateA.getTime() - dateB.getTime();
            }
            // If same date, compare start times
            const timeA = a.start_time.split(':').map(Number);
            const timeB = b.start_time.split(':').map(Number);
            const minutesA = timeA[0] * 60 + timeA[1];
            const minutesB = timeB[0] * 60 + timeB[1];
            return minutesA - minutesB;
          });
          setBookings(sorted);
        }
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    loadBookings();
    const refresh = () => loadBookings();
    window.addEventListener('refreshBookings', refresh);
    return () => window.removeEventListener('refreshBookings', refresh);
  }, [userId, activeSubmenu]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
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
      case 'travel':
        return 'On Location';
      case 'online':
        return 'Online';
      default:
        return locationType;
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

    if (activeSubmenu === 'upcoming') {
      // Table format for upcoming
      return (
        <div className={styles.historyContent}>
          <h2 className={styles.sectionTitle}>Upcoming Sessions</h2>
          <div className={styles.bookingsTableWrapper}>
            <table className={styles.bookingsTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Service</th>
                  <th>Client</th>
                  <th>Location</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const serviceInfo = parseServiceInfo(booking.provider_notes);
                  const addOns = serviceInfo?.add_ons || [];
                  return (
                    <tr key={booking.id}>
                      <td>{formatDate(booking.booking_date)}</td>
                      <td>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</td>
                      <td>
                        <div className={styles.serviceName}>{serviceInfo?.name || 'Service'}</div>
                        {addOns.length > 0 && (
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
                      <td>{formatLocation(serviceInfo?.location_type)}</td>
                      <td>${parseFloat(booking.total_amount).toFixed(2)}</td>
                      <td>
                        <button className={styles.secondaryBtn}>Message Client</button>
                      </td>
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
                        serviceInfo.location_type === 'travel' ? 'On Location' :
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
