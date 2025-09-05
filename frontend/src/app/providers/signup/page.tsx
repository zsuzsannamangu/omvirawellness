'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from '@/styles/Providers/ProviderSignup.module.scss';

// Step components
import EmailStep from '@/components/Providers/SignupSteps/EmailStep';
import BusinessInfoStep from '@/components/Providers/SignupSteps/BusinessInfoStep';
import ServiceCategoryStep from '@/components/Providers/SignupSteps/ServiceCategoryStep';
import PasswordStep from '@/components/Providers/SignupSteps/PasswordStep';
import LocationStep from '@/components/Providers/SignupSteps/LocationStep';
import ScheduleStep from '@/components/Providers/SignupSteps/ScheduleStep';
import ServicesStep from '@/components/Providers/SignupSteps/ServicesStep';
import BusinessHoursStep from '@/components/Providers/SignupSteps/BusinessHoursStep';
import TravelSettingsStep from '@/components/Providers/SignupSteps/TravelSettingsStep';
import StaffMembersStep from '@/components/Providers/SignupSteps/StaffMembersStep';
import ProfileSetupStep from '@/components/Providers/SignupSteps/ProfileSetupStep';
import PaymentStep from '@/components/Providers/SignupSteps/PaymentStep';

export default function ProviderSignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    businessName: '',
    fullName: '',
    phoneNumber: '',
    serviceCategory: '',
    password: '',
    workLocation: [],
    weeklyAppointments: '',
    services: [],
    businessHours: {
      Sunday: { isOpen: false, startTime: '9:00 AM', endTime: '5:00 PM' },
      Monday: { isOpen: true, startTime: '9:00 AM', endTime: '5:00 PM' },
      Tuesday: { isOpen: true, startTime: '9:00 AM', endTime: '5:00 PM' },
      Wednesday: { isOpen: true, startTime: '9:00 AM', endTime: '5:00 PM' },
      Thursday: { isOpen: true, startTime: '9:00 AM', endTime: '5:00 PM' },
      Friday: { isOpen: true, startTime: '9:00 AM', endTime: '5:00 PM' },
      Saturday: { isOpen: false, startTime: '9:00 AM', endTime: '5:00 PM' }
    },
    travelSettings: {
      travelFee: '0',
      feeType: 'free',
      maxDistance: '15',
      travelPolicy: '',
      serviceAddress: '',
      city: '',
      state: '',
      zipCode: ''
    },
    staffMembers: [],
    profile: {
      bio: '',
      specialties: '',
      certifications: '',
      experience: '',
      languages: []
    },
    payment: {
      selectedPlan: 'professional',
      billingCycle: 'monthly',
      trialPeriod: '14 days',
      finalPrice: '$59'
    }
  });

  const totalSteps = 12;

  const handleNext = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (finalData: any) => {
    setFormData(prev => ({ ...prev, ...finalData }));
    console.log('Complete signup data:', { ...formData, ...finalData });
    // Handle final submission
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <EmailStep onNext={handleNext} initialData={formData} />;
      case 2:
        return <BusinessInfoStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 3:
        return <ServiceCategoryStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 4:
        return <PasswordStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 5:
        return <LocationStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 6:
        return <ScheduleStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 7:
        return <ServicesStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 8:
        return <BusinessHoursStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 9:
        return <TravelSettingsStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 10:
        return <StaffMembersStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
                case 11:
            return <ProfileSetupStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
          case 12:
            return <PaymentStep onSubmit={handleSubmit} onBack={handleBack} initialData={formData} />;
          default:
            return <EmailStep onNext={handleNext} initialData={formData} />;
    }
  };

  return (
    <div className={styles.signupPage}>
      <div className={styles.header}>
        <Link href="/providers" className={styles.logo}>
          Omvira Wellness
        </Link>
        <div className={styles.headerRight}>
          <Link href="/providers/login" className={styles.loginLink}>
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