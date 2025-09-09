'use client';

import styles from '@/styles/Spaces/Dashboard.module.scss';

interface ProfileProps {
  activeSubmenu: string;
}

export default function Profile({ activeSubmenu }: ProfileProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'host':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Host Info</h2>
            <div className={styles.placeholderText}>
              <p>Manage your host profile and contact information.</p>
              <p>Update your bio, contact details, and host verification status.</p>
            </div>
          </div>
        );
      
      case 'policies':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Policies</h2>
            <div className={styles.placeholderText}>
              <p>Set rental policies and terms for your spaces.</p>
              <p>Define cancellation policies, house rules, and rental terms.</p>
            </div>
          </div>
        );
      
      case 'instructions':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Instructions</h2>
            <div className={styles.placeholderText}>
              <p>Provide instructions for renters using your spaces.</p>
              <p>Share access codes, parking info, and usage guidelines.</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Profile & Settings</h2>
            <div className={styles.placeholderText}>
              <p>Manage your host profile and space settings.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.content}>
      {renderContent()}
    </div>
  );
}
