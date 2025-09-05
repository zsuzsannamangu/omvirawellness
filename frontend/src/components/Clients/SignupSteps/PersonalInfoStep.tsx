'use client';

import { useState } from 'react';
import styles from '@/styles/Clients/SignupSteps.module.scss';

interface PersonalInfoStepProps {
  onNext: (data: { personalInfo: any }) => void;
  onBack: () => void;
  initialData: any;
}

export default function PersonalInfoStep({ onNext, onBack, initialData }: PersonalInfoStepProps) {
  const [personalInfo, setPersonalInfo] = useState(initialData.personalInfo || {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    pronoun: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (personalInfo.firstName && personalInfo.lastName && personalInfo.phoneNumber && 
        personalInfo.emergencyContact.name && personalInfo.emergencyContact.phone && 
        personalInfo.emergencyContact.relationship) {
      onNext({ personalInfo });
    }
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>Tell us about yourself</h1>
      <p className={styles.subtitle}>Help us personalize your wellness journey.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>FIRST NAME *</label>
            <input
              type="text"
              value={personalInfo.firstName}
              onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
              className={styles.textInput}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>LAST NAME *</label>
            <input
              type="text"
              value={personalInfo.lastName}
              onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
              className={styles.textInput}
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>PHONE NUMBER *</label>
          <input
            type="tel"
            value={personalInfo.phoneNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setPersonalInfo({...personalInfo, phoneNumber: value});
            }}
            className={styles.textInput}
            placeholder="Enter your phone number"
            required
            maxLength={15}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>DATE OF BIRTH</label>
            <input
              type="date"
              value={personalInfo.dateOfBirth}
              onChange={(e) => setPersonalInfo({...personalInfo, dateOfBirth: e.target.value})}
              className={styles.textInput}
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>GENDER</label>
            <select
              value={personalInfo.gender}
              onChange={(e) => setPersonalInfo({...personalInfo, gender: e.target.value})}
              className={styles.selectInput}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>PRONOUN</label>
            <input
              type="text"
              value={personalInfo.pronoun}
              onChange={(e) => setPersonalInfo({...personalInfo, pronoun: e.target.value})}
              className={styles.textInput}
              placeholder="e.g., they/them"
            />
          </div>
          <div className={styles.inputGroup}>
            {/* Empty div to maintain grid layout */}
          </div>
        </div>

        <div className={styles.sectionDivider}>
          <h3>Emergency Contact</h3>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>EMERGENCY CONTACT NAME *</label>
          <input
            type="text"
            value={personalInfo.emergencyContact.name}
            onChange={(e) => setPersonalInfo({
              ...personalInfo, 
              emergencyContact: {...personalInfo.emergencyContact, name: e.target.value}
            })}
            className={styles.textInput}
            placeholder="Enter emergency contact name"
            required
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>EMERGENCY CONTACT PHONE *</label>
            <input
              type="tel"
              value={personalInfo.emergencyContact.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setPersonalInfo({
                  ...personalInfo, 
                  emergencyContact: {...personalInfo.emergencyContact, phone: value}
                });
              }}
              className={styles.textInput}
              placeholder="Enter phone number"
              maxLength={15}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>RELATIONSHIP *</label>
            <select
              value={personalInfo.emergencyContact.relationship}
              onChange={(e) => setPersonalInfo({
                ...personalInfo, 
                emergencyContact: {...personalInfo.emergencyContact, relationship: e.target.value}
              })}
              className={styles.selectInput}
              required
            >
              <option value="">Select relationship</option>
              <option value="spouse">Spouse</option>
              <option value="parent">Parent</option>
              <option value="sibling">Sibling</option>
              <option value="friend">Friend</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button 
            type="submit" 
            className={styles.continueButton}
            disabled={!personalInfo.firstName || !personalInfo.lastName || !personalInfo.phoneNumber || 
                     !personalInfo.emergencyContact.name || !personalInfo.emergencyContact.phone || 
                     !personalInfo.emergencyContact.relationship}
          >
            CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}
