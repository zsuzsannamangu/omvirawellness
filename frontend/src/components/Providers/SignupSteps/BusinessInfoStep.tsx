'use client';

import { useState } from 'react';
import styles from '@/styles/Providers/SignupSteps.module.scss';

interface BusinessInfoStepProps {
  onNext: (data: { businessName: string; fullName: string; phoneNumber: string }) => void;
  onBack: () => void;
  initialData: any;
}

export default function BusinessInfoStep({ onNext, onBack, initialData }: BusinessInfoStepProps) {
  const [businessName, setBusinessName] = useState(initialData.businessName || '');
  const [fullName, setFullName] = useState(initialData.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(initialData.phoneNumber || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (businessName && fullName && phoneNumber) {
      onNext({ businessName, fullName, phoneNumber });
    }
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>About You</h1>
      <p className={styles.subtitle}>Tell us more about yourself and your wellness practice.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="businessName" className={styles.label}>
            BUSINESS NAME
          </label>
          <input
            type="text"
            id="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className={styles.textInput}
            placeholder="Business name"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="fullName" className={styles.label}>
            YOUR NAME
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={styles.textInput}
            placeholder="Your name"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="phoneNumber" className={styles.label}>
            YOUR PHONE NUMBER
          </label>
          <div className={styles.phoneContainer}>
            <div className={styles.phonePrefix}>
              <span className={styles.flag}>🇺🇸</span>
              <span className={styles.countryCode}>+1</span>
            </div>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={styles.phoneInput}
              placeholder="Your phone number"
              required
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
