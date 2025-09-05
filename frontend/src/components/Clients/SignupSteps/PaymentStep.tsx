'use client';

import { useState } from 'react';
import styles from '@/styles/Clients/SignupSteps.module.scss';

interface PaymentStepProps {
  onNext: (data: { payment: any }) => void;
  onBack: () => void;
  initialData: any;
}

export default function PaymentStep({ onNext, onBack, initialData }: PaymentStepProps) {
  const [payment, setPayment] = useState(initialData.payment || {
    selectedPlan: 'free',
    billingCycle: 'monthly',
    trialPeriod: '14 days',
    finalPrice: 'Free'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ payment });
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>You're all set!</h1>
      <p className={styles.subtitle}>Your account is ready and you can start booking wellness services.</p>
      
      <div className={styles.successMessage}>
        <div className={styles.successIcon}>🎉</div>
        <h2>Welcome to Omvira!</h2>
        <p>Your account has been created. You can now search for providers and book wellness services.</p>
      </div>
      
      <div className={styles.nextSteps}>
        <h3>What's next?</h3>
        <ul>
          <li>✅ Search for providers in your area</li>
          <li>📅 Book appointments that fit your schedule</li>
          <li>💬 Message providers directly</li>
          <li>⭐ Leave reviews after your sessions</li>
          <li>📱 Download our mobile app for easy booking</li>
        </ul>
      </div>
      
      <div className={styles.pricingSummary}>
        <h3>Your Plan</h3>
        <div className={styles.pricingCard}>
          <div className={styles.pricingHeader}>
            <h4>Free Account</h4>
            <div className={styles.pricingAmount}>
              <span className={styles.price}>$0</span>
              <span className={styles.period}>forever</span>
            </div>
          </div>
          <ul className={styles.pricingFeatures}>
            <li>✓ Search and browse providers</li>
            <li>✓ Book appointments</li>
            <li>✓ Message providers</li>
            <li>✓ Leave reviews</li>
            <li>✓ Access to mobile app</li>
          </ul>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button type="submit" className={styles.continueButton}>
            COMPLETE SETUP
          </button>
        </div>
      </form>
    </div>
  );
}
