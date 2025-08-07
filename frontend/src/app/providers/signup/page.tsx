'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from '@/styles/Providers/ProviderSignup.module.scss';

export default function ProviderSignupPage() {
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle provider signup logic
    console.log('Provider Signup:', email);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        {/* Navigation Tabs */}
        <div className={styles.navTabs}>
          <Link href="/providers/login" className={styles.navTab}>
            Provider Login
          </Link>
          <Link href="/providers/signup" className={`${styles.navTab} ${styles.active}`}>
            Join as Provider
          </Link>
        </div>

        {/* Main Form */}
        <div className={styles.formContent}>
          <h1 className={styles.title}>Join Omvira as a Provider</h1>
          <p className={styles.subtitle}>Start your wellness practice journey</p>
          
          <form onSubmit={handleEmailSubmit} className={styles.emailForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                E-MAIL ADDRESS
              </label>
              <div className={styles.inputContainer}>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.emailInput}
                  placeholder="Enter your email"
                  required
                />
                <div className={styles.inputIcons}>
                  <span className={styles.lockIcon}>🔒</span>
                  <span className={styles.infoIcon}>ℹ️</span>
                </div>
                <div className={styles.passwordManager}>
                  Unlock 1Password
                </div>
              </div>
            </div>
            
            <button type="submit" className={styles.continueButton}>
              <span className={styles.envelopeIcon}>✉️</span>
              START YOUR PROVIDER JOURNEY
            </button>
          </form>

          {/* Divider */}
          <div className={styles.divider}>
            <span className={styles.dividerText}>OR</span>
          </div>

          {/* Social Login Buttons */}
          <div className={styles.socialButtons}>
            <button className={`${styles.socialButton} ${styles.appleButton}`}>
              <svg className={styles.appleIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Continue with Apple
            </button>
            
            <button className={`${styles.socialButton} ${styles.facebookButton}`}>
              <svg className={styles.facebookIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
            
            <button className={`${styles.socialButton} ${styles.googleButton}`}>
              <svg className={styles.googleIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Switch to Client Mode */}
          <div className={styles.switchMode}>
            <p className={styles.switchText}>
              Looking to book services?{' '}
              <Link href="/signup" className={styles.switchLink}>
                Switch to client mode
              </Link>
            </p>
          </div>

          {/* Legal Disclaimer */}
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
      </div>
    </div>
  );
} 