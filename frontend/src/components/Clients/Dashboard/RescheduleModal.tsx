'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/Clients/Dashboard.module.scss';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (newDate: string, newTime: string) => Promise<void>;
  providerId: string;
  providerName: string;
  currentDate: string;
  currentTime: string;
  serviceName: string;
}

export default function RescheduleModal({
  isOpen,
  onClose,
  onReschedule,
  providerId,
  providerName,
  currentDate,
  currentTime,
  serviceName
}: RescheduleModalProps) {
  const [availability, setAvailability] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && providerId) {
      loadAvailability();
    }
  }, [isOpen, providerId]);

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/providers/${providerId}/availability`);
      if (response.ok) {
        const data = await response.json();
        const availData = data.availability || [];
        console.log('Loaded availability:', availData);
        
        // Transform availability similar to provider detail page
        const transformed = transformAvailabilityForReschedule(availData);
        console.log('Transformed availability:', transformed);
        setAvailability(transformed);
      } else {
        console.error('Failed to load availability:', response.status);
      }
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform availability slots to a format we can easily check
  const transformAvailabilityForReschedule = (slots: any[]): { [key: string]: string[] } => {
    if (!slots || !Array.isArray(slots) || slots.length === 0) {
      return {};
    }

    const availability: { [key: string]: string[] } = {};
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 6);

    // First, collect all blocked slots
    const blockedSlots = new Set<string>();
    slots.forEach((slot) => {
      if (slot.type === 'blocked' && slot.date && slot.time) {
        const normalizedDate = normalizeDateString(slot.date);
        const normalizedTime = String(slot.time).slice(0, 5);
        blockedSlots.add(`${normalizedDate}|${normalizedTime}`);
      }
    });

    slots.forEach((slot) => {
      if (slot.type && slot.type !== 'available') return;
      if (!slot.date || !slot.time) return;

      const normalizedSlotDate = normalizeDateString(slot.date);
      const normalizedTime = String(slot.time).slice(0, 5);

      if (!slot.isRecurring) {
        // One-time slot
        const slotKey = `${normalizedSlotDate}|${normalizedTime}`;
        if (blockedSlots.has(slotKey)) return;
        
        // Only include dates that are today or in the future
        const slotDate = new Date(normalizedSlotDate);
        slotDate.setHours(0, 0, 0, 0);
        if (slotDate >= today) {
          if (!availability[normalizedSlotDate]) {
            availability[normalizedSlotDate] = [];
          }
          availability[normalizedSlotDate].push(normalizedTime);
        }
      } else if (slot.recurringPattern) {
        // Recurring slot - check if it uses day numbers (0-6) or day names
        if (slot.recurringPattern.frequency === 'weekly' && slot.recurringPattern.daysOfWeek) {
          const [slotYear, slotMonth, slotDay] = normalizedSlotDate.split('-').map(Number);
          const startDate = new Date(slotYear, slotMonth - 1, slotDay);
          
          let endDate = maxDate;
          if (slot.recurringPattern.endDate) {
            const normalizedEndDate = normalizeDateString(slot.recurringPattern.endDate);
            const [endYear, endMonth, endDay] = normalizedEndDate.split('-').map(Number);
            const calculatedEndDate = new Date(endYear, endMonth - 1, endDay);
            if (calculatedEndDate < endDate) {
              endDate = calculatedEndDate;
            }
          }

          const currentDate = new Date(startDate);
          while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay();
            const dateStr = formatDateString(currentDate);
            
            // Check if this day matches the pattern (daysOfWeek can be numbers 0-6 or day names)
            let matches = false;
            if (Array.isArray(slot.recurringPattern.daysOfWeek)) {
              matches = slot.recurringPattern.daysOfWeek.some((day: any) => {
                if (typeof day === 'number') {
                  return day === dayOfWeek;
                } else if (typeof day === 'string') {
                  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                  const dayName = dayNames[dayOfWeek].toLowerCase();
                  return day.toLowerCase() === dayName;
                }
                return false;
              });
            }
            
            if (matches) {
              // Only include dates that are today or in the future
              const checkDate = new Date(currentDate);
              checkDate.setHours(0, 0, 0, 0);
              if (checkDate >= today) {
                const slotKey = `${dateStr}|${normalizedTime}`;
                if (!blockedSlots.has(slotKey)) {
                  if (!availability[dateStr]) {
                    availability[dateStr] = [];
                  }
                  availability[dateStr].push(normalizedTime);
                }
              }
            }
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
      }
    });

    // Sort times for each date
    Object.keys(availability).forEach(date => {
      availability[date] = Array.from(new Set(availability[date])).sort();
    });

    return availability;
  };

  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const normalizeDateString = (dateStr: string): string => {
    if (!dateStr) return '';
    // Handle YYYY-MM-DD format directly to avoid timezone issues
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    // For other formats, parse as local date
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return formatDateString(date);
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

  const isDateAvailable = (date: Date): boolean => {
    if (!availability || Object.keys(availability).length === 0) return false;
    const dateString = formatDateString(date);
    const today = formatDateString(new Date());
    
    // Don't show past dates
    if (dateString < today) return false;

    // Check if this date has available time slots
    return availability[dateString] && availability[dateString].length > 0;
  };

  const getAvailableTimes = (dateString: string): string[] => {
    if (!availability || !availability[dateString]) return [];
    
    // Convert 24-hour format to 12-hour format for display
    return availability[dateString].map((time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      return `${hour12}:${String(minutes).padStart(2, '0')} ${ampm}`;
    });
  };

  const handleDateSelect = (date: Date) => {
    const dateString = formatDateString(date);
    if (isDateAvailable(date)) {
      setSelectedDate(dateString);
      setSelectedTime('');
    }
  };

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select a date and time');
      return;
    }

    // Convert 12-hour format back to 24-hour format for API
    const convertTo24Hour = (time12: string): string => {
      const [timePart, period] = time12.split(' ');
      const [hours, minutes] = timePart.split(':').map(Number);
      let hour24 = hours;
      if (period === 'PM' && hours !== 12) {
        hour24 = hours + 12;
      } else if (period === 'AM' && hours === 12) {
        hour24 = 0;
      }
      return `${String(hour24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const time24 = convertTo24Hour(selectedTime);

    setIsSubmitting(true);
    try {
      await onReschedule(selectedDate, time24);
      onClose();
    } catch (error: any) {
      alert(`Error rescheduling: ${error.message || 'Please try again'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const calendarDays = getCalendarDays();
  const availableTimes = selectedDate ? getAvailableTimes(selectedDate) : [];

  return (
    <div className={styles.rescheduleModalOverlay} onClick={onClose}>
      <div className={styles.rescheduleModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.rescheduleModalHeader}>
          <h2>Reschedule Appointment</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.rescheduleModalBody}>
          <div className={styles.rescheduleInfo}>
            <p><strong>Service:</strong> {serviceName}</p>
            <p><strong>Provider:</strong> {providerName}</p>
            <p><strong>Current:</strong> {new Date(currentDate).toLocaleDateString()} at {currentTime}</p>
          </div>

          {loading ? (
            <div className={styles.loadingText}>Loading availability...</div>
          ) : (
            <>
              <div className={styles.rescheduleCalendarSection}>
                <div className={styles.rescheduleCalendarHeader}>
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>
                    ‹
                  </button>
                  <h3>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                  <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>
                    ›
                  </button>
                </div>
                
                <div className={styles.rescheduleCalendarGrid}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className={styles.rescheduleCalendarDayHeader}>{day}</div>
                  ))}
                  {calendarDays.map((date, index) => {
                    const dateString = formatDateString(date);
                    const isAvailable = isDateAvailable(date);
                    const isSelected = selectedDate === dateString;
                    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                    const isToday = dateString === formatDateString(new Date());

                    return (
                      <button
                        key={index}
                        className={`${styles.rescheduleCalendarDay} ${!isCurrentMonth ? styles.otherMonth : ''} ${isAvailable ? styles.available : styles.unavailable} ${isSelected ? styles.selected : ''} ${isToday ? styles.today : ''}`}
                        onClick={() => isAvailable && handleDateSelect(date)}
                        disabled={!isAvailable}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <div className={styles.timeSlotsSection}>
                  <h4>Available Times for {(() => {
                    const [year, month, day] = selectedDate.split('-').map(Number);
                    const date = new Date(year, month - 1, day);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  })()}</h4>
                  {availableTimes.length === 0 ? (
                    <p className={styles.noTimesText}>No available times for this date</p>
                  ) : (
                    <div className={styles.timeSlotsGrid}>
                      {availableTimes.map((time) => (
                        <button
                          key={time}
                          className={`${styles.timeSlot} ${selectedTime === time ? styles.selected : ''}`}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className={styles.rescheduleModalActions}>
          <button className={styles.cancelButton} onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button 
            className={styles.rescheduleButton} 
            onClick={handleReschedule}
            disabled={!selectedDate || !selectedTime || isSubmitting}
          >
            {isSubmitting ? 'Rescheduling...' : 'Reschedule'}
          </button>
        </div>
      </div>
    </div>
  );
}

