'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { registerClient } from '@/services/auth';
import styles from '@/styles/Signup.module.scss';

// Step components
import EmailStep from '@/components/Clients/SignupSteps/EmailStep';
import PasswordStep from '@/components/Clients/SignupSteps/PasswordStep';
import PersonalInfoStep from '@/components/Clients/SignupSteps/PersonalInfoStep';
import WellnessGoalsStep from '@/components/Clients/SignupSteps/WellnessGoalsStep';
import ServicePreferencesStep from '@/components/Clients/SignupSteps/ServicePreferencesStep';
import LocationStep from '@/components/Clients/SignupSteps/LocationStep';

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [oauthError, setOauthError] = useState('');
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
      router.replace('/signup', { scroll: false });
    } else if (error) {
      const errorMessages: { [key: string]: string } = {
        oauth_error: 'OAuth authentication failed. Please try again.',
        oauth_no_user: 'No user data received from OAuth provider.',
        no_email: 'No email address found in your Google account. Please use email signup instead.',
        oauth_failed: 'OAuth signup failed. Please try again or use email signup.',
        oauth_not_configured: 'OAuth is not configured. Please use email signup instead.'
      };
      setOauthError(errorMessages[error] || 'An error occurred during signup. Please try again.');
      router.replace('/signup', { scroll: false });
    }
  }, [searchParams, router]);

  const handleNext = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (finalData: any) => {
    const allData = { ...formData, ...finalData };
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Prepare registration data
      const registrationData = {
        email: allData.email,
        password: allData.password,
        firstName: allData.personalInfo.firstName,
        lastName: allData.personalInfo.lastName,
        phoneNumber: allData.personalInfo.phoneNumber || null,
        dateOfBirth: allData.personalInfo.dateOfBirth || null,
        gender: allData.personalInfo.gender || null,
        pronoun: allData.personalInfo.pronoun || null,
        emergencyContactName: allData.personalInfo.emergencyContact.name || null,
        emergencyContactPhone: allData.personalInfo.emergencyContact.phone || null,
        emergencyContactRelationship: allData.personalInfo.emergencyContact.relationship || null,
        wellnessGoals: allData.wellnessGoals.selectedGoals || null,
        otherGoal: allData.wellnessGoals.otherGoal || null,
        address: allData.location.address || null,
        city: allData.location.city || null,
        state: allData.location.state || null,
        zipCode: allData.location.zipCode || null,
        country: allData.location.country || 'USA',
        preferredServices: allData.servicePreferences.selectedServices || null,
        sessionLength: allData.servicePreferences.sessionLength || null,
        frequency: allData.servicePreferences.frequency || null,
        budget: allData.servicePreferences.budget || null,
        locationPreference: allData.servicePreferences.locationPreference || null,
        timePreference: allData.servicePreferences.timePreference || null,
        specialRequirements: allData.servicePreferences.specialRequirements || null,
        travelWillingness: allData.location.allowTravel || false,
        maxTravelDistance: allData.location.travelRadius || null,
      };

      // Register the client
      const data = await registerClient(registrationData);
      
      // Registration successful - user is logged in
      // Redirect to their dashboard
      router.push(`/dashboard/${data.user.id}`);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
      setIsSubmitting(false);
    }
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
        return <LocationStep onSubmit={handleSubmit} onBack={handleBack} initialData={formData} isSubmitting={isSubmitting} error={error} />;
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

        {oauthError && (
          <div className={styles.errorMessage}>
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

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className={styles.signupPage}>
        <div className={styles.header}>
          <Link href="/" className={styles.backLink}>
            <span className={styles.backArrow}>←</span> Back to Homepage
          </Link>
          <div className={styles.headerRight}>
            <Link href="/login" className={styles.loginLink}>
              Log In
            </Link>
          </div>
        </div>
        <div className={styles.content}>
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
        </div>
      </div>
    }>
      <SignupPageContent />
    </Suspense>
  );
} 