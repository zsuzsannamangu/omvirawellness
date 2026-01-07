'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import styles from '@/styles/Providers/Dashboard.module.scss';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface UpdatePaymentMethodModalStripeProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (paymentMethodId: string, billingAddress: any, nameOnCard: string) => Promise<void>;
  existingPaymentMethod?: {
    cardType?: string;
    last4?: string;
    expiryDate?: string;
    nameOnCard?: string;
    billingAddress?: any;
  } | null;
  userId: string;
  userEmail?: string;
  userName?: string;
}

// Payment form component that uses Stripe Elements
function PaymentForm({
  onUpdate,
  onClose,
  existingPaymentMethod,
  userId,
  userEmail,
  userName,
  clientSecret
}: {
  onUpdate: (paymentMethodId: string, billingAddress: any, nameOnCard: string) => Promise<void>;
  onClose: () => void;
  existingPaymentMethod?: any;
  userId: string;
  userEmail?: string;
  userName?: string;
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameOnCard, setNameOnCard] = useState(existingPaymentMethod?.nameOnCard || '');
  const [billingAddress, setBillingAddress] = useState({
    nameOnCard: existingPaymentMethod?.nameOnCard || '',
    address: existingPaymentMethod?.billingAddress?.address || '',
    addressLine2: existingPaymentMethod?.billingAddress?.addressLine2 || '',
    city: existingPaymentMethod?.billingAddress?.city || '',
    stateProvince: existingPaymentMethod?.billingAddress?.stateProvince || '',
    postalCode: existingPaymentMethod?.billingAddress?.postalCode || '',
    country: existingPaymentMethod?.billingAddress?.country || ''
  });

  // Validate clientSecret is available
  if (!clientSecret) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading secure payment form...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    if (!nameOnCard) {
      setError('Name on card is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      // Use the client secret from parent component
      if (!clientSecret) {
        throw new Error('Setup intent not ready');
      }

      // Step 3: Get card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Step 3: Confirm setup intent with card
      const { error: confirmError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: nameOnCard,
            address: {
              line1: billingAddress.address,
              line2: billingAddress.addressLine2 || undefined,
              city: billingAddress.city,
              state: billingAddress.stateProvince,
              postal_code: billingAddress.postalCode,
              country: billingAddress.country
            }
          }
        }
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment method setup failed');
        setIsSubmitting(false);
        return;
      }

      if (!setupIntent?.payment_method) {
        throw new Error('Payment method not created');
      }

      // Step 4: Attach payment method to customer
      await onUpdate(
        setupIntent.payment_method as string,
        billingAddress,
        nameOnCard
      );

      onClose();
    } catch (err: any) {
      console.error('Error setting up payment method:', err);
      setError(err.message || 'Failed to save payment method');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'system-ui, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className={styles.billingForm}>
      <div className={styles.modalBody}>
        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Name On Credit Card <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.formInput}
              value={nameOnCard}
              onChange={(e) => {
                setNameOnCard(e.target.value);
                setBillingAddress({ ...billingAddress, nameOnCard: e.target.value });
              }}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Card Details <span className={styles.required}>*</span>
            </label>
            <div style={{ 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              backgroundColor: '#fff'
            }}>
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Billing Address <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="Street address"
              value={billingAddress.address}
              onChange={(e) => setBillingAddress({ ...billingAddress, address: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Address Line 2</label>
            <input
              type="text"
              className={styles.formInput}
              placeholder="Apartment, suite, etc. (optional)"
              value={billingAddress.addressLine2}
              onChange={(e) => setBillingAddress({ ...billingAddress, addressLine2: e.target.value })}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              City <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.formInput}
              value={billingAddress.city}
              onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              State/Province <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.formInput}
              value={billingAddress.stateProvince}
              onChange={(e) => setBillingAddress({ ...billingAddress, stateProvince: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Postal Code <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.formInput}
              value={billingAddress.postalCode}
              onChange={(e) => setBillingAddress({ ...billingAddress, postalCode: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Country <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              className={styles.formInput}
              value={billingAddress.country}
              onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
              required
            />
          </div>

          {error && (
            <div style={{ color: '#d32f2f', marginTop: '10px', fontSize: '14px' }}>
              {error}
            </div>
          )}
        </div>
      </div>

      <div className={styles.modalFooter}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting || !stripe}
        >
          {isSubmitting ? 'Processing...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

// Main modal component
export default function UpdatePaymentMethodModalStripe({
  isOpen,
  onClose,
  onUpdate,
  existingPaymentMethod,
  userId,
  userEmail,
  userName
}: UpdatePaymentMethodModalStripeProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset client secret when modal opens
      setClientSecret(null);
      
      // Fetch setup intent when modal opens
      const fetchSetupIntent = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          // First ensure customer exists
          const customerResponse = await fetch(`http://localhost:4000/api/stripe/customer`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              email: userEmail,
              name: userName
            })
          });

          if (!customerResponse.ok) {
            console.error('Failed to create customer');
            return;
          }

          // Then create setup intent
          const response = await fetch(`http://localhost:4000/api/stripe/setup-intent`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setClientSecret(data.clientSecret);
          }
        } catch (error) {
          console.error('Error fetching setup intent:', error);
        }
      };

      fetchSetupIntent();
    }
  }, [isOpen, userId, userEmail, userName]);

  if (!isOpen) return null;

  const elementsOptions: StripeElementsOptions = {
    clientSecret: clientSecret || undefined,
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} ${styles.billingModal}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Billing Information</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
        clientSecret ? (
          <Elements stripe={stripePromise} options={elementsOptions}>
            <PaymentForm
              onUpdate={onUpdate}
              onClose={onClose}
              existingPaymentMethod={existingPaymentMethod}
              userId={userId}
              userEmail={userEmail}
              userName={userName}
              clientSecret={clientSecret}
            />
          </Elements>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            Loading secure payment form...
          </div>
        )
      ) : (
        <div style={{ padding: '20px', textAlign: 'center', color: '#d32f2f' }}>
          Stripe is not configured. Please add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your environment variables.
        </div>
      )}
      </div>
    </div>
  );
}

