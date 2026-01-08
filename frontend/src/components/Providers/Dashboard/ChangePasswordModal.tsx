'use client';

import React, { useState } from 'react';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import styles from '@/styles/Providers/Dashboard.module.scss';
import { API_URL } from '@/config/api';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  onSuccess
}: ChangePasswordModalProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  if (!isOpen) return null;

  const validatePassword = (password: string): string | undefined => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain at least one number';
    }
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    setErrors({});

    // Validate current password
    if (!formData.currentPassword) {
      setErrors({ currentPassword: 'Current password is required' });
      return;
    }

    // Validate new password
    const newPasswordError = validatePassword(formData.newPassword);
    if (newPasswordError) {
      setErrors({ newPassword: newPasswordError });
      return;
    }

    // Validate password match
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'New passwords do not match' });
      return;
    }

    // Check if new password is same as current
    if (formData.currentPassword === formData.newPassword) {
      setErrors({ newPassword: 'New password must be different from current password' });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Show error message without throwing (to avoid console error)
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Failed to change password. Please try again.',
          confirmButtonColor: '#e74c3c'
        });
        setIsSubmitting(false);
        return;
      }

      // Success
      await Swal.fire({
        icon: 'success',
        title: 'Password Changed',
        text: 'Your password has been changed successfully.',
        confirmButtonColor: '#4a90e2'
      });

      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});

      onSuccess?.();
      onClose();
    } catch (error: any) {
      // Only log unexpected errors (network errors, etc.)
      if (error.name !== 'TypeError' && !error.message.includes('Failed to change password')) {
        console.error('Error changing password:', error);
      }
      
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to change password. Please try again.',
        confirmButtonColor: '#e74c3c'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className={styles.modalOverlay} onClick={(e) => {
      // Only close if clicking directly on overlay, not on form errors
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className={`${styles.modalContent} ${styles.billingModal}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Change Password</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.billingForm}>
          <div className={styles.modalBody}>
            <div className={styles.formSection}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Current Password <span className={styles.required}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    className={styles.formInput}
                    value={formData.currentPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, currentPassword: e.target.value });
                      if (errors.currentPassword) {
                        setErrors({ ...errors, currentPassword: undefined });
                      }
                    }}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#666',
                      padding: '4px'
                    }}
                  >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <span style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                    {errors.currentPassword}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  New Password <span className={styles.required}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    className={styles.formInput}
                    value={formData.newPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, newPassword: e.target.value });
                      if (errors.newPassword) {
                        setErrors({ ...errors, newPassword: undefined });
                      }
                    }}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#666',
                      padding: '4px'
                    }}
                  >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.newPassword && (
                  <span style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                    {errors.newPassword}
                  </span>
                )}
                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
                  Must be at least 8 characters with uppercase, lowercase, and number
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Confirm New Password <span className={styles.required}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    className={styles.formInput}
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      if (errors.confirmPassword) {
                        setErrors({ ...errors, confirmPassword: undefined });
                      }
                    }}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#666',
                      padding: '4px'
                    }}
                  >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Changing...' : 'Change Password'}
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

