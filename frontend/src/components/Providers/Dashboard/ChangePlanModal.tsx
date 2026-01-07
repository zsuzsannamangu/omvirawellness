'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface ChangePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  currentBillingCycle: string;
  onPlanChange: (plan: string, billingCycle: string) => Promise<void>;
  onCancelSubscription?: () => Promise<void>;
  isCancellingSubscription?: boolean;
}

const planOptions = [
  {
    id: 'essential',
    name: 'Essential',
    price: 'Free',
    period: '',
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
    price: '$49',
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

export default function ChangePlanModal({ 
  isOpen, 
  onClose, 
  currentPlan, 
  currentBillingCycle,
  onPlanChange,
  onCancelSubscription,
  isCancellingSubscription = false
}: ChangePlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [billingCycle, setBillingCycle] = useState(currentBillingCycle);
  const [isChanging, setIsChanging] = useState(false);

  // Sync state when props change
  useEffect(() => {
    if (isOpen) {
      setSelectedPlan(currentPlan);
      setBillingCycle(currentBillingCycle);
    }
  }, [isOpen, currentPlan, currentBillingCycle]);

  if (!isOpen) return null;

  const handleChangePlan = async () => {
    if (selectedPlan === currentPlan && billingCycle === currentBillingCycle) {
      onClose();
      return;
    }

    setIsChanging(true);
    try {
      await onPlanChange(selectedPlan, billingCycle);
      onClose();
    } catch (error) {
      console.error('Error changing plan:', error);
      alert('Failed to change plan. Please try again.');
    } finally {
      setIsChanging(false);
    }
  };

  const getPlanPrice = (planId: string) => {
    if (planId === 'essential') return 0;
    if (planId === 'professional') {
      return billingCycle === 'yearly' ? 47 : 49;
    }
    return billingCycle === 'yearly' ? 79 : 99;
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} ${styles.changePlanModal}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Change Your Plan</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalBody}>
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
              const yearlyPrice = plan.id === 'essential' ? 'Free' : plan.id === 'professional' ? '$47' : '$79';
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
                        <FaCheckCircle className={styles.checkIcon} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className={styles.planRadio}>
                    <input
                      type="radio"
                      name="plan"
                      checked={isSelected}
                      onChange={() => setSelectedPlan(plan.id)}
                      className={styles.radioInput}
                    />
                    <span className={styles.radioLabel}>
                      {isSelected ? 'Selected' : 'Select Plan'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onClose}
              disabled={isChanging}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleChangePlan}
              disabled={isChanging || (selectedPlan === currentPlan && billingCycle === currentBillingCycle)}
            >
              {isChanging ? 'Changing Plan...' : 'Change Plan'}
            </button>
          </div>

          {/* Cancel Subscription Button - small and subtle - only show for paid plans */}
          {onCancelSubscription && currentPlan !== 'essential' && (
            <div className={styles.cancelSubscriptionContainer}>
              <button
                type="button"
                className={styles.cancelSubscriptionLink}
                onClick={onCancelSubscription}
                disabled={isCancellingSubscription || isChanging}
              >
                {isCancellingSubscription ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

