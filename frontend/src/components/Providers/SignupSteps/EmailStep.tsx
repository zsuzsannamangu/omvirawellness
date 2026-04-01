'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaLock, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import { API_BASE_URL } from '@/config/api';
import { checkProviderSignupEmail } from '@/services/auth';
import styles from '@/styles/Providers/SignupSteps.module.scss';

interface EmailStepProps {
  onNext: (data: { email: string; signupMethod: string }) => void;
  initialData: any;
}

export default function EmailStep({ onNext, initialData }: EmailStepProps) {
  const [email, setEmail] = useState(initialData.email || '');
  const [checking, setChecking] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    if (!email.trim()) {
      return;
    }

    setChecking(true);
    try {
      const result = await checkProviderSignupEmail(email.trim());
      if (result.available) {
        onNext({ email: email.trim(), signupMethod: 'email' });
      } else {
        setEmailError(result.message || 'This email is already registered.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not verify email. Please try again.';
      setEmailError(msg);
    } finally {
      setChecking(false);
    }
  };

  const handleSocialSignup = (method: string) => {
    const baseUrl = API_BASE_URL || 'https://omvirawellness-backend.onrender.com';

    console.log('handleSocialSignup called with method:', method);
    console.log('baseUrl:', baseUrl);

    if (method === 'google') {
      const url = `${baseUrl}/api/oauth/google?user_type=provider`;
      console.log('Redirecting to:', url);
      window.location.href = url;
    } else if (method === 'facebook') {
      const url = `${baseUrl}/api/oauth/facebook?user_type=provider`;
      console.log('Redirecting to:', url);
      window.location.href = url;
    } else {
      if (email) {
        onNext({ email, signupMethod: method });
      }
    }
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>Join Omvira as a Provider</h1>
      <p className={styles.subtitle}>Start your wellness practice journey</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {emailError && (
          <div
            id="provider-email-signup-error"
            className={styles.emailAvailabilityError}
            role="alert"
          >
            {emailError}
            <div>
              <Link href="/providers/login" className={styles.emailAvailabilityErrorLogin}>
                Provider log in
              </Link>
            </div>
          </div>
        )}

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            E-MAIL ADDRESS
          </label>
          <div className={styles.inputContainer}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null);
              }}
              className={styles.emailInput}
              placeholder="Enter your email"
              required
              autoComplete="email"
              disabled={checking}
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? 'provider-email-signup-error' : undefined}
            />
            <div className={styles.inputIcons}>
              <FaLock className={styles.lockIcon} />
              <FaInfoCircle className={styles.infoIcon} />
            </div>
            <div className={styles.passwordManager}>Unlock 1Password</div>
          </div>
        </div>

        <button type="submit" className={styles.continueButton} disabled={checking}>
          <FaEnvelope className={styles.envelopeIcon} />
          {checking ? 'Checking…' : 'JOIN'}
        </button>
      </form>

      <div className={styles.divider}>
        <span className={styles.dividerText}>OR</span>
      </div>

      <div className={styles.socialButtons}>
        <button
          type="button"
          onClick={() => handleSocialSignup('facebook')}
          className={`${styles.socialButton} ${styles.facebookButton}`}
        >
          <svg className={styles.facebookIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Continue with Facebook
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSocialSignup('google');
          }}
          className={`${styles.socialButton} ${styles.googleButton}`}
        >
          <svg className={styles.googleIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>
      </div>

      <div className={styles.legalDisclaimer}>
        By signing up I agree to the{' '}
        <Link href="/terms" className={styles.legalLink}>
          Terms & Conditions
        </Link>
        {' '}and to the{' '}
        <Link href="/privacy" className={styles.legalLink}>
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
