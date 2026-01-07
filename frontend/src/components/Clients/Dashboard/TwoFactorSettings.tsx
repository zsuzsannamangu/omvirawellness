'use client';

import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaKey, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_URL } from '@/config/api';
import styles from '@/styles/Clients/Dashboard.module.scss';
import TwoFactorSetupModal from '@/components/Providers/Dashboard/TwoFactorSetupModal';

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

      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        // Check if 2FA is enabled from user data
        setTwoFactorEnabled(userData.two_factor_enabled || false);
      }
      
      // Also try to fetch from API to get latest status
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const verifyResponse = await fetch(`${API_URL}/auth/verify`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json();
            if (verifyData.user?.two_factor_enabled !== undefined) {
              setTwoFactorEnabled(verifyData.user.two_factor_enabled);
            }
          }
        }
      } catch (err) {
        // Fall back to localStorage value
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

      const response = await fetch(`${API_URL}/auth/2fa/disable`, {
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
        confirmButtonColor: '#4a90e2'
      });

      setTwoFactorEnabled(false);
      setShowDisableModal(false);
      setDisablePassword('');
      setDisableToken('');
      
      // Update localStorage
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        userData.two_factor_enabled = false;
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
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
      <div>
        <div className={styles.formGroup} style={{ marginTop: '0' }}>
          <label className={styles.formLabel}>TWO-FACTOR AUTHENTICATION (RECOMMENDED)</label>
        </div>
        
        <div>
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
                    className={styles.saveBtn}
                    onClick={() => setShowDisableModal(true)}
                  >
                    Disable Google Authenticator
                  </button>
                ) : (
                  <button
                    className={styles.saveBtn}
                    onClick={() => setShowSetupModal(true)}
                  >
                    Enable Google Authenticator
                  </button>
                )}
              </div>
            </div>

            {twoFactorEnabled && (
              <div style={{ marginTop: '20px' }}>
                <button
                  className={styles.saveBtn}
                  onClick={async () => {
                    const { value: password } = await Swal.fire({
                      title: 'Regenerate Backup Codes',
                      input: 'password',
                      inputLabel: 'Enter your password',
                      inputPlaceholder: 'Password',
                      showCancelButton: true,
                      confirmButtonText: 'Regenerate',
                      confirmButtonColor: '#4a90e2',
                      inputValidator: (value) => {
                        if (!value) {
                          return 'Password is required';
                        }
                      }
                    });

                    if (password) {
                      try {
                        const token = localStorage.getItem('token');
                        const response = await fetch(`${API_URL}/auth/2fa/regenerate-backup-codes`, {
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
                          confirmButtonColor: '#4a90e2',
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
          // Update localStorage
          const user = localStorage.getItem('user');
          if (user) {
            const userData = JSON.parse(user);
            userData.two_factor_enabled = true;
            localStorage.setItem('user', JSON.stringify(userData));
          }
          load2FAStatus();
        }}
      />

      {/* Disable Modal */}
      {showDisableModal && (
        <div className={styles.rescheduleModalOverlay} onClick={() => setShowDisableModal(false)}>
          <div className={styles.rescheduleModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.rescheduleModalHeader}>
              <h2>Disable Google Authenticator</h2>
              <button className={styles.closeButton} onClick={() => setShowDisableModal(false)}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleDisable2FA} className={styles.rescheduleModalBody}>
              <div className={styles.formGroup}>
                <p style={{ marginBottom: '20px', color: '#666' }}>
                  To disable two-factor authentication, please enter your password and a 2FA code from Google Authenticator.
                </p>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Password <span style={{ color: '#e74c3c' }}>*</span>
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
                    Google Authenticator Code <span style={{ color: '#e74c3c' }}>*</span>
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

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', flexDirection: 'row' }}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowDisableModal(false)}
                  disabled={isDisabling}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.rescheduleButton}
                  disabled={isDisabling}
                >
                  {isDisabling ? 'Disabling...' : 'Disable Google Authenticator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
