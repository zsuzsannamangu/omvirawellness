'use client';

import styles from '@/styles/Spaces/Dashboard.module.scss';

interface MessagesProps {
  activeSubmenu: string;
}

export default function Messages({ activeSubmenu }: MessagesProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'inquiries':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Rental Inquiries</h2>
            <div className={styles.placeholderText}>
              <p>No inquiries yet.</p>
            </div>
          </div>
        );
      
      case 'confirmations':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Booking Confirmations</h2>
            <div className={styles.placeholderText}>
              <p>No confirmations to display.</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Messages</h2>
            <div className={styles.placeholderText}>
              <p>Manage all your space rental communications.</p>
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
