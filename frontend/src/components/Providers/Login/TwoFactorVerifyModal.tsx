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
      // Convert technical errors to user-friendly messages
      let errorMessage = error.message || 'Invalid verification code';
      
      if (errorMessage.includes('Invalid') || errorMessage.includes('incorrect')) {
        errorMessage = useBackupCode 
          ? 'The backup code you entered is incorrect. Please try again.'
          : 'The verification code you entered is incorrect. Please try again.';
      } else if (errorMessage.includes('expired') || errorMessage.includes('timeout')) {
        errorMessage = 'The verification code has expired. Please request a new code.';
      } else if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (errorMessage.includes('pattern') || errorMessage.includes('match')) {
        errorMessage = 'Please enter a valid verification code.';
      } else if (!errorMessage.includes('Please') && !errorMessage.includes('try')) {
        // Generic fallback for any other technical errors
        errorMessage = 'Unable to verify code. Please try again.';
      }
      
      await Swal.fire({
        icon: 'error',
        title: 'Verification Failed',
        text: errorMessage,
        confirmButtonColor: '#e74c3c'
      });
      // Don't re-throw - error is handled
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div 
      className={styles.modalOverlay} 
      onClick={onCancel}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px'
      }}
    >
      <div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          padding: '24px',
          background: 'white',
          borderRadius: '16px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
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
                  inputMode="numeric"
                  pattern="[0-9]*"
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
                  onInvalid={(e) => {
                    e.preventDefault();
                  }}
                />
              </div>
            ) : (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600', color: '#333' }}>Backup Code</label>
                <input
                  type="text"
                  inputMode="text"
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
                  onInvalid={(e) => {
                    e.preventDefault();
                  }}
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

