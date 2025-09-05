'use client';

import { useState } from 'react';
import styles from '@/styles/Spaces/SignupSteps.module.scss';

interface BusinessInfoStepProps {
  onNext: (data: { businessName: string; contactName: string; phoneNumber: string }) => void;
  onBack: () => void;
  initialData: any;
}

export default function BusinessInfoStep({ onNext, onBack, initialData }: BusinessInfoStepProps) {
  const [businessName, setBusinessName] = useState(initialData.businessName || '');
  const [contactName, setContactName] = useState(initialData.contactName || '');
  const [phoneNumber, setPhoneNumber] = useState(initialData.phoneNumber || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && phoneNumber) {
      onNext({ businessName, contactName, phoneNumber });
    }
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>Tell us about your business</h1>
      <p className={styles.subtitle}>Help us understand your space rental business.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>BUSINESS NAME (Optional)</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className={styles.textInput}
            placeholder="Enter business name"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>CONTACT NAME *</label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className={styles.textInput}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>PHONE NUMBER *</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={styles.textInput}
            placeholder="Enter phone number"
            required
          />
        </div>
        
        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button 
            type="submit" 
            className={styles.continueButton}
            disabled={!contactName || !phoneNumber}
          >
            CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}