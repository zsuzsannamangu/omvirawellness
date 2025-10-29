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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    setPhoneNumber(value);
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, and home/end keys
    if ([8, 9, 27, 13, 46, 35, 36].indexOf(e.keyCode) !== -1 ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
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
              onChange={handlePhoneChange}
              onKeyDown={handlePhoneKeyDown}
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
