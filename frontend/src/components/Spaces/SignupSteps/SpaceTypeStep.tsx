'use client';

import { useState } from 'react';
import styles from '@/styles/Spaces/SignupSteps.module.scss';

interface SpaceTypeStepProps {
  onNext: (data: { spaceType: string }) => void;
  onBack: () => void;
  initialData: any;
}

const spaceTypes = [
  { id: 'massage-room', name: 'Massage Room', description: 'Private room for massage therapy' },
  { id: 'yoga-studio', name: 'Yoga Studio', description: 'Open space for yoga classes' },
  { id: 'wellness-center', name: 'Wellness Center', description: 'Multi-purpose wellness facility' },
  { id: 'meditation-room', name: 'Meditation Room', description: 'Quiet space for meditation' },
  { id: 'fitness-studio', name: 'Fitness Studio', description: 'Space for fitness classes' },
  { id: 'other', name: 'Other', description: 'Different type of wellness space' }
];

export default function SpaceTypeStep({ onNext, onBack, initialData }: SpaceTypeStepProps) {
  const [selectedType, setSelectedType] = useState(initialData.spaceType || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType) {
      onNext({ spaceType: selectedType });
    }
  };

  return (
    <div className={styles.stepContent}>
      <h1 className={styles.title}>What type of space do you have?</h1>
      <p className={styles.subtitle}>Select the type that best describes your space.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.spaceTypeGrid}>
          {spaceTypes.map((type) => (
            <div
              key={type.id}
              className={`${styles.spaceTypeCard} ${selectedType === type.id ? styles.selected : ''}`}
              onClick={() => setSelectedType(type.id)}
            >
              <h3 className={styles.spaceTypeName}>{type.name}</h3>
              <p className={styles.spaceTypeDescription}>{type.description}</p>
            </div>
          ))}
        </div>
        
        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button 
            type="submit" 
            className={styles.continueButton}
            disabled={!selectedType}
          >
            CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}