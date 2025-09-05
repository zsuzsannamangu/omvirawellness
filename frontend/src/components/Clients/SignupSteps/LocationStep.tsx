'use client';

import { useState } from 'react';
import styles from '@/styles/Clients/SignupSteps.module.scss';

interface LocationStepProps {
  onSubmit: (data: { location: any }) => void;
  onBack: () => void;
  initialData: any;
}

export default function LocationStep({ onSubmit, onBack, initialData }: LocationStepProps) {
  const [location, setLocation] = useState(initialData.location || {
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    travelRadius: '10',
    allowTravel: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.address && location.city && location.state && location.zipCode && location.country) {
      onSubmit({ location });
    }
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>Where are you located?</h1>
      <p className={styles.subtitle}>Help us find providers near you and set your service preferences.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>ADDRESS *</label>
          <input
            type="text"
            value={location.address}
            onChange={(e) => setLocation({...location, address: e.target.value})}
            className={styles.textInput}
            placeholder="Enter your street address"
            required
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>CITY *</label>
            <input
              type="text"
              value={location.city}
              onChange={(e) => setLocation({...location, city: e.target.value})}
              className={styles.textInput}
              placeholder="City"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>STATE *</label>
            <input
              type="text"
              value={location.state}
              onChange={(e) => setLocation({...location, state: e.target.value})}
              className={styles.textInput}
              placeholder="State"
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>ZIP CODE *</label>
            <input
              type="text"
              value={location.zipCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setLocation({...location, zipCode: value});
              }}
              className={styles.textInput}
              placeholder="ZIP"
              required
              maxLength={10}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>COUNTRY *</label>
            <input
              type="text"
              value={location.country}
              onChange={(e) => setLocation({...location, country: e.target.value})}
              className={styles.textInput}
              placeholder="Enter your country"
              required
            />
          </div>
        </div>

        <div className={styles.travelSection}>
          <h3 className={styles.sectionTitle}>Travel Preferences</h3>
          
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={location.allowTravel}
                onChange={(e) => setLocation({...location, allowTravel: e.target.checked})}
                className={styles.checkbox}
              />
              <span className={styles.checkboxLabel}>
                I'm willing to travel to providers
              </span>
            </label>
          </div>

          {location.allowTravel && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>MAXIMUM TRAVEL DISTANCE</label>
              <select
                value={location.travelRadius}
                onChange={(e) => setLocation({...location, travelRadius: e.target.value})}
                className={styles.selectInput}
              >
                <option value="5">5 miles</option>
                <option value="10">10 miles</option>
                <option value="15">15 miles</option>
                <option value="25">25 miles</option>
                <option value="50">50 miles</option>
                <option value="100">100+ miles</option>
              </select>
            </div>
          )}
        </div>

        <div className={styles.locationNote}>
          <p className={styles.noteText}>
            💡 <strong>Privacy:</strong> Your exact address is never shared with providers. We only use your location to find nearby services and calculate travel distances.
          </p>
        </div>
        
        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button 
            type="submit" 
            className={styles.continueButton}
            disabled={!location.address || !location.city || !location.state || !location.zipCode || !location.country}
          >
            Complete Setup
          </button>
        </div>
      </form>
    </div>
  );
}
