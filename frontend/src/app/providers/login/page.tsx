'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';
import TwoFactorVerifyModal from '@/components/Providers/Login/TwoFactorVerifyModal';
import { API_BASE_URL } from '@/config/api';
import styles from '@/styles/Providers/ProviderLogin.module.scss';

export default function ProviderLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorUserId, setTwoFactorUserId] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        return; // Not authenticated, show login form
      }
      
      // Validate token with backend
      try {
        const verifyResponse = await fetch('http://localhost:4000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (verifyResponse.ok) {
          // Token is valid, check if it's a provider and redirect
          try {
            const userData = JSON.parse(user);
            if (userData.user_type === 'provider') {
              router.push(`/providers/dashboard/${userData.id}`);
            } else if (userData.user_type === 'client') {
              router.push(`/dashboard/${userData.id}`);
            } 
            // SPACES FEATURE - COMMENTED OUT FOR MVP
            // else if (userData.user_type === 'space_owner') {
            //   router.push(`/spaces/dashboard/${userData.id}`);
            // }
          } catch (parseError) {
            // Invalid user data, show login form
          }
        } else {
          // Token is invalid or expired, clear it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (verifyError) {
        // Network error, show login form
      }
    };

    checkAuth();
  }, [router]);

  // Prevent password manager detection on login form
  useEffect(() => {
    const preventPasswordManager = () => {
      const form = document.querySelector(`.${styles.loginForm}`);
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');
      
      if (form) {
        form.setAttribute('data-1p-ignore', 'true');
        form.setAttribute('data-lpignore', 'true');
        form.setAttribute('data-form-type', 'other');
        form.setAttribute('autoComplete', 'off');
      }
      
      if (emailInput) {
        emailInput.setAttribute('data-1p-ignore', 'true');
        emailInput.setAttribute('data-lpignore', 'true');
        emailInput.setAttribute('data-form-type', 'other');
        emailInput.setAttribute('autoComplete', 'off');
      }
      
      if (passwordInput) {
        passwordInput.setAttribute('data-1p-ignore', 'true');
        passwordInput.setAttribute('data-lpignore', 'true');
        passwordInput.setAttribute('data-form-type', 'other');
        passwordInput.setAttribute('autoComplete', 'off');
      }
    };

    preventPasswordManager();
    const interval = setInterval(preventPasswordManager, 500);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Check browser validation first - catch HTML5 validation errors
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    
    if (emailInput && !emailInput.validity.valid) {
      if (emailInput.validity.valueMissing) {
        setError('Please enter your email address.');
        return;
      }
      if (emailInput.validity.typeMismatch || emailInput.validity.patternMismatch) {
        setError('Please enter a valid email address.');
        return;
      }
      // Generic browser validation error
      setError('Please check your email address and try again.');
      return;
    }
    
    if (passwordInput && !passwordInput.validity.valid) {
      if (passwordInput.validity.valueMissing) {
        setError('Please enter your password.');
        return;
      }
      setError('Please check your password and try again.');
      return;
    }
    
    setLoading(true);

    try {
      const data = await login(email, password);
      
      // Check if 2FA is required (this comes before user check)
      if (data.requires2FA) {
        setTwoFactorUserId(data.userId);
        setRequires2FA(true);
        setLoading(false);
        return;
      }
      
      // Verify data and user exist
      if (!data || !data.user) {
        setError('Unable to complete login. Please try again.');
        setLoading(false);
        return;
      }
      
      // Verify it's a provider account
      if (!data.user.user_type || data.user.user_type !== 'provider') {
        setError('This account is not a provider account. Please use the client login page.');
        setLoading(false);
        return;
      }
      
      router.push(`/providers/dashboard/${data.user.id}`);
    } catch (err: any) {
      // Convert all technical errors to user-friendly messages
      let errorMessage = err.message || 'Login failed. Please check your credentials.';
      
      // Handle specific error types
      if (errorMessage.includes('Cannot read properties') || errorMessage.includes('undefined')) {
        errorMessage = 'An error occurred during login. Please try again.';
      } else if (errorMessage.includes('pattern') || errorMessage.includes('match')) {
        errorMessage = 'Please check your email address and password, then try again.';
      } else if (errorMessage.includes('Invalid') && errorMessage.includes('credentials')) {
        errorMessage = 'The email or password you entered is incorrect. Please try again.';
      } else if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (errorMessage.includes('timeout')) {
        errorMessage = 'The request took too long. Please try again.';
      } else if (!errorMessage.includes('Please') && !errorMessage.includes('try')) {
        // Generic fallback for any other technical errors
        errorMessage = 'Unable to complete login. Please check your credentials and try again.';
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handle2FAVerify = async (token: string, backupCode?: string) => {
    try {
      const data = await login(email, password, token, backupCode);
      
      // Check if data and user exist
      if (!data) {
        throw new Error('Invalid response from server. Please try again.');
      }
      
      if (!data.user) {
        throw new Error('User data not found in response. Please try again.');
      }
      
      // Verify it's a provider account
      if (!data.user.user_type || data.user.user_type !== 'provider') {
        throw new Error('This account is not a provider account.');
      }
      
      router.push(`/providers/dashboard/${data.user.id}`);
    } catch (err: any) {
      // Only log unexpected errors, not expected 2FA validation failures
      if (!err.message || (!err.message.includes('2FA') && !err.message.includes('Invalid') && !err.message.includes('verification'))) {
        console.error('2FA verification error:', err);
      }
      // Re-throw so modal can handle it
      throw err;
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
          <Link href="/providers/login" className={`${styles.navTab} ${styles.active}`}>
            Provider Login
          </Link>
          <Link href="/providers/signup" className={styles.navTab}>
            Join as Provider
          </Link>
        </div>

        {/* Main Form */}
        <div className={styles.formContent}>
          <h1 className={styles.title}>Welcome back, Provider</h1>
          <p className={styles.subtitle}>Access your wellness practice dashboard</p>
          
          {error && (
            <div className={styles.errorMessage} role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLoginSubmit} className={styles.loginForm} data-1p-ignore="true" data-lpignore="true" data-form-type="other" autoComplete="off">
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
                  // Clear error when user starts typing
                  if (error) setError('');
                }}
                className={styles.emailInput}
                placeholder="Enter your email"
                required
                data-1p-ignore="true"
                data-lpignore="true"
                data-form-type="other"
                autoComplete="off"
                onInvalid={(e) => {
                  // Prevent browser's default validation message
                  e.preventDefault();
                  const target = e.target as HTMLInputElement;
                  if (target.validity.valueMissing) {
                    setError('Please enter your email address.');
                  } else if (target.validity.typeMismatch) {
                    setError('Please enter a valid email address.');
                  } else {
                    setError('Please check your email address and try again.');
                  }
                }}
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
            
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                PASSWORD
              </label>
              <div className={styles.inputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.passwordInput}
                  placeholder="Enter your password"
                  required
                  data-1p-ignore="true"
                  data-lpignore="true"
                  data-form-type="other"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className={styles.showPasswordButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>
            
            <button type="submit" className={styles.loginButton} disabled={loading}>
              <span className={styles.envelopeIcon}>✉️</span>
              {loading ? 'LOGGING IN...' : 'ACCESS PROVIDER DASHBOARD'}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className={styles.forgotPassword}>
            <Link href="/providers/forgot-password" className={styles.forgotPasswordLink}>
              Forgot password?
            </Link>
          </div>

          {/* Divider */}
          <div className={styles.divider}>
            <span className={styles.dividerText}>OR</span>
          </div>

          {/* Social Login Buttons */}
          <div className={styles.socialButtons}>
            
            <button 
              type="button"
              className={`${styles.socialButton} ${styles.facebookButton}`}
              onClick={() => {
                window.location.href = `${API_BASE_URL || 'http://localhost:4000'}/api/oauth/facebook?user_type=provider`;
              }}
            >
              <svg className={styles.facebookIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
            
            <button 
              type="button"
              className={`${styles.socialButton} ${styles.googleButton}`}
              onClick={() => {
                window.location.href = `${API_BASE_URL || 'http://localhost:4000'}/api/oauth/google?user_type=provider`;
              }}
            >
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
              <Link href="/login" className={styles.switchLink}>
                Switch to client mode
              </Link>
            </p>
          </div>

          {/* Legal Disclaimer */}
          <div className={styles.legalDisclaimer}>
            By logging in I agree to the{' '}
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

      {/* 2FA Verification Modal */}
      <TwoFactorVerifyModal
        isOpen={requires2FA}
        userId={twoFactorUserId || ''}
        onVerify={handle2FAVerify}
        onCancel={() => {
          setRequires2FA(false);
          setTwoFactorUserId(null);
        }}
      />
    </div>
  );
} 