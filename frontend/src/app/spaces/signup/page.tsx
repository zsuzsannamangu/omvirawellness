'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    console.log('SpaceSignupPage handleNext called with stepData:', stepData);
    console.log('Current step before:', currentStep);
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => {
      const newStep = Math.min(prev + 1, totalSteps);
      console.log('New step:', newStep);
      return newStep;
    });
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (finalData: any) => {
    const completeData = { ...formData, ...finalData };
    console.log('Space signup data:', completeData);
    
    setLoading(true);
    setError('');

    try {
      // Register the space owner
      const response = await fetch('http://localhost:4000/api/auth/register/space-owner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: completeData.email,
          password: completeData.password,
          businessName: completeData.businessName,
          contactName: completeData.contactName,
          phoneNumber: completeData.phoneNumber,
          spaceType: completeData.spaceType,
          address: completeData.spaceDetails?.address,
          city: completeData.spaceDetails?.city,
          state: completeData.spaceDetails?.state,
          zipCode: completeData.spaceDetails?.zipCode,
          description: completeData.spaceDetails?.description,
          capacity: completeData.spaceDetails?.capacity,
          squareFootage: completeData.spaceDetails?.squareFootage,
          amenities: completeData.amenities,
          availability: completeData.availability,
          hourlyRate: completeData.pricing?.hourlyRate,
          minimumBooking: completeData.pricing?.minimumBooking,
          cancellationPolicy: completeData.pricing?.cancellationPolicy,
          photos: completeData.photos,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Redirect to dashboard
      router.push(`/spaces/dashboard/${data.data.user.id}`);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <EmailStep onNext={handleNext} initialData={formData} />;
      case 2:
        return <PasswordStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 3:
        return <BusinessInfoStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 4:
        return <SpaceTypeStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
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
        return <PaymentStep onSubmit={handleSubmit} onBack={handleBack} initialData={formData} loading={loading} />;
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

        {error && (
          <div style={{ 
            background: '#fee', 
            border: '1px solid #fcc', 
            padding: '1rem', 
            borderRadius: '6px', 
            margin: '1rem 0',
            color: '#c33'
          }}>
            {error}
          </div>
        )}

        <div className={styles.stepContainer}>
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
