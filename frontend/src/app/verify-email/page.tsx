'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { API_URL } from '@/config/api';
import styles from '@/styles/Login.module.scss';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const userId = searchParams.get('userId');

      if (!token || !userId) {
        setStatus('error');
        setMessage('Invalid verification link. Missing token or user ID.');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/verify-email?token=${token}&userId=${userId}`);
        const data = await response.json();

        if (response.ok && data.success) {
          if (data.alreadyVerified) {
            setStatus('success');
            setMessage('Your email is already verified.');
          } else {
            setStatus('success');
            setMessage('Email verified successfully! You can now use all features of your account.');
            
            // Update localStorage if user is logged in
            const user = localStorage.getItem('user');
            if (user) {
              const userData = JSON.parse(user);
              userData.email_verified = true;
              localStorage.setItem('user', JSON.stringify(userData));
              window.dispatchEvent(new Event('profileUpdated'));
            }
          }
        } else {
          setStatus('error');
          setMessage(data.message || 'Failed to verify email. The link may have expired.');
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An error occurred while verifying your email. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleResend = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        await Swal.fire({
          icon: 'error',
          title: 'Not Logged In',
          text: 'Please log in to resend the verification email.',
          confirmButtonColor: '#e74c3c'
        });
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Email Sent',
          text: 'A new verification email has been sent to your inbox.',
          confirmButtonColor: '#4a90e2'
        });
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Failed to resend verification email.',
          confirmButtonColor: '#e74c3c'
        });
      }
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to resend verification email. Please try again later.',
        confirmButtonColor: '#e74c3c'
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.formContent}>
          {status === 'verifying' && (
            <>
              <h1 className={styles.title}>Verifying Email</h1>
              <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
                {message}
              </p>
              <div style={{ textAlign: 'center' }}>
                <div className={styles.loadingSpinner}></div>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✓</div>
                <h1 className={styles.title} style={{ color: '#4a90e2' }}>Email Verified!</h1>
                <p style={{ color: '#666', marginTop: '1rem' }}>{message}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link href="/login" className={styles.loginButton} style={{ textDecoration: 'none', textAlign: 'center' }}>
                  Continue to Login
                </Link>
                <Link href="/" className={styles.forgotPasswordLink} style={{ textAlign: 'center' }}>
                  Back to Homepage
                </Link>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#e74c3c' }}>✗</div>
                <h1 className={styles.title} style={{ color: '#e74c3c' }}>Verification Failed</h1>
                <p style={{ color: '#666', marginTop: '1rem' }}>{message}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={handleResend}
                  className={styles.loginButton}
                  style={{ width: '100%' }}
                >
                  Resend Verification Email
                </button>
                <Link href="/login" className={styles.forgotPasswordLink} style={{ textAlign: 'center' }}>
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
