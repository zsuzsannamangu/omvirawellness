'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from '@/styles/Signup.module.scss';

// Step components
import EmailStep from '@/components/Clients/SignupSteps/EmailStep';
import PasswordStep from '@/components/Clients/SignupSteps/PasswordStep';
import PersonalInfoStep from '@/components/Clients/SignupSteps/PersonalInfoStep';
import WellnessGoalsStep from '@/components/Clients/SignupSteps/WellnessGoalsStep';
import ServicePreferencesStep from '@/components/Clients/SignupSteps/ServicePreferencesStep';
import LocationStep from '@/components/Clients/SignupSteps/LocationStep';

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    signupMethod: '',
    password: '',
              personalInfo: {
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
          },
              wellnessGoals: {
            selectedGoals: [],
            otherGoal: ''
          },
    servicePreferences: {
      selectedServices: [],
      sessionLength: '',
      frequency: '',
      budget: '',
      locationPreference: '',
      timePreference: '',
      specialRequirements: ''
    },
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      travelRadius: '10',
      allowTravel: true
    },
    payment: {
      selectedPlan: 'free',
      billingCycle: 'monthly',
      trialPeriod: '14 days',
      finalPrice: 'Free'
    }
  });

  const totalSteps = 6;

  const handleNext = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (finalData: any) => {
    console.log('Client signup data:', { ...formData, ...finalData });
    // Here you would typically send the data to your backend
    alert('Client signup completed! (This is a demo)');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <EmailStep onNext={handleNext} initialData={formData} />;
      case 2:
        return <PasswordStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 3:
        return <PersonalInfoStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 4:
        return <WellnessGoalsStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 5:
        return <ServicePreferencesStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 6:
        return <LocationStep onSubmit={handleSubmit} onBack={handleBack} initialData={formData} />;
      default:
        return <EmailStep onNext={handleNext} initialData={formData} />;
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.header}>
        <Link href="/" className={styles.logo}>
          Omvira Wellness
        </Link>
        <div className={styles.headerRight}>
          <Link href="/login" className={styles.loginLink}>
            Log In
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
          <span className={styles.progressText}>
            Step {currentStep} of {totalSteps}
          </span>
        </div>

        <div className={styles.stepContainer}>
          {renderStep()}
        </div>
      </div>
    </div>
  );
} 