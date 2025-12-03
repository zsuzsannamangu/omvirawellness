'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface CalendarProps {
  activeSubmenu: string;
}

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: string;
  total_amount: number;
  payment_status: string;
  client_notes?: string;
  provider_notes?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
}

export default function Calendar({ activeSubmenu }: CalendarProps) {
  const params = useParams();
  const userId = params.userId as string;
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId) return;

        const response = await fetch(`http://localhost:4000/api/bookings/provider/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Filter out canceled appointments
          const activeBookings = data.filter((booking: Booking) => booking.status !== 'cancelled');
          // Sort bookings: sooner appointments first (by date, then by time)
          const sorted = activeBookings.sort((a: Booking, b: Booking) => {
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
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  // Generate calendar days for the current month
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday

    const days = [];
    const currentDate = new Date(startDate);

    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  // Format date as YYYY-MM-DD
  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Normalize date string to YYYY-MM-DD
  const normalizeDateString = (value: string): string => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Check if a date has bookings
  const hasBookings = (date: Date) => {
    const dateString = formatDateString(date);
    return bookings.some(booking => {
      const bookingDate = normalizeDateString(booking.booking_date);
      return bookingDate === dateString;
    });
  };

  // Get bookings for a specific date, sorted by time (sooner first)
  const getBookingsForDate = (dateString: string) => {
    const dateBookings = bookings.filter(booking => {
      const bookingDate = normalizeDateString(booking.booking_date);
      return bookingDate === dateString;
    });
    
    // Sort by start time (sooner first)
    return dateBookings.sort((a, b) => {
      const timeA = a.start_time.split(':').map(Number);
      const timeB = b.start_time.split(':').map(Number);
      const minutesA = timeA[0] * 60 + timeA[1];
      const minutesB = timeB[0] * 60 + timeB[1];
      return minutesA - minutesB;
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    // Handle time string in format HH:MM:SS or HH:MM
    const [hours, minutes] = timeString.split(':').map(Number);
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${String(minutes).padStart(2, '0')} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    const normalized = normalizeDateString(dateString);
    const [year, month, day] = normalized.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
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


  const calendarDays = getCalendarDays();
  const today = new Date();
  const isToday = (date: Date) => {
    return formatDateString(date) === formatDateString(today);
  };

  const renderContent = () => {
    if (activeSubmenu !== 'overview') {
      return (
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Calendar {activeSubmenu}</h2>
          <div className={styles.placeholderText}>
            <p>{activeSubmenu === 'sync' ? 'Calendar sync not yet available.' : 'Select a calendar option from the submenu above.'}</p>
          </div>
        </div>
      );
    }

    if (loading) {
      return (
        <div className={styles.dashboardSection}>
          <h2 className={styles.sectionTitle}>Calendar Overview</h2>
          <div className={styles.placeholderText}>Loading bookings...</div>
        </div>
      );
    }

    return (
      <div className={styles.dashboardSection}>
        <div className={styles.calendarView}>
          <div className={styles.calendarHeader}>
            <h2 className={styles.sectionTitle}>Calendar Overview</h2>
            <div className={styles.calendarNav}>
              <button type="button" onClick={() => navigateMonth('prev')}>
                <FaChevronLeft />
              </button>
              <h3 className={styles.monthYear}>{formatMonthYear(currentMonth)}</h3>
              <button type="button" onClick={() => navigateMonth('next')}>
                <FaChevronRight />
              </button>
            </div>
          </div>

          <div className={styles.calendarGrid}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className={styles.weekday}>{day}</div>
            ))}
            {calendarDays.map((day) => {
              const dateString = formatDateString(day);
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const hasAppointments = hasBookings(day);
              
              return (
                <div
                  key={dateString}
                  className={`${styles.calendarDay} ${!isCurrentMonth ? styles.otherMonth : ''} ${isToday(day) ? styles.today : ''} ${hasAppointments ? styles.hasBookings : ''} ${selectedDate === dateString ? styles.selected : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (hasAppointments) {
                      setSelectedDate(selectedDate === dateString ? null : dateString);
                    }
                  }}
                >
                  <span className={styles.dayNumber}>{day.getDate()}</span>
                  {hasAppointments && (
                    <div className={styles.bookingIndicator}></div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedDate && (
            <div className={styles.selectedDateBookings}>
              <h3 className={styles.dateTitle}>
                Appointments for {formatDate(selectedDate)}
              </h3>
              <div className={styles.bookingsTableWrapper}>
                <table className={styles.bookingsTable}>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Service</th>
                      <th>Client</th>
                      <th>Location</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getBookingsForDate(selectedDate).map(booking => {
                      const serviceInfo = parseServiceInfo(booking.provider_notes);
                      const addOns = serviceInfo?.add_ons || [];
                      return (
                        <tr key={booking.id}>
                          <td>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</td>
                          <td>
                            <div className={styles.serviceName}>{serviceInfo?.name || 'Service'} ({booking.duration_minutes} min)</div>
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
                          <td>${parseFloat(booking.total_amount.toString()).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
