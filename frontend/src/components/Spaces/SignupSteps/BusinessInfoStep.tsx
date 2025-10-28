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

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, home, end, left, right, up, down
    if ([8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true)) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && phoneNumber) {
      onNext({ businessName, contactName, phoneNumber });
    }
  };

  return (
    <div className={styles.stepContent}>
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
            onKeyDown={handlePhoneKeyDown}
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