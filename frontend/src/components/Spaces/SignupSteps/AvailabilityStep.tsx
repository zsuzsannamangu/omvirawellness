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
  const [availability, setAvailability] = useState(initialData.availability || {
    Monday: { isOpen: true, startTime: '9:00 AM', endTime: '9:00 PM' },
    Tuesday: { isOpen: true, startTime: '9:00 AM', endTime: '9:00 PM' },
    Wednesday: { isOpen: true, startTime: '9:00 AM', endTime: '9:00 PM' },
    Thursday: { isOpen: true, startTime: '9:00 AM', endTime: '9:00 PM' },
    Friday: { isOpen: true, startTime: '9:00 AM', endTime: '9:00 PM' },
    Saturday: { isOpen: true, startTime: '9:00 AM', endTime: '9:00 PM' },
    Sunday: { isOpen: false, startTime: '9:00 AM', endTime: '9:00 PM' }
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

  const handleTimeChange = (day: string, timeType: 'startTime' | 'endTime', time: string) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        [timeType]: time
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ availability });
  };

  return (
    <div className={styles.stepContainer}>
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