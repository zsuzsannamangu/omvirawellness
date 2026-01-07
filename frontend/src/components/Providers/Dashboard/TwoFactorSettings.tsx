'use client';

'use client';

import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaKey, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import styles from '@/styles/Providers/Dashboard.module.scss';
import TwoFactorSetupModal from './TwoFactorSetupModal';

interface TwoFactorSettingsProps {
  userId: string;
}

export default function TwoFactorSettings({ userId }: TwoFactorSettingsProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disableToken, setDisableToken] = useState('');
  const [isDisabling, setIsDisabling] = useState(false);

  useEffect(() => {
    load2FAStatus();
  }, [userId]);

  const load2FAStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Get user data which should include 2FA status
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        // For now, we'll check via a separate endpoint or include in user data
        // This is a placeholder - you may need to add an endpoint to get 2FA status
        setTwoFactorEnabled(false); // Default, will be updated when we add status endpoint
      }
    } catch (error) {
      console.error('Error loading 2FA status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!disablePassword) {
      await Swal.fire({
        icon: 'error',
        title: 'Password Required',
        text: 'Please enter your password to disable 2FA',
        confirmButtonColor: '#e74c3c'
      });
      return;
    }

    setIsDisabling(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('http://localhost:4000/api/auth/2fa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: disablePassword,
          token: disableToken || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to disable 2FA');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Google Authenticator Disabled',
        text: 'Google Authenticator has been disabled successfully.',
        confirmButtonColor: '#3085d6'
      });

      setTwoFactorEnabled(false);
      setShowDisableModal(false);
      setDisablePassword('');
      setDisableToken('');
      load2FAStatus();
    } catch (error: any) {
      console.error('Error disabling 2FA:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to disable 2FA. Please try again.',
        confirmButtonColor: '#e74c3c'
      });
    } finally {
      setIsDisabling(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={styles.dashboardSection}>
        <h2 className={styles.sectionTitle}>Two-Factor Authentication</h2>
        
        <div className={styles.settingsForm}>
          <div className={styles.formSection}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '20px',
              background: twoFactorEnabled ? '#e8f5e9' : '#fff3cd',
              border: `1px solid ${twoFactorEnabled ? '#4caf50' : '#ffc107'}`,
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FaShieldAlt style={{ fontSize: '24px', color: twoFactorEnabled ? '#4caf50' : '#ffc107' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>
                    {twoFactorEnabled ? 'Google Authenticator Enabled' : 'Google Authenticator Disabled'}
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                    {twoFactorEnabled 
                      ? 'Your account is protected with two-factor authentication'
                      : 'Add an extra layer of security to your account'
                    }
                  </p>
                </div>
              </div>
              <div>
                {twoFactorEnabled ? (
                  <button
                    className={styles.secondaryBtn}
                    onClick={() => setShowDisableModal(true)}
                  >
                    Disable Google Authenticator
                  </button>
                ) : (
                  <button
                    className={styles.submitButton}
                    onClick={() => setShowSetupModal(true)}
                  >
                    Enable 2FA
                  </button>
                )}
              </div>
            </div>

            {twoFactorEnabled && (
              <div style={{ marginTop: '20px' }}>
                <button
                  className={styles.secondaryBtn}
                  onClick={async () => {
                    const { value: password } = await Swal.fire({
                      title: 'Regenerate Backup Codes',
                      input: 'password',
                      inputLabel: 'Enter your password',
                      inputPlaceholder: 'Password',
                      showCancelButton: true,
                      confirmButtonText: 'Regenerate',
                      confirmButtonColor: '#3085d6',
                      inputValidator: (value) => {
                        if (!value) {
                          return 'Password is required';
                        }
                      }
                    });

                    if (password) {
                      try {
                        const token = localStorage.getItem('token');
                        const response = await fetch('http://localhost:4000/api/auth/2fa/regenerate-backup-codes', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({ password })
                        });

                        const data = await response.json();

                        if (!response.ok) {
                          throw new Error(data.message || 'Failed to regenerate codes');
                        }

                        await Swal.fire({
                          icon: 'success',
                          title: 'Backup Codes Regenerated',
                          html: `
                            <div style="text-align: left; margin: 20px 0;">
                              <p style="margin-bottom: 15px; font-weight: 600;">Your new backup codes:</p>
                              <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 14px;">
                                ${data.backupCodes.map((code: string, i: number) => 
                                  `<div style="margin: 5px 0;">${i + 1}. ${code}</div>`
                                ).join('')}
                              </div>
                              <p style="margin-top: 15px; color: #e74c3c; font-size: 12px;">
                                ⚠️ Save these codes now - you won't see them again!
                              </p>
                            </div>
                          `,
                          confirmButtonText: 'I\'ve Saved These',
                          confirmButtonColor: '#3085d6',
                          width: '600px'
                        });
                      } catch (error: any) {
                        await Swal.fire({
                          icon: 'error',
                          title: 'Error',
                          text: error.message || 'Failed to regenerate backup codes',
                          confirmButtonColor: '#e74c3c'
                        });
                      }
                    }
                  }}
                >
                  Regenerate Backup Codes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Setup Modal */}
      <TwoFactorSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onSuccess={() => {
          setTwoFactorEnabled(true);
          load2FAStatus();
        }}
      />

      {/* Disable Modal */}
      {showDisableModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDisableModal(false)}>
          <div className={`${styles.modalContent} ${styles.billingModal}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Disable Two-Factor Authentication</h2>
              <button className={styles.closeButton} onClick={() => setShowDisableModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleDisable2FA} className={styles.billingForm}>
              <div className={styles.modalBody}>
                <div className={styles.formSection}>
                  <p style={{ marginBottom: '20px', color: '#666' }}>
                    To disable two-factor authentication, please enter your password and a 2FA code from Google Authenticator.
                  </p>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Password <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="password"
                      className={styles.formInput}
                      value={disablePassword}
                      onChange={(e) => setDisablePassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Google Authenticator Code <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      className={styles.formInput}
                      value={disableToken}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setDisableToken(value);
                      }}
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setShowDisableModal(false)}
                  disabled={isDisabling}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isDisabling}
                >
                  {isDisabling ? 'Disabling...' : 'Disable 2FA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

