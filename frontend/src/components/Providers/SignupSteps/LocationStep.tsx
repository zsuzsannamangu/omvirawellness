'use client';

import { useState } from 'react';
import styles from '@/styles/Providers/SignupSteps.module.scss';

interface LocationStepProps {
  onNext: (data: { workLocation: string[] }) => void;
  onBack: () => void;
  initialData: any;
}

const locationOptions = [
  {
    id: 'at-my-place',
    title: 'At my place',
    description: 'My clients come to me. I own the place or work in a studio/suite alongside other professionals.',
    icon: '🏠'
  },
  {
    id: 'at-client-location',
    title: 'At the client\'s location',
    description: 'I\'m on the go. My services are performed at the client\'s location.',
    icon: '🚗'
  },
  {
    id: 'from-booked-studio',
    title: 'From a booked studio',
    description: 'I rent studio space on-demand through Omvira\'s studio booking system.',
    icon: '🏢'
  },
  {
    id: 'online',
    title: 'Online',
    description: 'I offer services via video call.',
    icon: '💻'
  }
];

export default function LocationStep({ onNext, onBack, initialData }: LocationStepProps) {
  const [workLocations, setWorkLocations] = useState<string[]>(initialData.workLocation || []);

  const handleLocationSelect = (locationId: string) => {
    setWorkLocations(prev => {
      if (prev.includes(locationId)) {
        return prev.filter(id => id !== locationId);
      } else {
        return [...prev, locationId];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (workLocations.length > 0) {
      onNext({ workLocation: workLocations });
    }
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>Where do you work?</h1>
      <p className={styles.subtitle}>Select all that apply</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.locationOptions}>
          {locationOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`${styles.locationCard} ${workLocations.includes(option.id) ? styles.selected : ''}`}
              onClick={() => handleLocationSelect(option.id)}
            >
              <div className={styles.locationIcon}>{option.icon}</div>
              <div className={styles.locationContent}>
                <h3 className={styles.locationTitle}>{option.title}</h3>
                <p className={styles.locationDescription}>{option.description}</p>
              </div>
              <div className={styles.locationCheckbox}>
                {workLocations.includes(option.id) ? '✓' : '○'}
              </div>
            </button>
          ))}
        </div>
        
        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button 
            type="submit" 
            className={styles.continueButton}
            disabled={workLocations.length === 0}
          >
            CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}
