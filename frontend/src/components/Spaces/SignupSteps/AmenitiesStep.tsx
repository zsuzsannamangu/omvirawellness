'use client';

import { useState } from 'react';
import styles from '@/styles/Spaces/SignupSteps.module.scss';

interface AmenitiesStepProps {
  onNext: (data: { amenities: string[] }) => void;
  onBack: () => void;
  initialData: any;
}

const amenityOptions = [
  'Parking Available',
  'Air Conditioning',
  'Heating',
  'Sound System',
  'Mirrors',
  'Mats Provided',
  'Props Available',
  'Changing Room',
  'Restroom Access',
  'Kitchen Access',
  'WiFi',
  'Natural Light',
  'Private Entrance',
  'Storage Space',
  'Cleaning Supplies'
];

export default function AmenitiesStep({ onNext, onBack, initialData }: AmenitiesStepProps) {
  const [amenities, setAmenities] = useState(initialData.amenities || []);

  const handleAmenityToggle = (amenity: string) => {
    setAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ amenities });
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>What amenities does your space offer?</h1>
      <p className={styles.subtitle}>Select all that apply to help guests know what to expect.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.amenitiesGrid}>
          {amenityOptions.map((amenity) => (
            <label key={amenity} className={styles.amenityItem}>
              <input
                type="checkbox"
                checked={amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className={styles.amenityCheckbox}
              />
              <span className={styles.amenityLabel}>{amenity}</span>
            </label>
          ))}
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