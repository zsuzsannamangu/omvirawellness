'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface UpdatePaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (paymentData: {
    nameOnCard: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  }) => Promise<void>;
  existingPaymentMethod?: {
    cardNumber: string;
    expiryDate: string;
    last4?: string;
    nameOnCard?: string;
  } | null;
}

export default function UpdatePaymentMethodModal({
  isOpen,
  onClose,
  onUpdate,
  existingPaymentMethod
}: UpdatePaymentMethodModalProps) {
  const [formData, setFormData] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate month options
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return { value: String(month).padStart(2, '0'), label: String(month).padStart(2, '0') };
  });

  // Generate year options (current year to 20 years ahead)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => {
    const year = currentYear + i;
    return { value: String(year), label: String(year) };
  });

  // Load existing payment method data
  useEffect(() => {
    if (existingPaymentMethod) {
      if (existingPaymentMethod.expiryDate) {
        const [month, year] = existingPaymentMethod.expiryDate.split('/');
        if (month && year) {
          setFormData(prev => ({
            ...prev,
            expiryMonth: month,
            expiryYear: year.length === 2 ? `20${year}` : year
          }));
        }
      }
      if (existingPaymentMethod.nameOnCard) {
        setFormData(prev => ({
          ...prev,
          nameOnCard: existingPaymentMethod.nameOnCard || ''
        }));
      }
    }
  }, [existingPaymentMethod, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.nameOnCard || !formData.cardNumber || !formData.expiryMonth || 
        !formData.expiryYear || !formData.cvv) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate card number
    const cardNumberDigits = formData.cardNumber.replace(/\s/g, '');
    if (cardNumberDigits.length < 13 || cardNumberDigits.length > 19) {
      alert('Please enter a valid card number');
      return;
    }

    // Validate CVV
    if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      alert('Please enter a valid CVV');
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(formData);
      onClose();
      // Reset form
      setFormData({
        nameOnCard: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: ''
      });
    } catch (error) {
      console.error('Error updating payment method:', error);
    } finally {
      setIsSubmitting(false);
    }
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
                  value={formData.nameOnCard}
                  onChange={(e) => setFormData({ ...formData, nameOnCard: e.target.value })}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Credit Card <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => {
                    // Format card number with spaces
                    const value = e.target.value.replace(/\s/g, '');
                    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                    if (value.length <= 19) {
                      setFormData({ ...formData, cardNumber: formatted });
                    }
                  }}
                  maxLength={23}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Expiration <span className={styles.required}>*</span>
                </label>
                <div className={styles.expiryRow} style={{ display: 'flex', flexDirection: 'row', gap: '12px' }}>
                  <select
                    className={styles.formSelect}
                    value={formData.expiryMonth}
                    onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
                    required
                    style={{ width: 'auto', minWidth: '80px', maxWidth: '120px', flex: '0 1 auto' }}
                  >
                    <option value="">- Select Or -</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                  <select
                    className={styles.formSelect}
                    value={formData.expiryYear}
                    onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                    required
                    style={{ width: 'auto', minWidth: '80px', maxWidth: '120px', flex: '0 1 auto' }}
                  >
                    <option value="">- Select Or -</option>
                    {years.map((year) => (
                      <option key={year.value} value={year.value}>
                        {year.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  CVV <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="123"
                  value={formData.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 4) {
                      setFormData({ ...formData, cvv: value });
                    }
                  }}
                  maxLength={4}
                  required
                  style={{ width: 'auto', minWidth: '80px', maxWidth: '120px' }}
                />
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

