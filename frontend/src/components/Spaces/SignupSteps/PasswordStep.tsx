'use client';

import { useState } from 'react';
import styles from '@/styles/Spaces/SignupSteps.module.scss';

interface PasswordStepProps {
  onNext: (data: { password: string }) => void;
  onBack: () => void;
  initialData: any;
}

export default function PasswordStep({ onNext, onBack, initialData }: PasswordStepProps) {
  const [password, setPassword] = useState(initialData.password || '');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      onNext({ password });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`${styles.stepContainer} ${styles.passwordStep}`}>
      <h1 className={styles.title}>Create a secure password</h1>
      <p className={styles.subtitle}>Choose a strong password to protect your account</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>PASSWORD</label>
          <div className={styles.passwordInputContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.textInput}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={styles.passwordToggle}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>
        
        <div className={styles.passwordRequirements}>
          <p className={styles.requirementsTitle}>Password must contain:</p>
          <ul className={styles.requirementsList}>
            <li className={password.length >= 8 ? styles.requirementMet : styles.requirementUnmet}>
              At least 8 characters
            </li>
            <li className={/[A-Z]/.test(password) ? styles.requirementMet : styles.requirementUnmet}>
              One uppercase letter
            </li>
            <li className={/[a-z]/.test(password) ? styles.requirementMet : styles.requirementUnmet}>
              One lowercase letter
            </li>
            <li className={/\d/.test(password) ? styles.requirementMet : styles.requirementUnmet}>
              One number
            </li>
          </ul>
        </div>
        
        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button 
            type="submit" 
            className={styles.continueButton}
            disabled={!password || password.length < 8}
          >
            CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}
