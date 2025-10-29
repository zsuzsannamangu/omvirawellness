'use client';

import { FaEnvelope, FaPaperPlane, FaClock, FaUser, FaBell, FaCheckCircle, FaEdit, FaTrash } from 'react-icons/fa';
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
              <p>No messages yet.</p>
            </div>
          </div>
        );
      
      case 'reminders':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Reminders</h2>
            <div className={styles.placeholderText}>
              <p>No reminders set up yet.</p>
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
    <div className={styles.dashboardSection}>
      {renderContent()}
    </div>
  );
}
