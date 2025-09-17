'use client';

import { useState } from 'react';
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

export default function AvailabilityManager() {
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([
    {
      id: '1',
      date: '2024-12-05',
      time: '09:00',
      duration: 60,
      isRecurring: false,
      type: 'available',
      notes: 'Morning yoga session'
    },
    {
      id: '2',
      date: '2024-12-05',
      time: '14:00',
      duration: 90,
      isRecurring: false,
      type: 'available',
      notes: 'Afternoon deep stretch'
    },
    {
      id: '3',
      date: '2024-12-08',
      time: '10:00',
      duration: 60,
      isRecurring: false,
      type: 'available',
      notes: 'Sunday morning class'
    },
    {
      id: '4',
      date: '2024-12-09',
      time: '16:00',
      duration: 60,
      isRecurring: true,
      recurringPattern: {
        frequency: 'weekly',
        daysOfWeek: [1], // Monday
        occurrences: 8
      },
      type: 'available',
      notes: 'Monday 4pm for 8 weeks'
    },
    {
      id: '5',
      date: '2024-12-10',
      time: '18:00',
      duration: 75,
      isRecurring: true,
      recurringPattern: {
        frequency: 'weekly',
        daysOfWeek: [2], // Tuesday
        occurrences: 6
      },
      type: 'available',
      notes: 'Tuesday evening class'
    },
    {
      id: '6',
      date: '2024-12-12',
      time: '12:00',
      duration: 45,
      isRecurring: true,
      recurringPattern: {
        frequency: 'weekly',
        daysOfWeek: [4], // Thursday
        occurrences: 4
      },
      type: 'available',
      notes: 'Lunch break yoga'
    },
    {
      id: '7',
      date: '2024-12-15',
      time: '08:00',
      duration: 60,
      isRecurring: false,
      type: 'available',
      notes: 'Early morning session'
    },
    {
      id: '8',
      date: '2024-12-15',
      time: '19:30',
      duration: 90,
      isRecurring: false,
      type: 'available',
      notes: 'Evening restorative yoga'
    },
    {
      id: '9',
      date: '2024-12-16',
      time: '16:00',
      duration: 60,
      isRecurring: true,
      recurringPattern: {
        frequency: 'weekly',
        daysOfWeek: [1], // Monday (recurring)
        occurrences: 8
      },
      type: 'available',
      notes: 'Monday 4pm for 8 weeks'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
  const [showCalendarView, setShowCalendarView] = useState(false);

  const addAvailabilitySlot = (slot: Omit<AvailabilitySlot, 'id'>) => {
    const newSlot: AvailabilitySlot = {
      ...slot,
      id: Date.now().toString()
    };
    setAvailabilitySlots([...availabilitySlots, newSlot]);
    setShowAddForm(false);
  };

  const updateAvailabilitySlot = (id: string, updates: Partial<AvailabilitySlot>) => {
    setAvailabilitySlots(availabilitySlots.map(slot => 
      slot.id === id ? { ...slot, ...updates } : slot
    ));
    setEditingSlot(null);
  };

  const deleteAvailabilitySlot = (id: string) => {
    setAvailabilitySlots(availabilitySlots.filter(slot => slot.id !== id));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
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

  const getRecurringDescription = (pattern: AvailabilitySlot['recurringPattern']) => {
    if (!pattern) return '';
    
    if (pattern.frequency === 'weekly') {
      const days = pattern.daysOfWeek?.map(day => 
        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]
      ).join(', ');
      return `Every ${days}${pattern.occurrences ? ` for ${pattern.occurrences} weeks` : ''}`;
    }
    
    return pattern.frequency === 'daily' ? 'Daily' : '';
  };

  return (
    <div className={styles.availabilityManager}>
      <div className={styles.header}>
        <h2 className={styles.title}>Availability Management</h2>
        <p className={styles.subtitle}>
          Manage your availability with both one-time slots and recurring patterns. 
          This gives you flexibility while reducing manual scheduling work.
        </p>
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
                .filter(slot => !slot.isRecurring)
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
                .filter(slot => slot.isRecurring)
                .map(slot => (
                  <div key={slot.id} className={styles.slotCard}>
                    <div className={styles.slotInfo}>
                      <h4 className={styles.slotDate}>
                        Starting {formatDate(slot.date)}
                      </h4>
                      <p className={styles.slotTime}>
                        {formatTime(slot.time)} • {slot.duration} minutes
                      </p>
                      <p className={styles.recurringPattern}>
                        {getRecurringDescription(slot.recurringPattern)}
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
          onSave={(updates) => updateAvailabilitySlot(editingSlot.id, updates)}
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
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 11, 1)); // December 2024
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

  // Check if a date has availability
  const hasAvailability = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    
    // Check for one-time availability
    const hasOneTime = availabilitySlots.some(slot => 
      !slot.isRecurring && slot.date === dateString
    );

    // Check for recurring availability
    const hasRecurring = availabilitySlots.some(slot => {
      if (!slot.isRecurring || !slot.recurringPattern) return false;
      
      const slotDate = new Date(slot.date);
      const dayOfWeek = date.getDay();
      
      if (slot.recurringPattern.frequency === 'weekly') {
        return slot.recurringPattern.daysOfWeek?.includes(dayOfWeek) &&
               date >= slotDate;
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
    const slots = availabilitySlots.filter(slot => {
      if (!slot.isRecurring) {
        // One-time availability - exact date match
        return slot.date === dateString;
      } else {
        // Recurring availability - check if date matches pattern
        const slotDate = new Date(slot.date);
        const selectedDate = new Date(dateString);
        const dayOfWeek = selectedDate.getDay();
        
        if (slot.recurringPattern?.frequency === 'weekly') {
          return slot.recurringPattern.daysOfWeek?.includes(dayOfWeek) &&
                 selectedDate >= slotDate;
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
    const dateString = date.toISOString().split('T')[0];
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
                    selectedDate === day.toISOString().split('T')[0] ? styles.selected : ''
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
            Available Times for {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
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
  onSave: (slot: AvailabilitySlot | Partial<AvailabilitySlot>) => void;
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
      occurrences: slot?.recurringPattern?.occurrences || 4,
      endDate: slot?.recurringPattern?.endDate || ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const slotData = {
      ...formData,
      recurringPattern: formData.isRecurring ? formData.recurringPattern : undefined
    };
    
    onSave(slotData);
  };

  const handleDayToggle = (day: number) => {
    const daysOfWeek = formData.recurringPattern.daysOfWeek;
    const newDays = daysOfWeek.includes(day)
      ? daysOfWeek.filter(d => d !== day)
      : [...daysOfWeek, day];
    
    setFormData({
      ...formData,
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
                  <label className={styles.formLabel}>Number of Occurrences</label>
                  <input
                    type="number"
                    value={formData.recurringPattern.occurrences}
                    onChange={(e) => setFormData({
                      ...formData,
                      recurringPattern: {
                        ...formData.recurringPattern,
                        occurrences: parseInt(e.target.value)
                      }
                    })}
                    className={styles.formInput}
                    min="1"
                    max="52"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>End Date (optional)</label>
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

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              {slot ? 'Update' : 'Add'} Availability
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
