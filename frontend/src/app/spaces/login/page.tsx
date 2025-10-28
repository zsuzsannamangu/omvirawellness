'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/services/auth';
import styles from '@/styles/Spaces/SpaceLogin.module.scss';

const SpaceLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      
      // Verify it's a space owner account
      if (data.user.user_type !== 'space_owner') {
        setError('This account is not a space owner account. Please use the correct login page.');
        setLoading(false);
        return;
      }
      
      router.push(`/spaces/dashboard/${data.user.id}`);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <Link href="/" className={styles.backLink}>
          ← Back to Homepage
        </Link>
      </div>
      
      <div className={styles.formContainer}>
        {/* Navigation Tabs */}
        <div className={styles.navTabs}>
          <Link href="/spaces/login" className={`${styles.navTab} ${styles.active}`}>
            Space Owner Login
          </Link>
          <Link href="/spaces/signup" className={styles.navTab}>
            List Your Space
          </Link>
        </div>

        {/* Main Form */}
        <div className={styles.formContent}>
          <h1 className={styles.title}>Welcome back, Space Owner</h1>
          <p className={styles.subtitle}>Access your space management dashboard</p>
          
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                E-MAIL ADDRESS
              </label>
              <input
                type="email"
                id="email"
                className={styles.emailInput}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                className={styles.passwordInput}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button type="submit" className={styles.loginButton} disabled={loading}>
              {loading ? 'LOGGING IN...' : 'ACCESS SPACE DASHBOARD'}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className={styles.forgotPassword}>
            <Link href="/spaces/forgot-password" className={styles.forgotPasswordLink}>
              Forgot password?
            </Link>
          </div>

          {/* Divider */}
          <div className={styles.divider}>
            <span className={styles.dividerText}>OR</span>
          </div>

          {/* Social Login Buttons */}
          <div className={styles.socialButtons}>
            <button type="button" className={`${styles.socialButton} ${styles.facebookButton}`}>
              <svg className={styles.facebookIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
            
            <button type="button" className={`${styles.socialButton} ${styles.googleButton}`}>
              <svg className={styles.googleIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
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
};

export default SpaceLoginPage;
