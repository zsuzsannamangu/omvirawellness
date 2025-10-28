'use client';

import { useState } from 'react';
import styles from '@/styles/Providers/SignupSteps.module.scss';

interface BusinessHoursStepProps {
  onNext: (data: { businessHours: any }) => void;
  onBack: () => void;
  initialData: any;
}

const daysOfWeek = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const timeSlots = [
  '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM',
  '10:00 PM'
];

const defaultBusinessHours = {
  Sunday: { isOpen: false, startTime: '9:00 AM', endTime: '5:00 PM' },
  Monday: { isOpen: true, startTime: '9:00 AM', endTime: '5:00 PM' },
  Tuesday: { isOpen: true, startTime: '9:00 AM', endTime: '5:00 PM' },
  Wednesday: { isOpen: true, startTime: '9:00 AM', endTime: '5:00 PM' },
  Thursday: { isOpen: true, startTime: '9:00 AM', endTime: '5:00 PM' },
  Friday: { isOpen: true, startTime: '9:00 AM', endTime: '5:00 PM' },
  Saturday: { isOpen: false, startTime: '9:00 AM', endTime: '5:00 PM' }
};

export default function BusinessHoursStep({ onNext, onBack, initialData }: BusinessHoursStepProps) {
  const [businessHours, setBusinessHours] = useState(() => {
    const existingHours = initialData.businessHours || {};
    // Merge existing hours with defaults to ensure all days are present
    return {
      ...defaultBusinessHours,
      ...existingHours,
      // Ensure each day has all required properties
      ...Object.keys(defaultBusinessHours).reduce((acc, day) => {
        acc[day] = {
          ...defaultBusinessHours[day as keyof typeof defaultBusinessHours],
          ...(existingHours[day] || {})
        };
        return acc;
      }, {} as any)
    };
  });

  const handleToggleDay = (day: string) => {
    setBusinessHours({
      ...businessHours,
      [day]: {
        ...businessHours[day],
        isOpen: !businessHours[day].isOpen
      }
    });
  };

  const handleTimeChange = (day: string, timeType: 'startTime' | 'endTime', time: string) => {
    setBusinessHours({
      ...businessHours,
      [day]: {
        ...businessHours[day],
        [timeType]: time
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ businessHours });
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>When are you available?</h1>
      <p className={styles.subtitle}>Set your availability so clients know when they can book with you.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.hoursContainer}>
          {daysOfWeek.map((day) => {
            const dayHours = businessHours[day];
            if (!dayHours) return null;
            
            return (
              <div key={day} className={styles.dayRow}>
                <div className={styles.dayInfo}>
                  <span className={styles.dayName}>{day}</span>
                  <div className={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      id={`checkbox-${day}`}
                      checked={dayHours.isOpen}
                      onChange={() => handleToggleDay(day)}
                      className={styles.dayCheckbox}
                    />
                  </div>
                </div>
                
                {dayHours.isOpen ? (
                  <div className={styles.timeSelectors}>
                    <div className={styles.timeSelector}>
                      <select
                        value={dayHours.startTime}
                        onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                        className={styles.timeSelect}
                      >
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      <span className={styles.timeLabel}>Start</span>
                    </div>
                    
                    <span className={styles.timeSeparator}>to</span>
                    
                    <div className={styles.timeSelector}>
                      <select
                        value={dayHours.endTime}
                        onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                        className={styles.timeSelect}
                      >
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      <span className={styles.timeLabel}>End</span>
                    </div>
                  </div>
                ) : (
                  <span className={styles.closedText}>Closed</span>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.hoursNote}>
          <p className={styles.noteText}>
            💡 You can always adjust your availability later in your provider dashboard.
          </p>
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
