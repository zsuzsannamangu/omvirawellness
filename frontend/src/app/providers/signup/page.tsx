'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
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

function ProviderSignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthError, setOauthError] = useState('');
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

  // Check for OAuth errors in URL
  useEffect(() => {
    const error = searchParams.get('error');
    const existingType = searchParams.get('existing_type');
    
    if (error === 'account_type_mismatch') {
      const typeName = existingType === 'provider' ? 'provider' : 'client';
      setOauthError(
        `This email is already registered as a ${typeName}. Please use a different email address or log in to your existing ${typeName} account.`
      );
      // Clear the error from URL
      router.replace('/providers/signup', { scroll: false });
    } else if (error) {
      const errorMessages: { [key: string]: string } = {
        oauth_error: 'OAuth authentication failed. Please try again.',
        oauth_no_user: 'No user data received from OAuth provider.',
        no_email: 'No email address found in your Google account. Please use email signup instead.',
        oauth_failed: 'OAuth signup failed. Please try again or use email signup.',
        oauth_not_configured: 'OAuth is not configured. Please use email signup instead.'
      };
      setOauthError(errorMessages[error] || 'An error occurred during signup. Please try again.');
      router.replace('/providers/signup', { scroll: false });
    }
  }, [searchParams, router]);

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
        // Include subscription/plan information
        subscriptionPlan: completeData.payment?.selectedPlan || 'professional',
        billingCycle: completeData.payment?.billingCycle || 'monthly',
      };

      const result = await registerProvider(registrationData);
      
      console.log('Registration successful:', result);
      
      // Store token and user data in localStorage
      // The auth service already stores the user with subscription data included
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
        <Link href="/" className={styles.backLink}>
          <span className={styles.backArrow}>←</span> Back to Homepage
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

        {oauthError && (
          <div style={{ 
            padding: '12px 24px', 
            margin: '16px auto', 
            maxWidth: '600px', 
            backgroundColor: '#fee', 
            border: '1px solid #fcc', 
            borderRadius: '8px',
            color: '#c33'
          }}>
            {oauthError}
          </div>
        )}

        <div className={styles.stepContainer}>
          {renderStep()}
        </div>
      </div>
    </div>
  );
}

export default function ProviderSignupPage() {
  return (
    <Suspense fallback={
      <div className={styles.signupPage}>
        <div className={styles.header}>
          <Link href="/" className={styles.backLink}>
            <span className={styles.backArrow}>←</span> Back to Homepage
          </Link>
          <div className={styles.headerRight}>
            <Link href="/providers/login" className={styles.loginLink}>
              Log In
            </Link>
          </div>
        </div>
        <div className={styles.content}>
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        </div>
      </div>
    }>
      <ProviderSignupPageContent />
    </Suspense>
  );
} 