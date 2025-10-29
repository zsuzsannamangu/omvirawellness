'use client';

import { useState } from 'react';
import { FaCheckCircle, FaMapMarkerAlt, FaLightbulb } from 'react-icons/fa';
import styles from '@/styles/Providers/SignupSteps.module.scss';

interface TravelSettingsStepProps {
  onNext: (data: { travelSettings: any }) => void;
  onBack: () => void;
  initialData: any;
}

const distanceOptions = [
  { value: '5', label: '5 miles' },
  { value: '10', label: '10 miles' },
  { value: '15', label: '15 miles' },
  { value: '20', label: '20 miles' },
  { value: '25', label: '25 miles' },
  { value: '30', label: '30 miles' },
  { value: '50', label: '50 miles' }
];

export default function TravelSettingsStep({ onNext, onBack, initialData }: TravelSettingsStepProps) {
  const [travelSettings, setTravelSettings] = useState(() => {
    const existingSettings = initialData.travelSettings || {};
    return {
      travelFee: existingSettings.travelFee === '0' ? '' : (existingSettings.travelFee || ''),
      feeType: existingSettings.feeType || 'free',
      maxDistance: existingSettings.maxDistance || '15',
      travelPolicy: existingSettings.travelPolicy || '',
      serviceAddress: existingSettings.serviceAddress || '',
      city: existingSettings.city || '',
      state: existingSettings.state || '',
      zipCode: existingSettings.zipCode || ''
    };
  });

  const handleFeeTypeChange = (feeType: string) => {
    setTravelSettings({
      ...travelSettings,
      feeType,
      travelFee: feeType === 'free' ? '' : travelSettings.travelFee
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setTravelSettings({
      ...travelSettings,
      [field]: value
    });
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    handleInputChange('zipCode', value);
  };

  const handleZipCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    onNext({ travelSettings });
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>How do you handle travel?</h1>
      <p className={styles.subtitle}>Set your travel preferences and service area for mobile appointments.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Fee Type Selection */}
        <div className={styles.feeTypeContainer}>
          <div className={styles.feeTypeTabs}>
            <button
              type="button"
              className={`${styles.feeTypeTab} ${travelSettings.feeType === 'free' ? styles.active : ''}`}
              onClick={() => handleFeeTypeChange('free')}
            >
              <FaCheckCircle className={styles.tabIcon} />
              Free Travel
            </button>
            <button
              type="button"
              className={`${styles.feeTypeTab} ${travelSettings.feeType === 'fee' ? styles.active : ''}`}
              onClick={() => handleFeeTypeChange('fee')}
            >
              <span className={styles.tabIcon}>$</span>
              Travel Fee
            </button>
          </div>
        </div>

        {/* Travel Fee Input */}
        {travelSettings.feeType === 'fee' && (
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>TRAVEL FEE</label>
              <div className={styles.priceInput}>
                <span className={styles.dollarSign}>$</span>
                <input
                  type="text"
                  value={travelSettings.travelFee || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Only allow numbers and decimal point
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      handleInputChange('travelFee', value);
                    }
                  }}
                  className={styles.textInput}
                />
              </div>
            </div>
          </div>
        )}

        {/* Maximum Travel Distance */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>MAXIMUM TRAVEL DISTANCE</label>
            <select
              value={travelSettings.maxDistance}
              onChange={(e) => handleInputChange('maxDistance', e.target.value)}
              className={styles.selectInput}
            >
              {distanceOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Service Address */}
        <div className={styles.addressContainer}>
          <h3 className={styles.sectionTitle}>Address</h3>
          <p className={styles.sectionDescription}>
            Enter your primary service location. If you are not serving clients from this address, it will not be shown publicly. Clients will be matched based on this address and your travel radius.
          </p>
          
          <div className={styles.addressRowSingle}>
            <div className={styles.formGroup}>
              <label className={styles.label}>STREET ADDRESS</label>
              <input
                type="text"
                value={travelSettings.serviceAddress}
                onChange={(e) => handleInputChange('serviceAddress', e.target.value)}
                className={styles.textInput}
                placeholder="123 Main Street"
                required
              />
            </div>
          </div>

          <div className={styles.cityStateZipRow}>
            <div className={`${styles.formGroup} ${styles.cityField}`}>
              <label className={styles.label}>CITY</label>
              <input
                type="text"
                value={travelSettings.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={styles.textInput}
                placeholder="San Francisco"
                required
              />
            </div>
            <div className={`${styles.formGroup} ${styles.stateField}`}>
              <label className={styles.label}>STATE</label>
              <input
                type="text"
                value={travelSettings.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className={styles.textInput}
                placeholder="CA"
                maxLength={2}
                required
              />
            </div>
            <div className={`${styles.formGroup} ${styles.zipField}`}>
              <label className={styles.label}>ZIP CODE</label>
              <input
                type="text"
                value={travelSettings.zipCode}
                onChange={handleZipCodeChange}
                onKeyDown={handleZipCodeKeyDown}
                className={styles.textInput}
                placeholder="94102"
                maxLength={10}
                required
              />
            </div>
          </div>

          <div className={styles.serviceAreaNote}>
            <p className={styles.noteText}>
              <strong>Service Area:</strong> You'll serve clients within a {travelSettings.maxDistance}-mile radius
              {travelSettings.feeType === 'fee' && travelSettings.travelFee !== '0' 
                ? ` with a $${travelSettings.travelFee} travel fee`
                : ' at no additional cost'
              }.
            </p>
          </div>
        </div>

        {/* Travel Policy */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              TRAVEL POLICY (OPTIONAL)
              <span className={styles.helpIcon}>?</span>
            </label>
            <textarea
              value={travelSettings.travelPolicy}
              onChange={(e) => handleInputChange('travelPolicy', e.target.value)}
              className={styles.textareaInput}
              placeholder="Add any specific travel requirements or policies (e.g., parking requirements, building access instructions, etc.)"
              rows={4}
            />
          </div>
        </div>

        <div className={styles.travelNote}>
          <p className={styles.noteText}>
            <strong>Note:</strong> You can always update your travel settings and service area in your provider dashboard.
          </p>
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
