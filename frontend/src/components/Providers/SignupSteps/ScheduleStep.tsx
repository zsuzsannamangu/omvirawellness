'use client';

import { useState } from 'react';
import styles from '@/styles/Providers/SignupSteps.module.scss';

interface ScheduleStepProps {
  onNext: (data: { weeklyAppointments: string }) => void;
  onBack: () => void;
  initialData: any;
}

const scheduleOptions = [
  'I\'m just starting out',
  '1-4 appointments a week',
  '5-9 appointments a week',
  '10-19 appointments a week',
  '20+ appointments a week'
];

export default function ScheduleStep({ onNext, onBack, initialData }: ScheduleStepProps) {
  const [weeklyAppointments, setWeeklyAppointments] = useState(initialData.weeklyAppointments || '');

  const handleScheduleSelect = (schedule: string) => {
    setWeeklyAppointments(schedule);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (weeklyAppointments) {
      onNext({ weeklyAppointments });
    }
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>How many appointments are you looking to book per week?</h1>
      <p className={styles.subtitle}>This will help us personalize your experience.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.scheduleOptions}>
          {scheduleOptions.map((option, index) => (
            <label key={index} className={styles.scheduleOption}>
              <input
                type="radio"
                name="schedule"
                value={option}
                checked={weeklyAppointments === option}
                onChange={() => handleScheduleSelect(option)}
                className={styles.radioInput}
              />
              <span className={styles.radioLabel}>{option}</span>
            </label>
          ))}
        </div>
        
        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button 
            type="submit" 
            className={styles.continueButton}
            disabled={!weeklyAppointments}
          >
            CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}
