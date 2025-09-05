'use client';

import { useState } from 'react';
import styles from '@/styles/Spaces/SignupSteps.module.scss';

interface PricingStepProps {
  onNext: (data: { pricing: any }) => void;
  onBack: () => void;
  initialData: any;
}

export default function PricingStep({ onNext, onBack, initialData }: PricingStepProps) {
  const [pricing, setPricing] = useState(initialData.pricing || {
    hourlyRate: '',
    minimumBooking: '1',
    cancellationPolicy: '24'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ pricing });
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>Set your pricing</h1>
      <p className={styles.subtitle}>How much do you want to charge for your space?</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>HOURLY RATE *</label>
          <div className={styles.priceInputContainer}>
            <span className={styles.currencySymbol}>$</span>
            <input
              type="number"
              value={pricing.hourlyRate}
              onChange={(e) => setPricing({...pricing, hourlyRate: e.target.value})}
              className={styles.priceInput}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
            <span className={styles.currencyText}>per hour</span>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>MINIMUM BOOKING TIME</label>
          <select
            value={pricing.minimumBooking}
            onChange={(e) => setPricing({...pricing, minimumBooking: e.target.value})}
            className={styles.selectInput}
          >
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="3">3 hours</option>
            <option value="4">4 hours</option>
            <option value="6">6 hours</option>
            <option value="8">8 hours</option>
            <option value="12">12 hours</option>
            <option value="24">24 hours</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>CANCELLATION POLICY</label>
          <select
            value={pricing.cancellationPolicy}
            onChange={(e) => setPricing({...pricing, cancellationPolicy: e.target.value})}
            className={styles.selectInput}
          >
            <option value="24">24 hours notice</option>
            <option value="48">48 hours notice</option>
            <option value="72">72 hours notice</option>
            <option value="7">7 days notice</option>
            <option value="14">14 days notice</option>
            <option value="30">30 days notice</option>
          </select>
        </div>

        <div className={styles.pricingNote}>
          <p className={styles.noteText}>
            💡 <strong>Tip:</strong> You can always adjust your pricing later in your space dashboard.
          </p>
        </div>
        
        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button 
            type="submit" 
            className={styles.continueButton}
            disabled={!pricing.hourlyRate}
          >
            CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}