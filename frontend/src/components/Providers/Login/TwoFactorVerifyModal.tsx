'use client';

import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface TwoFactorVerifyModalProps {
  isOpen: boolean;
  userId: string;
  onVerify: (token: string, backupCode?: string) => Promise<void>;
  onCancel: () => void;
}

export default function TwoFactorVerifyModal({
  isOpen,
  userId,
  onVerify,
  onCancel
}: TwoFactorVerifyModalProps) {
  const [token, setToken] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (useBackupCode) {
      if (!backupCode || backupCode.length < 8) {
        await Swal.fire({
          icon: 'error',
          title: 'Invalid Backup Code',
          text: 'Please enter a valid backup code',
          confirmButtonColor: '#e74c3c'
        });
        return;
      }
    } else {
      if (!token || token.length !== 6) {
        await Swal.fire({
          icon: 'error',
          title: 'Invalid Code',
          text: 'Please enter a valid 6-digit code',
          confirmButtonColor: '#e74c3c'
        });
        return;
      }
    }

    setIsVerifying(true);

    try {
      await onVerify(token, useBackupCode ? backupCode : undefined);
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Invalid verification code',
        confirmButtonColor: '#e74c3c'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Two-Factor Authentication</h2>
          <button className={styles.closeButton} onClick={onCancel}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.billingForm}>
          <div className={styles.modalBody}>
            <div className={styles.formSection}>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            Enter the 6-digit code from Google Authenticator:
          </p>

          {!useBackupCode ? (
            <div className={styles.inputGroup}>
              <label className={styles.label}>Verification Code</label>
              <input
                type="text"
                className={styles.emailInput}
                value={token}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setToken(value);
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
                autoFocus
              />
            </div>
          ) : (
            <div className={styles.inputGroup}>
              <label className={styles.label}>Backup Code</label>
              <input
                type="text"
                className={styles.emailInput}
                value={backupCode}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
                  setBackupCode(value);
                }}
                placeholder="XXXXXXXX"
                maxLength={8}
                style={{ 
                  textAlign: 'center', 
                  fontSize: '1.2rem', 
                  letterSpacing: '4px',
                  fontFamily: 'monospace'
                }}
                required
                autoFocus
              />
            </div>
          )}

          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => {
                setUseBackupCode(!useBackupCode);
                setToken('');
                setBackupCode('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#4a90e2',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.9rem'
              }}
            >
              {useBackupCode ? 'Use authenticator code instead' : 'Use backup code instead'}
            </button>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onCancel}
              disabled={isVerifying}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isVerifying || (!useBackupCode && token.length !== 6) || (useBackupCode && backupCode.length < 8)}
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </button>
          </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

