'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import styles from '@/styles/Providers/Dashboard.module.scss';
import { countries } from '@/utils/countries';
import { usStates, canadianProvinces } from '@/utils/states';

interface UpdateBillingAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (addressData: {
    nameOnCard: string;
    address: string;
    addressLine2: string;
    country: string;
    city: string;
    stateProvince: string;
    postalCode: string;
  }) => Promise<void>;
  existingAddress?: {
    nameOnCard?: string;
    billingAddress?: {
      nameOnCard?: string;
      address?: string;
      addressLine2?: string;
      country?: string;
      city?: string;
      stateProvince?: string;
      postalCode?: string;
    };
  } | null;
}

export default function UpdateBillingAddressModal({
  isOpen,
  onClose,
  onUpdate,
  existingAddress
}: UpdateBillingAddressModalProps) {
  const [formData, setFormData] = useState({
    nameOnCard: '',
    address: '',
    addressLine2: '',
    country: '',
    city: '',
    stateProvince: '',
    postalCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prevCountry, setPrevCountry] = useState<string>('');

  // Load existing address data
  useEffect(() => {
    if (existingAddress) {
      const billingAddress = existingAddress.billingAddress || {};
      const country = billingAddress.country || '';
      setFormData({
        nameOnCard: existingAddress.nameOnCard || billingAddress.nameOnCard || '',
        address: billingAddress.address || '',
        addressLine2: billingAddress.addressLine2 || '',
        country: country,
        city: billingAddress.city || '',
        stateProvince: billingAddress.stateProvince || '',
        postalCode: billingAddress.postalCode || ''
      });
      setPrevCountry(country);
    }
  }, [existingAddress, isOpen]);

  // Reset state/province when country changes (only if switching between US/CA and other countries)
  useEffect(() => {
    if (prevCountry && prevCountry !== formData.country) {
      // If switching from US/CA to another country, clear state if it was a code
      if ((prevCountry === 'US' || prevCountry === 'CA') && formData.country !== 'US' && formData.country !== 'CA') {
        const currentState = formData.stateProvince;
        const isStateCode = usStates.some(s => s.code === currentState) || 
                           canadianProvinces.some(p => p.code === currentState);
        if (isStateCode) {
          setFormData(prev => ({ ...prev, stateProvince: '' }));
        }
      }
      // If switching to US/CA from another country, clear state if it's not a code
      else if ((formData.country === 'US' || formData.country === 'CA') && prevCountry !== 'US' && prevCountry !== 'CA') {
        const currentState = formData.stateProvince;
        const isStateCode = usStates.some(s => s.code === currentState) || 
                           canadianProvinces.some(p => p.code === currentState);
        if (!isStateCode && currentState) {
          setFormData(prev => ({ ...prev, stateProvince: '' }));
        }
      }
    }
    if (formData.country) {
      setPrevCountry(formData.country);
    }
  }, [formData.country]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.nameOnCard || !formData.address || 
        !formData.country || !formData.city || !formData.stateProvince || 
        !formData.postalCode) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(formData);
      onClose();
    } catch (error) {
      console.error('Error updating billing address:', error);
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

        <form onSubmit={handleSubmit} className={styles.billingForm} autoComplete="off" data-1p-ignore>
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
                  autoComplete="cc-name"
                  data-1p-ignore
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Address <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  autoComplete="street-address"
                  data-1p-ignore
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Address Line 2</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  autoComplete="address-line2"
                  data-1p-ignore
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Country <span className={styles.required}>*</span>
                </label>
                <select
                  className={styles.formSelect}
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  autoComplete="country"
                  data-1p-ignore
                  required
                >
                  <option value="">- Select One -</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  City <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  autoComplete="address-level2"
                  data-1p-ignore
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  State/Province <span className={styles.required}>*</span>
                </label>
                {formData.country === 'US' ? (
                  <select
                    className={styles.formSelect}
                    value={formData.stateProvince}
                    onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
                    autoComplete="address-level1"
                    data-1p-ignore
                    required
                  >
                    <option value="">- Select One -</option>
                    {usStates.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                ) : formData.country === 'CA' ? (
                  <select
                    className={styles.formSelect}
                    value={formData.stateProvince}
                    onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
                    autoComplete="address-level1"
                    data-1p-ignore
                    required
                  >
                    <option value="">- Select One -</option>
                    {canadianProvinces.map((province) => (
                      <option key={province.code} value={province.code}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className={styles.formInput}
                    value={formData.stateProvince}
                    onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
                    autoComplete="address-level1"
                    data-1p-ignore
                    required
                  />
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Postal Code <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  autoComplete="postal-code"
                  data-1p-ignore
                  required
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

