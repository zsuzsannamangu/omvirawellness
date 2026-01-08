'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/auth';
import TwoFactorVerifyModal from '@/components/Providers/Login/TwoFactorVerifyModal';
import { API_BASE_URL } from '@/config/api';
import styles from '@/styles/Login.module.scss';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorUserId, setTwoFactorUserId] = useState<string | null>(null);
  const router = useRouter();

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
          // Token is valid, redirect to appropriate dashboard
          try {
            const userData = JSON.parse(user);
            if (userData.user_type === 'client') {
              router.push(`/dashboard/${userData.id}`);
            } else if (userData.user_type === 'provider') {
              router.push(`/providers/dashboard/${userData.id}`);
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      
      // Check if 2FA is required
      if (data.requires2FA) {
        setTwoFactorUserId(data.userId);
        setRequires2FA(true);
        setLoading(false);
        return;
      }
      
      // Redirect based on user type with user ID
      if (data.user.user_type === 'client') {
        router.push(`/dashboard/${data.user.id}`);
      } else if (data.user.user_type === 'provider') {
        router.push(`/providers/dashboard/${data.user.id}`);
      } 
      // SPACES FEATURE - COMMENTED OUT FOR MVP
      // else if (data.user.user_type === 'space_owner') {
      //   router.push(`/spaces/dashboard/${data.user.id}`);
      // }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handle2FAVerify = async (token: string, backupCode?: string) => {
    try {
      const data = await login(email, password, token, backupCode);
      
      // Redirect based on user type with user ID
      if (data.user.user_type === 'client') {
        router.push(`/dashboard/${data.user.id}`);
      } else if (data.user.user_type === 'provider') {
        router.push(`/providers/dashboard/${data.user.id}`);
      } 
      // SPACES FEATURE - COMMENTED OUT FOR MVP
      // else if (data.user.user_type === 'space_owner') {
      //   router.push(`/spaces/dashboard/${data.user.id}`);
      // }
    } catch (err: any) {
      throw err;
    }
  };

  return (
    <>
      <div className={styles.container}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <Link href="/" className={styles.backLink}>
            ← Back to Homepage
          </Link>
        </header>
        
        <main id="main-content" className={styles.formContainer}>
          {/* Navigation Tabs */}
          <nav className={styles.navTabs} aria-label="Authentication navigation">
            <Link href="/login" className={`${styles.navTab} ${styles.active}`} aria-current="page">
              Login
            </Link>
            <Link href="/signup" className={styles.navTab}>
              Sign up
            </Link>
          </nav>

          {/* Main Form */}
          <div className={styles.formContent}>
            <h1 className={styles.title}>Welcome back</h1>
            
            {/* Live region for error announcements */}
            <div role="alert" aria-live="assertive" aria-atomic="true">
              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}
            </div>
          
          <form id="login-form" onSubmit={handleLoginSubmit} className={styles.loginForm} data-1p-ignore="true" data-lpignore="true" data-form-type="other" autoComplete="off" aria-label="Login form">
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                E-MAIL ADDRESS
              </label>
              <div className={styles.inputContainer}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.emailInput}
                  placeholder="Enter your email"
                  required
                  aria-required="true"
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? 'login-error' : undefined}
                  data-1p-ignore="true"
                  data-lpignore="true"
                  data-form-type="other"
                  autoComplete="off"
                />
                <div className={styles.inputIcons}>
                  <span className={styles.lockIcon} aria-hidden="true">🔒</span>
                  <span className={styles.infoIcon} aria-hidden="true">ℹ️</span>
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
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.passwordInput}
                  placeholder="Enter your password"
                  required
                  aria-required="true"
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? 'login-error' : undefined}
                  data-1p-ignore="true"
                  data-lpignore="true"
                  data-form-type="other"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className={styles.showPasswordButton}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>
            
            <button type="submit" className={styles.loginButton} disabled={loading} aria-busy={loading}>
              <span className={styles.envelopeIcon} aria-hidden="true">✉️</span>
              {loading ? 'LOGGING IN...' : 'LOG IN WITH EMAIL'}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className={styles.forgotPassword}>
            <Link href="/forgot-password" className={styles.forgotPasswordLink}>
              Forgot password?
            </Link>
          </div>

          {/* Divider */}
          <div className={styles.divider}>
            <span className={styles.dividerText}>OR</span>
          </div>

          {/* Social Login Buttons */}
          <div className={styles.socialButtons} role="group" aria-label="Social login options">
            
            <button 
              type="button"
              className={`${styles.socialButton} ${styles.facebookButton}`}
              onClick={() => {
                window.location.href = `${API_BASE_URL || 'http://localhost:4000'}/api/oauth/facebook?user_type=client`;
              }}
              aria-label="Continue with Facebook"
            >
              <svg className={styles.facebookIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
            
            <button 
              type="button"
              className={`${styles.socialButton} ${styles.googleButton}`}
              onClick={() => {
                window.location.href = `${API_BASE_URL || 'http://localhost:4000'}/api/oauth/google?user_type=client`;
              }}
              aria-label="Continue with Google"
            >
              <svg className={styles.googleIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Legal Disclaimer */}
          <footer className={styles.legalDisclaimer}>
            By signing up I agree to the{' '}
            <Link href="/terms" className={styles.legalLink}>
              Terms & Conditions
            </Link>
            {' '}and to the{' '}
            <Link href="/privacy" className={styles.legalLink}>
              Privacy Policy
            </Link>
          </footer>
        </div>
        </main>
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
    </>
  );
} 