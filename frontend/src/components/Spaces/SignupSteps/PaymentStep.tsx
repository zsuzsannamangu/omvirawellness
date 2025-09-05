'use client';

import { useState } from 'react';
import styles from '@/styles/Spaces/SignupSteps.module.scss';

interface PaymentStepProps {
  onSubmit: (data: { payment: any }) => void;
  onBack: () => void;
  initialData: any;
}

export default function PaymentStep({ onSubmit, onBack, initialData }: PaymentStepProps) {
  const [payment, setPayment] = useState(initialData.payment || {
    selectedPlan: 'space-owner',
    billingCycle: 'monthly',
    trialPeriod: '14 days',
    finalPrice: 'Free'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ payment });
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>You're all set!</h1>
      <p className={styles.subtitle}>Your space is now live and searchable.</p>

      <div className={styles.pricingSummary}>
        <div className={styles.pricingCard}>
          <div className={styles.pricingHeader}>
            <h4>You'll pay <span className={styles.price}>5%</span> per booking</h4>
          </div>
          <ul className={styles.pricingFeatures}>
            <li>✓ No monthly fees</li>
            <li>✓ Keep 95% of your earnings</li>
            <li>✓ Automatic payments</li>
            <li>✓ 24/7 customer support</li>
            <li>✓ Insurance coverage included</li>
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
