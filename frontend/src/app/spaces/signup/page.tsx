'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from '@/styles/Spaces/SpaceSignup.module.scss';

// Step components
import EmailStep from '@/components/Spaces/SignupSteps/EmailStep';
import BusinessInfoStep from '@/components/Spaces/SignupSteps/BusinessInfoStep';
import SpaceTypeStep from '@/components/Spaces/SignupSteps/SpaceTypeStep';
import PasswordStep from '@/components/Spaces/SignupSteps/PasswordStep';
import SpaceDetailsStep from '@/components/Spaces/SignupSteps/SpaceDetailsStep';
import AmenitiesStep from '@/components/Spaces/SignupSteps/AmenitiesStep';
import AvailabilityStep from '@/components/Spaces/SignupSteps/AvailabilityStep';
import PricingStep from '@/components/Spaces/SignupSteps/PricingStep';
import PhotosStep from '@/components/Spaces/SignupSteps/PhotosStep';
import PaymentStep from '@/components/Spaces/SignupSteps/PaymentStep';

export default function SpaceSignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    businessName: '',
    contactName: '',
    phoneNumber: '',
    spaceType: '',
    password: '',
    spaceDetails: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      description: '',
      capacity: '',
      squareFootage: ''
    },
    amenities: [],
    availability: {
      Monday: { isOpen: true, startTime: '9:00 AM', endTime: '9:00 PM' },
      Tuesday: { isOpen: true, startTime: '9:00 AM', endTime: '9:00 PM' },
      Wednesday: { isOpen: true, startTime: '9:00 AM', endTime: '9:00 PM' },
      Thursday: { isOpen: true, startTime: '9:00 AM', endTime: '9:00 PM' },
      Friday: { isOpen: true, startTime: '9:00 AM', endTime: '9:00 PM' },
      Saturday: { isOpen: true, startTime: '9:00 AM', endTime: '9:00 PM' },
      Sunday: { isOpen: false, startTime: '9:00 AM', endTime: '9:00 PM' }
    },
    pricing: {
      hourlyRate: '',
      minimumBooking: '1',
      cancellationPolicy: '24'
    },
    photos: [],
    payment: {
      selectedPlan: 'space-owner',
      billingCycle: 'monthly',
      trialPeriod: '14 days',
      finalPrice: 'Free'
    }
  });

  const totalSteps = 10;

  const handleNext = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (finalData: any) => {
    console.log('Space signup data:', { ...formData, ...finalData });
    // Here you would typically send the data to your backend
    alert('Space signup completed! (This is a demo)');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <EmailStep onNext={handleNext} initialData={formData} />;
      case 2:
        return <BusinessInfoStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 3:
        return <SpaceTypeStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 4:
        return <PasswordStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 5:
        return <SpaceDetailsStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 6:
        return <AmenitiesStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 7:
        return <AvailabilityStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 8:
        return <PricingStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 9:
        return <PhotosStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 10:
        return <PaymentStep onSubmit={handleSubmit} onBack={handleBack} initialData={formData} />;
      default:
        return <EmailStep onNext={handleNext} initialData={formData} />;
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.header}>
        <Link href="/spaces" className={styles.logo}>
          Omvira Wellness
        </Link>
        <div className={styles.headerRight}>
          <Link href="/spaces/login" className={styles.loginLink}>
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
