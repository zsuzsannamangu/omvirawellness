'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaCopy, FaCheck } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import Swal from 'sweetalert2';
import { API_URL } from '@/config/api';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface TwoFactorSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TwoFactorSetupModal({
  isOpen,
  onClose,
  onSuccess
}: TwoFactorSetupModalProps) {
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [otpauthUrl, setOtpauthUrl] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && step === 'setup') {
      load2FASetup();
    }
  }, [isOpen, step]);

  const load2FASetup = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/auth/2fa/enable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to setup 2FA');
      }

      setQrCode(data.qrCode);
      setSecret(data.secret);
      setOtpauthUrl(data.otpauthUrl);
    } catch (error: any) {
      console.error('Error loading 2FA setup:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to setup 2FA. Please try again.',
        confirmButtonColor: '#e74c3c'
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      await Swal.fire({
        icon: 'error',
        title: 'Invalid Code',
        text: 'Please enter a valid 6-digit code',
        confirmButtonColor: '#e74c3c'
      });
      return;
    }

    setIsVerifying(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/auth/2fa/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          token: verificationCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid verification code');
      }

      // Show backup codes
      setBackupCodes(data.backupCodes);
      
      // Update localStorage
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        userData.two_factor_enabled = true;
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      await Swal.fire({
        icon: 'success',
        title: 'Google Authenticator Enabled!',
        html: `
          <div style="text-align: left; margin: 20px 0;">
            <p style="margin-bottom: 15px; font-weight: 600;">Save these backup codes in a safe place:</p>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 14px;">
              ${data.backupCodes.map((code: string, i: number) => 
                `<div style="margin: 5px 0;">${i + 1}. ${code}</div>`
              ).join('')}
            </div>
            <p style="margin-top: 15px; color: #e74c3c; font-size: 12px;">
              ⚠️ You won't be able to see these codes again. Save them now!
            </p>
          </div>
        `,
        confirmButtonText: 'I\'ve Saved These Codes',
        confirmButtonColor: '#3085d6',
        width: '600px'
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Error verifying 2FA:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Invalid verification code. Please try again.',
        confirmButtonColor: '#e74c3c'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContent} ${styles.billingModal}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Enable Google Authenticator</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalBody}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Setting up 2FA...</p>
            </div>
          ) : step === 'setup' ? (
            <div className={styles.formSection}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', fontWeight: 600 }}>
                  Step 1: Scan QR Code
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '20px' }}>
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, Microsoft Authenticator, etc.)
                </p>
                
                {qrCode && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    padding: '20px',
                    background: '#fff',
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <QRCodeSVG value={otpauthUrl} size={200} />
                  </div>
                )}

                <div style={{ marginTop: '20px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 500, display: 'block', marginBottom: '8px' }}>
                    Or enter this code manually:
                  </label>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    background: '#f5f5f5',
                    padding: '12px',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    fontSize: '14px'
                  }}>
                    <span style={{ flex: 1 }}>{secret}</span>
                    <button
                      type="button"
                      onClick={copySecret}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#4a90e2',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px'
                      }}
                    >
                      {copied ? <FaCheck /> : <FaCopy />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #ddd' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', fontWeight: 600 }}>
                  Step 2: Verify Setup
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '16px' }}>
                  Enter the 6-digit code from Google Authenticator to verify:
                </p>
                
                <form onSubmit={handleVerify}>
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setVerificationCode(value);
                      }}
                      placeholder="000000"
                      maxLength={6}
                      style={{ 
                        textAlign: 'center', 
                        fontSize: '1.5rem', 
                        letterSpacing: '8px',
                        fontFamily: 'monospace'
                      }}
                      required
                    />
                  </div>

                  <div className={styles.modalFooter}>
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={onClose}
                      disabled={isVerifying}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={isVerifying || verificationCode.length !== 6}
                    >
                      {isVerifying ? 'Verifying...' : 'Verify & Enable'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

