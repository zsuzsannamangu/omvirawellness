'use client';

import Link from 'next/link';
import { useState } from 'react';
import { API_URL } from '@/config/api';
import styles from '@/styles/Login.module.scss';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('If an account with that email exists, we\'ve sent you a password reset link.');
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.formContent}>
          <h1 className={styles.title}>Forgot Password</h1>
          <p style={{ fontFamily: 'Avenir, sans-serif', fontSize: '0.875rem', color: '#666', marginBottom: '1.5rem', textAlign: 'center' }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <div className={styles.inputContainer}>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.emailInput}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className={styles.errorMessage} role="alert">
                {error}
              </div>
            )}

            {message && (
              <div className={styles.successMessage} role="alert">
                {message}
              </div>
            )}

            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className={styles.backToLogin}>
              <Link href="/login" className={styles.forgotPasswordLink}>
                ← Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
