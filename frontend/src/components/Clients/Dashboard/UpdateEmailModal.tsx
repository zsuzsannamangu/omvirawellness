'use client';

import React, { useState } from 'react';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { API_URL } from '@/config/api';
import styles from '@/styles/Clients/Dashboard.module.scss';

interface UpdateEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  onSuccess?: () => void;
}

export default function UpdateEmailModal({
  isOpen,
  onClose,
  currentEmail,
  onSuccess
}: UpdateEmailModalProps) {
  const [formData, setFormData] = useState({
    newEmail: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    newEmail?: string;
    password?: string;
  }>({});

  if (!isOpen) return null;

  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    if (email === currentEmail) {
      return 'New email must be different from current email';
    }
    return undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate new email
    const emailError = validateEmail(formData.newEmail);
    if (emailError) {
      setErrors({ newEmail: emailError });
      return;
    }

    // Validate password
    if (!formData.password) {
      setErrors({ password: 'Password is required' });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/auth/update-email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          newEmail: formData.newEmail,
          password: formData.password
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Failed to parse server response');
      }

      if (!response.ok) {
        // Show error message without throwing (to avoid console error)
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Failed to update email. Please try again.',
          confirmButtonColor: '#e74c3c'
        });
        setIsSubmitting(false);
        return;
      }

      // Update localStorage with new email
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        userData.email = formData.newEmail;
        localStorage.setItem('user', JSON.stringify(userData));
      }

      // Reset form first
      setFormData({
        newEmail: '',
        password: ''
      });
      setErrors({});
      
      // Reset submitting state before showing alert
      setIsSubmitting(false);

      // Call onSuccess before closing to update parent component
      onSuccess?.();

      // Close modal first
      onClose();

      // Show success message after modal closes
      await Swal.fire({
        icon: 'success',
        title: 'Email Updated',
        text: 'Your email has been updated successfully. Please check your inbox to verify your new email address.',
        confirmButtonColor: '#4a90e2'
      });
    } catch (error: any) {
      // Only log unexpected errors (network errors, etc.)
      if (error.name !== 'TypeError' && !error.message.includes('Failed to update email')) {
        console.error('Error updating email:', error);
      }
      
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update email. Please try again.',
        confirmButtonColor: '#e74c3c'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.rescheduleModalOverlay} onClick={onClose}>
      <div className={styles.rescheduleModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.rescheduleModalHeader}>
          <h2>Update Email Address</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.rescheduleModalBody}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Current Email</label>
            <input
              type="email"
              className={styles.formInput}
              value={currentEmail}
              disabled
              style={{ background: '#f5f5f5', color: '#666' }}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              New Email Address <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <input
              type="email"
              className={styles.formInput}
              value={formData.newEmail}
              onChange={(e) => {
                setFormData({ ...formData, newEmail: e.target.value });
                if (errors.newEmail) {
                  setErrors({ ...errors, newEmail: undefined });
                }
              }}
              required
              autoComplete="email"
            />
            {errors.newEmail && (
              <span style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                {errors.newEmail}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Password <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className={styles.formInput}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span style={{ color: '#e74c3c', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>
                {errors.password}
              </span>
            )}
            <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
              Enter your current password to confirm the email change
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', flexDirection: 'row' }}>
            <button
              type="submit"
              className={styles.rescheduleButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Email'}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
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

