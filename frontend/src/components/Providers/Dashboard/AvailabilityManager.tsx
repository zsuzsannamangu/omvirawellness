'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaPlus, FaEdit, FaTrash, FaClock, FaCalendarAlt, FaRedo, FaTimes } from 'react-icons/fa';
import styles from '@/styles/Providers/AvailabilityManager.module.scss';

interface AvailabilitySlot {
  id: string;
  date: string;
  time: string;
  duration: number; // in minutes
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'weekly' | 'daily';
    daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
    endDate?: string;
    occurrences?: number;
  };
  type: 'available' | 'blocked';
  notes?: string;
}

// Normalize any incoming date string (including ISO) to local YYYY-MM-DD
const normalizeDateString = (value: string): string => {
  // If it's already YYYY-MM-DD, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  // Otherwise, parse and format in local time
  const d = new Date(value);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export default function AvailabilityManager() {
  const params = useParams();
  const userId = params.userId as string;
  
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load availability from database
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId) return;

        const response = await fetch(`http://localhost:4000/api/providers/${userId}/availability`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const slots = (data.availability || []).map((slot: any) => {
            const normalized: any = { ...slot, date: normalizeDateString(slot.date) };
            if (slot.recurringPattern) {
              normalized.recurringPattern = {
                ...slot.recurringPattern,
                endDate: slot.recurringPattern.endDate
                  ? normalizeDateString(slot.recurringPattern.endDate)
                  : undefined,
              };
            }
            return normalized as AvailabilitySlot;
          });
          setAvailabilitySlots(slots);
        }
      } catch (error) {
        console.error('Error loading availability:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAvailability();
  }, [userId]);

  // Save availability to database
  const saveAvailability = async (slots: AvailabilitySlot[]) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      setSaving(true);

      const response = await fetch(`http://localhost:4000/api/providers/${userId}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          availability: slots.map((s) => ({
            ...s,
            date: normalizeDateString(s.date),
            recurringPattern: s.isRecurring && s.recurringPattern
              ? {
                  ...s.recurringPattern,
                  endDate: s.recurringPattern.endDate
                    ? normalizeDateString(s.recurringPattern.endDate)
                    : undefined,
                }
              : undefined,
          })),
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save availability');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error saving availability:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const addAvailabilitySlot = async (slot: Omit<AvailabilitySlot, 'id'>) => {
    const newSlot: AvailabilitySlot = {
      ...slot,
      id: Date.now().toString(),
      date: normalizeDateString(slot.date) // Normalize date when adding
    };
    const updatedSlots = [...availabilitySlots, newSlot];
    setAvailabilitySlots(updatedSlots);
    setShowAddForm(false);
    
    // Save to database
    try {
      await saveAvailability(updatedSlots);
    } catch (error: any) {
      alert(`Error saving: ${error.message}`);
      // Revert on error
      setAvailabilitySlots(availabilitySlots);
    }
  };

  const updateAvailabilitySlot = async (id: string, slot: AvailabilitySlot) => {
    const normalizedSlot = {
      ...slot,
      date: normalizeDateString(slot.date) // Normalize date when updating
    };
    const updatedSlots = availabilitySlots.map(s => 
      s.id === id ? normalizedSlot : s
    );
    setAvailabilitySlots(updatedSlots);
    setEditingSlot(null);
    
    // Save to database
    try {
      await saveAvailability(updatedSlots);
    } catch (error: any) {
      alert(`Error saving: ${error.message}`);
      // Revert on error
      setAvailabilitySlots(availabilitySlots);
      setEditingSlot(availabilitySlots.find(s => s.id === id) || null);
    }
  };

  const deleteAvailabilitySlot = async (id: string) => {
    if (!confirm('Are you sure you want to delete this availability slot?')) {
      return;
    }
    
    const updatedSlots = availabilitySlots.filter(slot => slot.id !== id);
    setAvailabilitySlots(updatedSlots);
    
    // Save to database
    try {
      await saveAvailability(updatedSlots);
    } catch (error: any) {
      alert(`Error deleting: ${error.message}`);
      // Revert on error
      setAvailabilitySlots(availabilitySlots);
    }
  };

  const formatDate = (dateString: string) => {
    // Parse date string (YYYY-MM-DD) as local date to avoid timezone issues
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

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format as "the week of Month Day" (no weekday)
  const formatWeekOf = (dateString: string) => {
    const normalized = normalizeDateString(dateString);
    const [y, m, d] = normalized.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const md = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    return `the week of ${md}`;
  };

  const getRecurringDescription = (pattern: AvailabilitySlot['recurringPattern'], slotDate: string) => {
    if (!pattern) return '';
    
    if (pattern.frequency === 'weekly') {
      const days = pattern.daysOfWeek?.map(day => 
        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]
      ).join(', ');

      // Format "week of {Month Day}" using the chosen start date
      const [year, month, day] = slotDate.split('-').map(Number);
      const startDate = new Date(year, month - 1, day);
      const formattedStart = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

      return `Repeating every ${days}`;
    }
    
    return pattern.frequency === 'daily' ? 'Daily' : '';
  };

  if (loading) {
    return (
      <div className={styles.availabilityManager}>
        <div className={styles.header}>
          <h2 className={styles.title}>Availability Management</h2>
          <p className={styles.subtitle}>Loading availability...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.availabilityManager}>
      <div className={styles.header}>
        <h2 className={styles.title}>Availability Management</h2>
        <p className={styles.subtitle}>
          Manage your availability with both one-time slots and recurring patterns. 
          This gives you flexibility while reducing manual scheduling work.
        </p>
        {saving && <p style={{ color: '#27ab81', marginTop: '8px' }}>Saving...</p>}
      </div>

      <div className={styles.quickActions}>
        <button 
          className={styles.quickActionBtn}
          onClick={() => setShowAddForm(true)}
        >
          <FaPlus /> Add Availability
        </button>
        <button 
          className={`${styles.quickActionBtn} ${showCalendarView ? styles.active : ''}`}
          onClick={() => setShowCalendarView(!showCalendarView)}
        >
          <FaCalendarAlt /> {showCalendarView ? 'List View' : 'Calendar View'}
        </button>
      </div>

      {showCalendarView ? (
        <AvailabilityCalendar 
          availabilitySlots={availabilitySlots} 
          onBackToList={() => setShowCalendarView(false)}
        />
      ) : (
        <div className={styles.availabilityGrid}>
          <div className={styles.oneTimeSlots}>
            <h3 className={styles.sectionTitle}>
              <FaClock /> One-Time Availability
            </h3>
            <div className={styles.slotsList}>
              {availabilitySlots
                .filter(slot => !slot.isRecurring && (!(slot as any).type || (slot as any).type === 'available'))
                .map(slot => (
                  <div key={slot.id} className={styles.slotCard}>
                    <div className={styles.slotInfo}>
                      <h4 className={styles.slotDate}>{formatDate(slot.date)}</h4>
                      <p className={styles.slotTime}>
                        {formatTime(slot.time)} • {slot.duration} minutes
                      </p>
                      {slot.notes && (
                        <p className={styles.slotNotes}>{slot.notes}</p>
                      )}
                    </div>
                    <div className={styles.slotActions}>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => setEditingSlot(slot)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => deleteAvailabilitySlot(slot.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className={styles.recurringSlots}>
            <h3 className={styles.sectionTitle}>
              <FaRedo /> Recurring Availability
            </h3>
            <div className={styles.slotsList}>
              {availabilitySlots
                .filter(slot => slot.isRecurring && (!(slot as any).type || (slot as any).type === 'available'))
                .map(slot => (
                  <div key={slot.id} className={styles.slotCard}>
                    <div className={styles.slotInfo}>
                      <h4 className={styles.slotDate}>
                        Starting {formatWeekOf(slot.date)}
                      </h4>
                      <p className={styles.slotTime}>
                        {formatTime(slot.time)} • {slot.duration} minutes
                      </p>
                      <p className={styles.recurringPattern}>
                        {getRecurringDescription(slot.recurringPattern, slot.date)}
                      </p>
                      {slot.notes && (
                        <p className={styles.slotNotes}>{slot.notes}</p>
                      )}
                    </div>
                    <div className={styles.slotActions}>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => setEditingSlot(slot)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => deleteAvailabilitySlot(slot.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <AvailabilityForm
          onSave={addAvailabilitySlot}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingSlot && (
        <AvailabilityForm
          slot={editingSlot}
          onSave={async (slotData) => {
            const fullSlot: AvailabilitySlot = {
              ...slotData,
              id: editingSlot.id
            };
            await updateAvailabilitySlot(editingSlot.id, fullSlot);
          }}
          onCancel={() => setEditingSlot(null)}
        />
      )}
    </div>
  );
}

interface AvailabilityCalendarProps {
  availabilitySlots: AvailabilitySlot[];
  onBackToList: () => void;
}

function AvailabilityCalendar({ availabilitySlots, onBackToList }: AvailabilityCalendarProps) {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  // Format date as YYYY-MM-DD in local timezone
  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if a date has availability
  const hasAvailability = (date: Date) => {
    const dateString = formatDateString(date);
    
    // First, collect all blocked slots for this date
    const blockedSlotsForDate = new Set<string>();
    availabilitySlots.forEach(slot => {
      if ((slot as any).type === 'blocked') {
        const normalizedSlotDate = normalizeDateString(slot.date);
        if (normalizedSlotDate === dateString) {
          const normalizedTime = String(slot.time).slice(0, 5); // Get HH:MM format
          blockedSlotsForDate.add(normalizedTime);
        }
      }
    });
    
    // Check for one-time availability (normalize slot dates before comparison)
    const hasOneTime = availabilitySlots.some(slot => {
      if (!slot.isRecurring) {
        if ((slot as any).type && (slot as any).type !== 'available') return false;
        const normalizedSlotDate = normalizeDateString(slot.date);
        if (normalizedSlotDate !== dateString) return false;
        // Check if this time slot is blocked
        const normalizedTime = String(slot.time).slice(0, 5);
        return !blockedSlotsForDate.has(normalizedTime);
      }
      return false;
    });

    // Check for recurring availability
    const hasRecurring = availabilitySlots.some(slot => {
      if (!slot.isRecurring || !slot.recurringPattern) return false;
      if ((slot as any).type && (slot as any).type !== 'available') return false;
      
      // Normalize and parse slot date as local date (YYYY-MM-DD format)
      const normalizedSlotDateStr = normalizeDateString(slot.date);
      const [slotYear, slotMonth, slotDay] = normalizedSlotDateStr.split('-').map(Number);
      const slotDate = new Date(slotYear, slotMonth - 1, slotDay);
      const dayOfWeek = date.getDay();
      
      // Check end date limit
      if (slot.recurringPattern.endDate) {
        const normalizedEndDateStr = normalizeDateString(slot.recurringPattern.endDate);
        const [endYear, endMonth, endDay] = normalizedEndDateStr.split('-').map(Number);
        const endDate = new Date(endYear, endMonth - 1, endDay);
        if (date > endDate) return false;
      }
    
      if (slot.recurringPattern.frequency === 'weekly') {
        if (!slot.recurringPattern.daysOfWeek?.includes(dayOfWeek) || date < slotDate) {
          return false;
        }
        
        // Check if this specific time slot is blocked for this date
        const normalizedTime = String(slot.time).slice(0, 5);
        if (blockedSlotsForDate.has(normalizedTime)) {
          return false; // This time is blocked, but check other recurring slots
        }
        
        return true;
      }
    
      return false;
    });

    return hasOneTime || hasRecurring;
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

  // Get available time slots for a selected date
  const getAvailableTimeSlots = (dateString: string) => {
    // Parse selected date string as local date
    const [year, month, day] = dateString.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const selectedDayOfWeek = selectedDate.getDay();
    
    // First, collect all blocked slots for this date
    const blockedSlotsForDate = new Set<string>();
    availabilitySlots.forEach(slot => {
      if ((slot as any).type === 'blocked') {
        const normalizedSlotDate = normalizeDateString(slot.date);
        if (normalizedSlotDate === dateString) {
          const normalizedTime = String(slot.time).slice(0, 5); // Get HH:MM format
          blockedSlotsForDate.add(normalizedTime);
        }
      }
    });
    
    const slots = availabilitySlots.filter(slot => {
      if (!slot.isRecurring) {
        // One-time availability - exact date match (normalize both dates)
        if ((slot as any).type && (slot as any).type !== 'available') return false;
        const normalizedSlotDate = normalizeDateString(slot.date);
        if (normalizedSlotDate !== dateString) return false;
        // Check if this time slot is blocked
        const normalizedTime = String(slot.time).slice(0, 5);
        return !blockedSlotsForDate.has(normalizedTime);
      } else {
        // Recurring availability - check if date matches pattern
        // Normalize and parse slot date as local date (YYYY-MM-DD format)
        if ((slot as any).type && (slot as any).type !== 'available') return false;
        const normalizedSlotDateStr = normalizeDateString(slot.date);
        const [slotYear, slotMonth, slotDay] = normalizedSlotDateStr.split('-').map(Number);
        const slotDate = new Date(slotYear, slotMonth - 1, slotDay);
        
        if (slot.recurringPattern?.frequency === 'weekly') {
          if (!slot.recurringPattern.daysOfWeek?.includes(selectedDayOfWeek) || selectedDate < slotDate) {
            return false;
          }
          
          // Check end date limit
          if (slot.recurringPattern.endDate) {
            const normalizedEndDateStr = normalizeDateString(slot.recurringPattern.endDate);
            const [endYear, endMonth, endDay] = normalizedEndDateStr.split('-').map(Number);
            const endDate = new Date(endYear, endMonth - 1, endDay);
            if (selectedDate > endDate) return false;
          }
          
          // Check if this specific time slot is blocked for this date
          const normalizedTime = String(slot.time).slice(0, 5);
          if (blockedSlotsForDate.has(normalizedTime)) {
            return false; // This time is blocked, exclude it
          }
          
          return true;
        }
        
        return false;
      }
    });

    return slots.map(slot => ({
      time: slot.time,
      duration: slot.duration,
      isRecurring: slot.isRecurring
    }));
  };

  const handleDateClick = (date: Date) => {
    const dateString = formatDateString(date);
    const hasSlots = hasAvailability(date);
    
    if (hasSlots) {
      setSelectedDate(selectedDate === dateString ? null : dateString);
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const calendarDays = getCalendarDays();

  return (
    <div className={styles.availabilityCalendar}>
      <div className={styles.calendarHeader}>
        <h2 className={styles.calendarViewTitle}>Calendar View</h2>
        <button 
          className={styles.backToListBtn}
          onClick={onBackToList}
        >
          <FaEdit /> Edit
        </button>
      </div>
      
      <div className={styles.calendarContainer}>
        <div className={styles.calendarNavHeader}>
          <button 
            className={styles.calendarNav}
            onClick={() => navigateMonth('prev')}
          >
            ‹
          </button>
          <h3 className={styles.calendarMonth}>
            {formatMonthYear(currentMonth)}
          </h3>
          <button 
            className={styles.calendarNav}
            onClick={() => navigateMonth('next')}
          >
            ›
          </button>
        </div>
        
        <div className={styles.calendarGrid}>
          <div className={styles.calendarWeekdays}>
            <div className={styles.weekday}>Sun</div>
            <div className={styles.weekday}>Mon</div>
            <div className={styles.weekday}>Tue</div>
            <div className={styles.weekday}>Wed</div>
            <div className={styles.weekday}>Thu</div>
            <div className={styles.weekday}>Fri</div>
            <div className={styles.weekday}>Sat</div>
          </div>
          
          <div className={styles.calendarDays}>
            {calendarDays.map((day, index) => {
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const hasAvailableSlots = hasAvailability(day);
              
              return (
                <div 
                  key={index}
                  className={`${styles.calendarDay} ${
                    !isCurrentMonth ? styles.otherMonth : ''
                  } ${
                    hasAvailableSlots ? styles.hasAvailability : ''
                  } ${
                    selectedDate === formatDateString(day) ? styles.selected : ''
                  }`}
                  onClick={() => handleDateClick(day)}
                >
                  {day.getDate()}
                  {hasAvailableSlots && (
                    <div className={styles.availabilityDot}></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className={styles.calendarLegend}>
        <div className={styles.legendItem}>
          <div className={styles.legendDot}></div>
          <span>Available appointment slots</span>
        </div>
      </div>

      {selectedDate && (
        <div className={styles.timeSlotsSection}>
          <h3 className={styles.timeSlotsTitle}>
            Available Times for {(() => {
              const [year, month, day] = selectedDate.split('-').map(Number);
              const date = new Date(year, month - 1, day);
              return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              });
            })()}
          </h3>
          <div className={styles.timeSlotsList}>
            {getAvailableTimeSlots(selectedDate).map((slot, index) => (
              <div key={index} className={styles.timeSlot}>
                <span className={styles.timeSlotTime}>{formatTime(slot.time)}</span>
                <span className={styles.timeSlotDuration}>{slot.duration} min</span>
                {slot.isRecurring && (
                  <span className={styles.timeSlotRecurring}>Recurring</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface AvailabilityFormProps {
  slot?: AvailabilitySlot;
  onSave: (slot: Omit<AvailabilitySlot, 'id'>) => void | Promise<void>;
  onCancel: () => void;
}

function AvailabilityForm({ slot, onSave, onCancel }: AvailabilityFormProps) {
  const [formData, setFormData] = useState({
    date: slot?.date || '',
    time: slot?.time || '',
    duration: slot?.duration || 60,
    isRecurring: slot?.isRecurring || false,
    type: slot?.type || 'available',
    notes: slot?.notes || '',
    recurringPattern: {
      frequency: slot?.recurringPattern?.frequency || 'weekly',
      daysOfWeek: slot?.recurringPattern?.daysOfWeek || [],
      endDate: slot?.recurringPattern?.endDate || ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Require at least one day when recurring weekly
    if (
      formData.isRecurring &&
      formData.recurringPattern.frequency === 'weekly' &&
      (!formData.recurringPattern.daysOfWeek || formData.recurringPattern.daysOfWeek.length === 0)
    ) {
      alert('Please select at least one day for recurring availability.');
      return;
    }
    
    const slotData: Omit<AvailabilitySlot, 'id'> = {
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      isRecurring: formData.isRecurring,
      recurringPattern: formData.isRecurring ? {
        ...formData.recurringPattern,
        occurrences: undefined // Don't save occurrences, only use endDate
      } : undefined,
      type: formData.type,
      notes: formData.notes || undefined
    };
    
    onSave(slotData);
  };

  const handleDayToggle = (day: number) => {
    const daysOfWeek = formData.recurringPattern.daysOfWeek;
    const newDays = daysOfWeek.includes(day)
      ? daysOfWeek.filter(d => d !== day)
      : [...daysOfWeek, day];
    
    // If we have a date and recurring days selected, adjust date to match first selected day
    let adjustedDate = formData.date;
    if (formData.date && newDays.length > 0) {
      const [year, month, dayNum] = formData.date.split('-').map(Number);
      const currentDate = new Date(year, month - 1, dayNum);
      const currentDayOfWeek = currentDate.getDay();
      
      // If current date's day of week is not in selected days, find next occurrence
      if (!newDays.includes(currentDayOfWeek)) {
        const nextDay = newDays[0]; // Use first selected day
        let daysUntilNext = (nextDay - currentDayOfWeek + 7) % 7;
        if (daysUntilNext === 0) daysUntilNext = 7; // If same day, go to next week
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + daysUntilNext);
        
        const adjustedYear = nextDate.getFullYear();
        const adjustedMonth = String(nextDate.getMonth() + 1).padStart(2, '0');
        const adjustedDay = String(nextDate.getDate()).padStart(2, '0');
        adjustedDate = `${adjustedYear}-${adjustedMonth}-${adjustedDay}`;
      }
    }
    
    setFormData({
      ...formData,
      date: adjustedDate,
      recurringPattern: {
        ...formData.recurringPattern,
        daysOfWeek: newDays
      }
    });
  };

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>{slot ? 'Edit Availability' : 'Add Availability'}</h3>
          <button className={styles.closeBtn} onClick={onCancel}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.availabilityForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Duration (minutes)</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className={styles.formSelect}
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>120 minutes</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                className={styles.checkbox}
              />
              Make this recurring
            </label>
          </div>

          {formData.isRecurring && (
            <div className={styles.recurringSection}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Repeat Pattern</label>
                <select
                  value={formData.recurringPattern.frequency}
                  onChange={(e) => setFormData({
                    ...formData,
                    recurringPattern: {
                      ...formData.recurringPattern,
                      frequency: e.target.value as 'weekly' | 'daily'
                    }
                  })}
                  className={styles.formSelect}
                >
                  <option value="weekly">Weekly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>

              {formData.recurringPattern.frequency === 'weekly' && (
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Days of Week</label>
                  <div className={styles.daysSelector}>
                    {daysOfWeek.map(day => (
                      <button
                        key={day.value}
                        type="button"
                        className={`${styles.dayButton} ${
                          formData.recurringPattern.daysOfWeek.includes(day.value) ? styles.selected : ''
                        }`}
                        onClick={() => handleDayToggle(day.value)}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.formRowTwoCol}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>End Date</label>
                  <input
                    type="date"
                    value={formData.recurringPattern.endDate}
                    onChange={(e) => setFormData({
                      ...formData,
                      recurringPattern: {
                        ...formData.recurringPattern,
                        endDate: e.target.value
                      }
                    })}
                    className={styles.formInput}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className={styles.formTextarea}
              rows={2}
              placeholder="Add any notes about this availability slot..."
            />
          </div>

          {(() => {
            const isDisabled = !formData.date ||
              !formData.time ||
              (formData.isRecurring &&
                formData.recurringPattern.frequency === 'weekly' &&
                (!formData.recurringPattern.daysOfWeek || formData.recurringPattern.daysOfWeek.length === 0));
            
            let validationMessage = '';
            if (isDisabled) {
              if (!formData.date) {
                validationMessage = 'Please select a date';
              } else if (!formData.time) {
                validationMessage = 'Please select a time';
              } else if (formData.isRecurring &&
                formData.recurringPattern.frequency === 'weekly' &&
                (!formData.recurringPattern.daysOfWeek || formData.recurringPattern.daysOfWeek.length === 0)) {
                validationMessage = 'Please select at least one day for recurring availability';
              }
            }
            
            return (
              <>
                {validationMessage && (
                  <div style={{ 
                    color: '#6C4F70', 
                    fontSize: '0.85rem', 
                    marginBottom: '12px',
                    padding: '10px 14px',
                    backgroundColor: '#F5F0E8',
                    borderRadius: '6px',
                    border: '1px solid #A67873'
                  }}>
                    {validationMessage}
                  </div>
                )}
                <div className={styles.formActions}>
                  <button type="button" className={styles.cancelBtn} onClick={onCancel}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.saveBtn}
                    disabled={isDisabled}
                  >
                    {slot ? 'Update' : 'Add'} Availability
                  </button>
                </div>
              </>
            );
          })()}
        </form>
      </div>
    </div>
  );
}
