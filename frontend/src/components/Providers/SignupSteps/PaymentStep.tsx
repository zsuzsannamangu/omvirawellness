'use client';

import { useState } from 'react';
import styles from '@/styles/Providers/SignupSteps.module.scss';

interface PaymentStepProps {
  onSubmit: (data: { payment: any }) => void;
  onBack: () => void;
  initialData: any;
}

const planOptions = [
  {
    id: 'essential',
    name: 'Essential',
    price: '$29',
    period: '/month',
    description: 'Perfect for solo practitioners',
    features: [
      'Up to 50 clients',
      'Basic scheduling',
      'Client management',
      'Email support'
    ],
    popular: false
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$59',
    period: '/month',
    description: 'Best for growing practices',
    features: [
      'Up to 200 clients',
      'Advanced scheduling',
      'Staff management',
      'Marketing tools',
      'Priority support'
    ],
    popular: true
  },
  {
    id: 'growth',
    name: 'Growth+',
    price: '$99',
    period: '/month',
    description: 'For established businesses',
    features: [
      'Unlimited clients',
      'All features',
      'API access',
      'Custom integrations',
      'Dedicated support'
    ],
    popular: false
  }
];

export default function PaymentStep({ onSubmit, onBack, initialData }: PaymentStepProps) {
  const [selectedPlan, setSelectedPlan] = useState(initialData.payment?.selectedPlan || 'professional');
  const [billingCycle, setBillingCycle] = useState(initialData.payment?.billingCycle || 'monthly');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      payment: { 
        selectedPlan, 
        billingCycle,
        trialPeriod: '14 days',
        finalPrice: selectedPlan === 'essential' ? '$29' : selectedPlan === 'professional' ? '$59' : '$99'
      } 
    });
  };

  const selectedPlanData = planOptions.find(plan => plan.id === selectedPlan);

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>Choose your plan</h1>
      <p className={styles.subtitle}>Start with a free 2-week trial, then continue with the plan that works best for your practice.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Trial Banner */}
        <div className={styles.trialBanner}>
          <div className={styles.trialIcon}>🎉</div>
          <div className={styles.trialContent}>
            <h3 className={styles.trialTitle}>Free 2-Week Trial</h3>
            <p className={styles.trialDescription}>
              Try any plan free for 14 days. No credit card required to start. 
              Cancel anytime during your trial.
            </p>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className={styles.billingToggle}>
          <button
            type="button"
            className={`${styles.billingOption} ${billingCycle === 'monthly' ? styles.active : ''}`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`${styles.billingOption} ${billingCycle === 'yearly' ? styles.active : ''}`}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly <span className={styles.savings}>Save 20%</span>
          </button>
        </div>

        {/* Plan Options */}
        <div className={styles.plansContainer}>
                  {planOptions.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const yearlyPrice = plan.id === 'essential' ? '$23' : plan.id === 'professional' ? '$47' : '$79';
          const displayPrice = billingCycle === 'yearly' ? yearlyPrice : plan.price;
          const displayPeriod = billingCycle === 'yearly' ? '/month' : plan.period;
          const billingNote = billingCycle === 'yearly' ? 'billed yearly' : '';

            return (
              <div
                key={plan.id}
                className={`${styles.planCard} ${isSelected ? styles.selected : ''} ${plan.popular ? styles.popular : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && <div className={styles.popularBadge}>Most Popular</div>}
                
                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <div className={styles.planPrice}>
                    <span className={styles.price}>{displayPrice}</span>
                    <span className={styles.period}>{displayPeriod}</span>
                  </div>
                  {billingNote && (
                    <p className={styles.billingNote}>{billingNote}</p>
                  )}
                  <p className={styles.planDescription}>{plan.description}</p>
                </div>

                <ul className={styles.planFeatures}>
                  {plan.features.map((feature, index) => (
                    <li key={index} className={styles.feature}>
                      <span className={styles.checkIcon}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className={styles.planRadio}>
                  <input
                    type="radio"
                    name="plan"
                    value={plan.id}
                    checked={isSelected}
                    onChange={() => setSelectedPlan(plan.id)}
                    className={styles.planRadioInput}
                  />
                  <span className={styles.planRadioLabel}>
                    {isSelected ? 'Selected' : 'Select Plan'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Summary */}
        <div className={styles.pricingSummary}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Selected Plan:</span>
            <span className={styles.summaryValue}>{selectedPlanData?.name}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Billing Cycle:</span>
            <span className={styles.summaryValue}>{billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Trial Period:</span>
            <span className={styles.summaryValue}>14 days free</span>
          </div>
          <div className={styles.summaryDivider}></div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>After trial:</span>
            <span className={styles.summaryValue}>
              {billingCycle === 'yearly' 
                ? (selectedPlan === 'essential' ? '$23/year' : selectedPlan === 'professional' ? '$47/year' : '$79/year')
                : (selectedPlan === 'essential' ? '$29/month' : selectedPlan === 'professional' ? '$59/month' : '$99/month')
              }
            </span>
          </div>
        </div>

        {/* Terms */}
        <div className={styles.termsNote}>
          <p className={styles.termsText}>
            By creating your account, you agree to our{' '}
            <a href="/terms" className={styles.termsLink} target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className={styles.termsLink} target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            . Your trial starts immediately and you can cancel anytime.
          </p>
        </div>
        
        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button type="submit" className={styles.continueButton}>
            CREATE ACCOUNT
          </button>
        </div>
      </form>
    </div>
  );
}
