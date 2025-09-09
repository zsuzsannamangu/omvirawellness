'use client';

import styles from '@/styles/Clients/Dashboard.module.scss';

interface MessagesProps {
  activeSubmenu: string;
}

export default function Messages({ activeSubmenu }: MessagesProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'confirmations':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Confirmations</h2>
            <div className={styles.placeholderText}>
              <p>Booking confirmations and appointment reminders.</p>
              <p>Stay updated on your wellness appointments.</p>
            </div>
          </div>
        );
      
      case 'direct':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Direct Communication</h2>
            <div className={styles.placeholderText}>
              <p>Direct messages with your wellness providers.</p>
              <p>Communicate directly with your booked providers.</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Messages</h2>
            <div className={styles.placeholderText}>
              <p>All your wellness-related communications.</p>
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
