'use client';

import { useState } from 'react';
import styles from '@/styles/Spaces/SignupSteps.module.scss';

interface SpaceDetailsStepProps {
  onNext: (data: { spaceDetails: any }) => void;
  onBack: () => void;
  initialData: any;
}

export default function SpaceDetailsStep({ onNext, onBack, initialData }: SpaceDetailsStepProps) {
  const [spaceDetails, setSpaceDetails] = useState(initialData.spaceDetails || {
    address: '',
    city: '',
    state: '',
    zipCode: '',
    description: '',
    capacity: '',
    squareFootage: ''
  });

  const handleZipCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, home, end, left, right, up, down
    if ([8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
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
    onNext({ spaceDetails });
  };

  return (
    <div className={styles.stepContent}>
      <h1 className={styles.title}>Tell us about your space</h1>
      <p className={styles.subtitle}>Provide details about your rental space.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>ADDRESS *</label>
          <input
            type="text"
            value={spaceDetails.address}
            onChange={(e) => setSpaceDetails({...spaceDetails, address: e.target.value})}
            className={styles.textInput}
            placeholder="Enter street address"
            required
          />
        </div>

        <div className={`${styles.addressRow} ${styles.cityStateRow}`}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>CITY *</label>
            <input
              type="text"
              value={spaceDetails.city}
              onChange={(e) => setSpaceDetails({...spaceDetails, city: e.target.value})}
              className={styles.textInput}
              placeholder="City"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>STATE *</label>
            <select
              value={spaceDetails.state || ""}
              onChange={(e) => setSpaceDetails({...spaceDetails, state: e.target.value})}
              className={styles.selectInput}
              required
            >
              <option value="">Select State</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
              <option value="DC">District of Columbia</option>
            </select>
          </div>
        </div>

        <div className={`${styles.inputGroup} ${styles.zipcodeField}`}>
          <label className={styles.label}>ZIP CODE *</label>
          <input
            type="tel"
            value={spaceDetails.zipCode}
            onChange={(e) => setSpaceDetails({...spaceDetails, zipCode: e.target.value})}
            onKeyDown={handleZipCodeKeyDown}
            className={styles.textInput}
            placeholder="ZIP"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>DESCRIPTION *</label>
          <textarea
            value={spaceDetails.description}
            onChange={(e) => setSpaceDetails({...spaceDetails, description: e.target.value})}
            className={styles.textArea}
            placeholder="Describe your space, amenities, and what makes it special"
            rows={4}
            required
          />
        </div>

        <div className={styles.detailsRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>CAPACITY</label>
            <input
              type="number"
              value={spaceDetails.capacity}
              onChange={(e) => setSpaceDetails({...spaceDetails, capacity: e.target.value})}
              className={styles.textInput}
              placeholder="Max people"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>SQUARE FOOTAGE</label>
            <input
              type="number"
              value={spaceDetails.squareFootage}
              onChange={(e) => setSpaceDetails({...spaceDetails, squareFootage: e.target.value})}
              className={styles.textInput}
              placeholder="sq ft"
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