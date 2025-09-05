'use client';

import { useState } from 'react';
import styles from '@/styles/Spaces/SignupSteps.module.scss';

interface SpaceDetailsStepProps {
  onNext: (data: { spaceDetails: any }) => void;
  onBack: () => void;
  initialData: any;
}

export default function SpaceDetailsStep({ onNext, onBack, initialData }: SpaceDetailsStepProps) {
  const [spaceDetails, setSpaceDetails] = useState(initialData.spaceDetails || {
    address: '',
    city: '',
    state: '',
    zipCode: '',
    description: '',
    capacity: '',
    squareFootage: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ spaceDetails });
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>Tell us about your space</h1>
      <p className={styles.subtitle}>Provide details about your rental space.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>ADDRESS *</label>
          <input
            type="text"
            value={spaceDetails.address}
            onChange={(e) => setSpaceDetails({...spaceDetails, address: e.target.value})}
            className={styles.textInput}
            placeholder="Enter street address"
            required
          />
        </div>

        <div className={styles.addressRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>CITY *</label>
            <input
              type="text"
              value={spaceDetails.city}
              onChange={(e) => setSpaceDetails({...spaceDetails, city: e.target.value})}
              className={styles.textInput}
              placeholder="City"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>STATE *</label>
            <input
              type="text"
              value={spaceDetails.state}
              onChange={(e) => setSpaceDetails({...spaceDetails, state: e.target.value})}
              className={styles.textInput}
              placeholder="State"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>ZIP CODE *</label>
            <input
              type="text"
              value={spaceDetails.zipCode}
              onChange={(e) => setSpaceDetails({...spaceDetails, zipCode: e.target.value})}
              className={styles.textInput}
              placeholder="ZIP"
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>DESCRIPTION *</label>
          <textarea
            value={spaceDetails.description}
            onChange={(e) => setSpaceDetails({...spaceDetails, description: e.target.value})}
            className={styles.textArea}
            placeholder="Describe your space, amenities, and what makes it special"
            rows={4}
            required
          />
        </div>

        <div className={styles.detailsRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>CAPACITY</label>
            <input
              type="number"
              value={spaceDetails.capacity}
              onChange={(e) => setSpaceDetails({...spaceDetails, capacity: e.target.value})}
              className={styles.textInput}
              placeholder="Max people"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>SQUARE FOOTAGE</label>
            <input
              type="number"
              value={spaceDetails.squareFootage}
              onChange={(e) => setSpaceDetails({...spaceDetails, squareFootage: e.target.value})}
              className={styles.textInput}
              placeholder="sq ft"
            />
          </div>
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