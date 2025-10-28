'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '@/styles/Providers/ProviderSignup.module.scss';
import { registerProvider } from '@/services/auth';

// Step components
import EmailStep from '@/components/Providers/SignupSteps/EmailStep';
import BusinessInfoStep from '@/components/Providers/SignupSteps/BusinessInfoStep';
import ServiceCategoryStep from '@/components/Providers/SignupSteps/ServiceCategoryStep';
import PasswordStep from '@/components/Providers/SignupSteps/PasswordStep';
import LocationStep from '@/components/Providers/SignupSteps/LocationStep';
import ServicesStep from '@/components/Providers/SignupSteps/ServicesStep';
import TravelSettingsStep from '@/components/Providers/SignupSteps/TravelSettingsStep';
import StaffMembersStep from '@/components/Providers/SignupSteps/StaffMembersStep';
import ProfileSetupStep from '@/components/Providers/SignupSteps/ProfileSetupStep';
import PaymentStep from '@/components/Providers/SignupSteps/PaymentStep';

export default function ProviderSignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      travelFee: '',
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

  const totalSteps = 10;

  const handleNext = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (finalData: any) => {
    const completeData = { ...formData, ...finalData };
    setFormData(completeData);
    
    setIsSubmitting(true);
    
    try {
      // Prepare registration data
      const registrationData = {
        email: completeData.email,
        password: completeData.password,
        businessName: completeData.businessName,
        contactName: completeData.fullName,
        phoneNumber: completeData.phoneNumber,
        businessType: completeData.serviceCategory,
        bio: completeData.profile?.bio,
        specialties: completeData.profile?.specialties,
        yearsExperience: completeData.profile?.experience,
        languages: completeData.profile?.languages || [],
        address_line1: completeData.travelSettings?.serviceAddress,
        city: completeData.travelSettings?.city,
        state: completeData.travelSettings?.state,
        zip_code: completeData.travelSettings?.zipCode,
        country: 'USA',
        workLocation: completeData.workLocation || [],
        services: completeData.services || [],
        travelPolicy: completeData.travelSettings?.travelPolicy || '',
        travelFee: completeData.travelSettings?.feeType === 'free' ? 0 : parseFloat(completeData.travelSettings?.travelFee || '0'),
        maxDistance: parseInt(completeData.travelSettings?.maxDistance || '15'),
        teamMembers: completeData.staffMembers || [],
      };

      const result = await registerProvider(registrationData);
      
      console.log('Registration successful:', result);
      
      // Store token and user data in localStorage
      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
      }
      
      // Redirect to provider dashboard
      if (result.user?.id) {
        router.push(`/providers/dashboard/${result.user.id}`);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(`Registration failed: ${error.message}`);
      setIsSubmitting(false);
    }
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
        return <ServicesStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 7:
        return <TravelSettingsStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 8:
        return <StaffMembersStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 9:
        return <ProfileSetupStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 10:
        return <PaymentStep onSubmit={handleSubmit} onBack={handleBack} initialData={formData} isSubmitting={isSubmitting} />;
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