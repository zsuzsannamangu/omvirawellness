'use client';

import { useState } from 'react';
import { FaCheckCircle, FaCircle } from 'react-icons/fa';
import styles from '@/styles/Providers/SignupSteps.module.scss';

interface PasswordStepProps {
  onNext: (data: { password: string }) => void;
  onBack: () => void;
  initialData: any;
}

export default function PasswordStep({ onNext, onBack, initialData }: PasswordStepProps) {
  const [password, setPassword] = useState(initialData.password || '');
  const [showPassword, setShowPassword] = useState(false);

  const passwordRequirements = [
    { text: 'at least one letter', met: /[a-zA-Z]/.test(password) },
    { text: 'at least one digit', met: /\d/.test(password) },
    { text: '8 characters or more', met: password.length >= 8 }
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allRequirementsMet) {
      onNext({ password });
    }
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>Password Setup</h1>
      <p className={styles.subtitle}>Enter the password for your provider profile.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            PASSWORD
          </label>
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.passwordInput}
              placeholder="Password"
              required
            />
            <button
              type="button"
              className={styles.showButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>
        </div>

        <div className={styles.requirements}>
          <p className={styles.requirementsTitle}>The password must contain:</p>
          <ul className={styles.requirementsList}>
            {passwordRequirements.map((req, index) => (
              <li key={index} className={`${styles.requirement} ${req.met ? styles.met : ''}`}>
                <span className={styles.checkmark}>{req.met ? <FaCheckCircle /> : <FaCircle />}</span>
                {req.text}
              </li>
            ))}
          </ul>
        </div>
        
        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button 
            type="submit" 
            className={styles.continueButton}
            disabled={!allRequirementsMet}
          >
            CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}
