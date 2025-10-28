'use client';

import { useState } from 'react';
import styles from '@/styles/Spaces/SignupSteps.module.scss';

interface AvailabilityStepProps {
  onNext: (data: { availability: any }) => void;
  onBack: () => void;
  initialData: any;
}

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const timeSlots = [
  '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM',
  '10:00 PM'
];

export default function AvailabilityStep({ onNext, onBack, initialData }: AvailabilityStepProps) {
  // Migrate old data format to new format
  const migrateAvailability = (data: any) => {
    const migrated: any = {};
    Object.keys(data || {}).forEach(day => {
      const dayData = data[day];
      if (dayData.timeSlots) {
        // Already in new format
        migrated[day] = dayData;
      } else {
        // Old format - convert to new format
        migrated[day] = {
          isOpen: dayData.isOpen,
          timeSlots: [{ startTime: dayData.startTime || '9:00 AM', endTime: dayData.endTime || '9:00 PM' }]
        };
      }
    });
    return migrated;
  };

  const [availability, setAvailability] = useState(() => {
    const defaultAvailability = {
      Monday: { isOpen: true, timeSlots: [{ startTime: '9:00 AM', endTime: '9:00 PM' }] },
      Tuesday: { isOpen: true, timeSlots: [{ startTime: '9:00 AM', endTime: '9:00 PM' }] },
      Wednesday: { isOpen: true, timeSlots: [{ startTime: '9:00 AM', endTime: '9:00 PM' }] },
      Thursday: { isOpen: true, timeSlots: [{ startTime: '9:00 AM', endTime: '9:00 PM' }] },
      Friday: { isOpen: true, timeSlots: [{ startTime: '9:00 AM', endTime: '9:00 PM' }] },
      Saturday: { isOpen: true, timeSlots: [{ startTime: '9:00 AM', endTime: '9:00 PM' }] },
      Sunday: { isOpen: false, timeSlots: [{ startTime: '9:00 AM', endTime: '9:00 PM' }] }
    };
    
    return migrateAvailability(initialData.availability) || defaultAvailability;
  });

  const handleToggleDay = (day: string) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        isOpen: !availability[day].isOpen
      }
    });
  };

  const handleTimeChange = (day: string, slotIndex: number, timeType: 'startTime' | 'endTime', time: string) => {
    if (!availability[day] || !availability[day].timeSlots || slotIndex >= availability[day].timeSlots.length) {
      return;
    }
    
    const newTimeSlots = [...availability[day].timeSlots];
    newTimeSlots[slotIndex] = {
      ...newTimeSlots[slotIndex],
      [timeType]: time
    };
    
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        timeSlots: newTimeSlots
      }
    });
  };

  const addTimeSlot = (day: string) => {
    if (!availability[day] || !availability[day].timeSlots) {
      return;
    }
    
    const newTimeSlots = [...availability[day].timeSlots, { startTime: '9:00 AM', endTime: '5:00 PM' }];
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        timeSlots: newTimeSlots
      }
    });
  };

  const removeTimeSlot = (day: string, slotIndex: number) => {
    if (!availability[day] || !availability[day].timeSlots || availability[day].timeSlots.length <= 1) {
      return;
    }
    
    const newTimeSlots = availability[day].timeSlots.filter((_, index) => index !== slotIndex);
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        timeSlots: newTimeSlots
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ availability });
  };

  return (
    <div className={styles.stepContent}>
      <h1 className={styles.title}>When is your space available?</h1>
      <p className={styles.subtitle}>Set your availability so guests know when they can book.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.hoursContainer}>
          {daysOfWeek.map((day) => {
            const dayHours = availability[day];
            if (!dayHours) return null;
            
            return (
              <div key={day} className={styles.dayRow}>
                <div className={styles.dayInfo}>
                  <div className={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      id={`checkbox-${day}`}
                      checked={dayHours.isOpen}
                      onChange={() => handleToggleDay(day)}
                      className={styles.dayCheckbox}
                    />
                  </div>
                  <span className={styles.dayName}>{day}</span>
                  {!dayHours.isOpen && (
                    <span className={styles.closedText}>Closed</span>
                  )}
                </div>
                
                {dayHours.isOpen && dayHours.timeSlots && dayHours.timeSlots.length > 0 && (
                  <div className={styles.dayContent}>
                    <div className={styles.firstTimeSlotRow}>
                      <div className={styles.timeSelectors}>
                        <select
                          value={dayHours.timeSlots[0].startTime}
                          onChange={(e) => handleTimeChange(day, 0, 'startTime', e.target.value)}
                          className={styles.timeSelect}
                        >
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                        
                        <span className={styles.timeSeparator}>to</span>
                        
                        <select
                          value={dayHours.timeSlots[0].endTime}
                          onChange={(e) => handleTimeChange(day, 0, 'endTime', e.target.value)}
                          className={styles.timeSelect}
                        >
                          {timeSlots.map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => addTimeSlot(day)}
                        className={styles.addSlotButton}
                        onMouseEnter={(e) => {
                          const tooltip = document.createElement('div');
                          tooltip.textContent = 'Add another time slot';
                          tooltip.className = styles.customTooltip;
                          tooltip.id = 'custom-tooltip';
                          document.body.appendChild(tooltip);
                          
                          const rect = e.currentTarget.getBoundingClientRect();
                          tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                          tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
                        }}
                        onMouseLeave={() => {
                          const tooltip = document.getElementById('custom-tooltip');
                          if (tooltip) {
                            tooltip.remove();
                          }
                        }}
                      >
                        +
                      </button>
                    </div>
                    
                    {dayHours.timeSlots.length > 1 && (
                      <div className={styles.additionalTimeSlots}>
                        {dayHours.timeSlots.slice(1).map((slot, slotIndex) => (
                          <div key={slotIndex + 1} className={styles.timeSlotRow}>
                            <div className={styles.timeSelectors}>
                              <select
                                value={slot.startTime}
                                onChange={(e) => handleTimeChange(day, slotIndex + 1, 'startTime', e.target.value)}
                                className={styles.timeSelect}
                              >
                                {timeSlots.map(time => (
                                  <option key={time} value={time}>{time}</option>
                                ))}
                              </select>
                              
                              <span className={styles.timeSeparator}>to</span>
                              
                              <select
                                value={slot.endTime}
                                onChange={(e) => handleTimeChange(day, slotIndex + 1, 'endTime', e.target.value)}
                                className={styles.timeSelect}
                              >
                                {timeSlots.map(time => (
                                  <option key={time} value={time}>{time}</option>
                                ))}
                              </select>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => removeTimeSlot(day, slotIndex + 1)}
                              className={styles.removeSlotButton}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button type="submit" className={styles.continueButton}>
            CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}