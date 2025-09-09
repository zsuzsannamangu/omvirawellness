'use client';

import styles from '@/styles/Providers/Dashboard.module.scss';

interface ProfileProps {
  activeSubmenu: string;
}

export default function Profile({ activeSubmenu }: ProfileProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'services':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Service Menu</h2>
            <div className={styles.placeholderText}>
              <p>Manage your service offerings and pricing.</p>
              <p>Add, edit, or remove services you provide to clients.</p>
            </div>
          </div>
        );
      
      case 'availability':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Availability</h2>
            <div className={styles.placeholderText}>
              <p>Set your working hours and availability schedule.</p>
              <p>Block out times when you're not available for bookings.</p>
            </div>
          </div>
        );
      
      case 'bio':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Bio</h2>
            <div className={styles.placeholderText}>
              <p>Write and edit your professional bio.</p>
              <p>Tell clients about your background, experience, and approach.</p>
            </div>
          </div>
        );
      
      case 'certifications':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Certifications</h2>
            <div className={styles.placeholderText}>
              <p>Upload and manage your professional certifications.</p>
              <p>Showcase your qualifications and credentials to clients.</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Profile & Settings</h2>
            <div className={styles.placeholderText}>
              <p>Manage your profile and account settings.</p>
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
