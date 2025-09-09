'use client';

import styles from '@/styles/Providers/Dashboard.module.scss';

interface MessagesProps {
  activeSubmenu: string;
}

export default function Messages({ activeSubmenu }: MessagesProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'communication':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Client Communication</h2>
            <div className={styles.placeholderText}>
              <p>Direct messaging with your clients.</p>
              <p>Send messages, share updates, and maintain client relationships.</p>
            </div>
          </div>
        );
      
      case 'reminders':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Reminders</h2>
            <div className={styles.placeholderText}>
              <p>Send appointment reminders and follow-up messages.</p>
              <p>Automate client communications and appointment confirmations.</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Messages</h2>
            <div className={styles.placeholderText}>
              <p>Manage all your client communications.</p>
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
