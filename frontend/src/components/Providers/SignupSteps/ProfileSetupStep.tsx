'use client';

import { useState } from 'react';
import styles from '@/styles/Providers/SignupSteps.module.scss';

interface ProfileSetupStepProps {
  onNext: (data: { profile: any }) => void;
  onBack: () => void;
  initialData: any;
}

export default function ProfileSetupStep({ onNext, onBack, initialData }: ProfileSetupStepProps) {
  const [profile, setProfile] = useState(initialData.profile || {
    bio: '',
    specialties: '',
    certifications: '',
    experience: '',
    languages: [],
    profileImage: null
  });

  const [newLanguage, setNewLanguage] = useState('');
  const [showOtherLanguage, setShowOtherLanguage] = useState(false);

  const commonSpecialties = [
    'Deep Tissue Massage',
    'Hot Stone Therapy',
    'Prenatal Massage',
    'Sports Massage',
    'Swedish Massage',
    'Yoga Therapy',
    'Meditation Instruction',
    'Energy Healing',
    'Aromatherapy',
    'Reflexology'
  ];

  const commonLanguages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Italian',
    'Portuguese',
    'Mandarin',
    'Japanese',
    'Korean',
    'Arabic'
  ];

  const handleAddLanguage = (language: string) => {
    if (language && !profile.languages.includes(language)) {
      setProfile({
        ...profile,
        languages: [...profile.languages, language]
      });
    }
  };

  const handleRemoveLanguage = (language: string) => {
    setProfile({
      ...profile,
      languages: profile.languages.filter((l: string) => l !== language)
    });
  };

  const handleAddOtherLanguage = () => {
    if (newLanguage.trim()) {
      handleAddLanguage(newLanguage.trim());
      setNewLanguage('');
      setShowOtherLanguage(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile({
      ...profile,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ profile });
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>Tell us about yourself</h1>
      <p className={styles.subtitle}>Create your professional profile to help clients connect with you.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Bio Section */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>PROFESSIONAL BIO</label>
            <textarea
              value={profile.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className={styles.textareaInput}
              placeholder="Tell clients about your wellness practice, experience, and approach..."
              rows={4}
              maxLength={500}
            />
            <span className={styles.charCount}>{profile.bio.length}/500</span>
          </div>
        </div>

        {/* Specialties Section */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>SPECIALTIES & TECHNIQUES</label>
            <textarea
              value={profile.specialties}
              onChange={(e) => handleInputChange('specialties', e.target.value)}
              className={styles.textareaInput}
              placeholder="Describe your specialties and techniques (e.g., Deep Tissue Massage, Hot Stone Therapy...)"
              rows={4}
              maxLength={500}
            />
            <span className={styles.charCount}>{profile.specialties.length}/500</span>
          </div>
        </div>

        {/* Experience */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>YEARS OF EXPERIENCE</label>
            <select
              value={profile.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              className={styles.selectInput}
            >
              <option value="">Select experience level</option>
              <option value="0-1">0-1 years</option>
              <option value="2-5">2-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="11-15">11-15 years</option>
              <option value="16+">16+ years</option>
            </select>
          </div>
        </div>

        {/* Certifications */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>CERTIFICATIONS</label>
            <textarea
              value={profile.certifications}
              onChange={(e) => handleInputChange('certifications', e.target.value)}
              className={styles.textareaInput}
              placeholder="e.g., Licensed Massage Therapist, RYT-500"
              rows={4}
              maxLength={500}
            />
          </div>
        </div>

        {/* Languages Section */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>LANGUAGES SPOKEN</label>
            <div className={styles.languagesContainer}>
              <div className={styles.languagesList}>
                {profile.languages.map((language: string) => (
                  <span key={language} className={styles.languageTag}>
                    {language}
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(language)}
                      className={styles.removeTag}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className={styles.languageSuggestions}>
                {commonLanguages
                  .filter(l => !profile.languages.includes(l))
                  .slice(0, 5)
                  .map(language => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => handleAddLanguage(language)}
                      className={styles.suggestionButton}
                    >
                      + {language}
                    </button>
                  ))}
                <button
                  type="button"
                  onClick={() => setShowOtherLanguage(!showOtherLanguage)}
                  className={styles.suggestionButton}
                >
                  + Other
                </button>
              </div>
              {showOtherLanguage && (
                <div className={styles.otherLanguageInput}>
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className={styles.textInput}
                    placeholder="Enter language"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddOtherLanguage()}
                  />
                  <button
                    type="button"
                    onClick={handleAddOtherLanguage}
                    className={styles.addOtherButton}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowOtherLanguage(false);
                      setNewLanguage('');
                    }}
                    className={styles.cancelOtherButton}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.profileNote}>
          <p className={styles.noteText}>
            💡 <strong>Tip:</strong> A complete profile helps clients find and trust you. You can always update this information later.
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
