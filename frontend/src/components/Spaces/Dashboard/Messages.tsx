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
            <h2 className={styles.sectionTitle}>Inquiries</h2>
            <div className={styles.placeholderText}>
              <p>Manage rental inquiries from potential renters.</p>
              <p>Respond to questions and booking requests for your spaces.</p>
            </div>
          </div>
        );
      
      case 'confirmations':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Confirmations</h2>
            <div className={styles.placeholderText}>
              <p>Send and manage booking confirmations.</p>
              <p>Automate confirmations and send custom messages to renters.</p>
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
