'use client';

import { useState } from 'react';
import styles from '@/styles/Clients/SignupSteps.module.scss';

interface ServicePreferencesStepProps {
  onNext: (data: { servicePreferences: any }) => void;
  onBack: () => void;
  initialData: any;
}

const serviceTypes = [
  { id: 'massage', name: 'Massage Therapy', description: 'Swedish, deep tissue, sports massage' },
  { id: 'yoga', name: 'Yoga', description: 'Hatha, Vinyasa, restorative yoga' },
  { id: 'meditation', name: 'Meditation', description: 'Mindfulness, guided meditation' },
  { id: 'acupuncture', name: 'Acupuncture', description: 'Traditional Chinese medicine' },
  { id: 'chiropractic', name: 'Chiropractic', description: 'Spinal adjustments and alignment' },
  { id: 'physical-therapy', name: 'Physical Therapy', description: 'Rehabilitation and recovery' },
  { id: 'nutrition', name: 'Nutrition Counseling', description: 'Diet and nutrition guidance' },
  { id: 'counseling', name: 'Counseling', description: 'Mental health and therapy' },
  { id: 'fitness', name: 'Personal Training', description: 'Fitness and strength training' },
  { id: 'reiki', name: 'Reiki', description: 'Energy healing and relaxation' }
];

export default function ServicePreferencesStep({ onNext, onBack, initialData }: ServicePreferencesStepProps) {
  const [servicePreferences, setServicePreferences] = useState(initialData.servicePreferences || {
    selectedServices: [],
    sessionLength: '',
    frequency: '',
    budget: '',
    locationPreference: '',
    timePreference: '',
    specialRequirements: ''
  });

  const handleServiceToggle = (serviceId: string) => {
    setServicePreferences({
      ...servicePreferences,
      selectedServices: servicePreferences.selectedServices.includes(serviceId)
        ? servicePreferences.selectedServices.filter(id => id !== serviceId)
        : [...servicePreferences.selectedServices, serviceId]
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ servicePreferences });
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>What services are you interested in?</h1>
      <p className={styles.subtitle}>Select the wellness services you'd like to explore.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.servicesGrid}>
          {serviceTypes.map((service) => (
            <label key={service.id} className={styles.serviceItem}>
              <input
                type="checkbox"
                checked={servicePreferences.selectedServices.includes(service.id)}
                onChange={() => handleServiceToggle(service.id)}
                className={styles.serviceCheckbox}
              />
              <div className={styles.serviceContent}>
                <span className={styles.serviceName}>{service.name}</span>
                <span className={styles.serviceDescription}>{service.description}</span>
              </div>
            </label>
          ))}
        </div>

        <div className={styles.preferencesSection}>
          <h3 className={styles.sectionTitle}>Session Preferences</h3>
          
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>PREFERRED SESSION LENGTH</label>
              <select
                value={servicePreferences.sessionLength}
                onChange={(e) => setServicePreferences({...servicePreferences, sessionLength: e.target.value})}
                className={styles.selectInput}
              >
                <option value="">Select length</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
                <option value="120">2 hours</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>HOW OFTEN?</label>
              <select
                value={servicePreferences.frequency}
                onChange={(e) => setServicePreferences({...servicePreferences, frequency: e.target.value})}
                className={styles.selectInput}
              >
                <option value="">Select frequency</option>
                <option value="once">Once</option>
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="as-needed">As needed</option>
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>BUDGET PER SESSION</label>
            <select
              value={servicePreferences.budget}
              onChange={(e) => setServicePreferences({...servicePreferences, budget: e.target.value})}
              className={styles.selectInput}
            >
              <option value="">Select budget range</option>
              <option value="under-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-150">$100 - $150</option>
              <option value="150-200">$150 - $200</option>
              <option value="over-200">Over $200</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>LOCATION PREFERENCE</label>
              <select
                value={servicePreferences.locationPreference}
                onChange={(e) => setServicePreferences({...servicePreferences, locationPreference: e.target.value})}
                className={styles.selectInput}
              >
                <option value="">Select preference</option>
                <option value="provider-location">At provider's location</option>
                <option value="my-home">At my home</option>
                <option value="online">Online/virtual</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>TIME PREFERENCE</label>
              <select
                value={servicePreferences.timePreference}
                onChange={(e) => setServicePreferences({...servicePreferences, timePreference: e.target.value})}
                className={styles.selectInput}
              >
                <option value="">Select preference</option>
                <option value="morning">Morning (6 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                <option value="evening">Evening (6 PM - 10 PM)</option>
                <option value="weekend">Weekends only</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>SPECIAL REQUIREMENTS (Optional)</label>
            <textarea
              value={servicePreferences.specialRequirements}
              onChange={(e) => setServicePreferences({...servicePreferences, specialRequirements: e.target.value})}
              className={styles.textArea}
              placeholder="Any accessibility needs, allergies, or special considerations..."
              rows={3}
            />
          </div>
        </div>
        
        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button 
            type="submit" 
            className={styles.continueButton}
            disabled={servicePreferences.selectedServices.length === 0}
          >
            CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}
