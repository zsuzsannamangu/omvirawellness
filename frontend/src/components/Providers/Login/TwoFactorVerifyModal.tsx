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
      // Error is already handled and displayed to user, prevent console error
      const errorMessage = error.message || 'Invalid verification code';
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#e74c3c'
      });
      // Don't re-throw - error is handled
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button 
            className={styles.closeButton} 
            onClick={onCancel}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', fontSize: '18px', color: '#666' }}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '0' }}>
            <p style={{ marginBottom: '16px', color: '#666', fontSize: '1rem' }}>
              Enter the 6-digit code from Google Authenticator:
            </p>

            {!useBackupCode ? (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600', color: '#333' }}>Verification Code</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setToken(value);
                  }}
                  placeholder="000000"
                  maxLength={6}
                  style={{ 
                    width: '100%',
                    textAlign: 'center', 
                    fontSize: '1.5rem', 
                    letterSpacing: '8px',
                    fontFamily: 'monospace',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                  required
                  autoFocus
                />
              </div>
            ) : (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600', color: '#333' }}>Backup Code</label>
                <input
                  type="text"
                  value={backupCode}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
                    setBackupCode(value);
                  }}
                  placeholder="XXXXXXXX"
                  maxLength={8}
                  style={{ 
                    width: '100%',
                    textAlign: 'center', 
                    fontSize: '1.2rem', 
                    letterSpacing: '4px',
                    fontFamily: 'monospace',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                  required
                  autoFocus
                />
              </div>
            )}

            <div style={{ marginTop: '12px', marginBottom: '20px', textAlign: 'center' }}>
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
                  fontSize: '0.875rem',
                  padding: '0'
                }}
              >
                {useBackupCode ? 'Use authenticator code instead' : 'Use backup code instead'}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={onCancel}
                disabled={isVerifying}
                style={{ 
                  padding: '8px 24px', 
                  minHeight: 'auto', 
                  height: 'auto', 
                  lineHeight: '1.4',
                  background: '#f5f5f5',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVerifying || (!useBackupCode && token.length !== 6) || (useBackupCode && backupCode.length < 8)}
                style={{ 
                  padding: '8px 24px', 
                  minHeight: 'auto', 
                  height: 'auto', 
                  lineHeight: '1.4',
                  background: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
              >
                {isVerifying ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

