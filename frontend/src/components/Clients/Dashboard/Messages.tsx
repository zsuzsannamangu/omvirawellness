'use client';

import { FaCheckCircle, FaClock, FaDollarSign, FaUser } from 'react-icons/fa';
import styles from '@/styles/Clients/Dashboard.module.scss';

interface MessagesProps {
  activeSubmenu: string;
}

export default function Messages({ activeSubmenu }: MessagesProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'confirmations':
        return (
          <div className={styles.messagesContent}>
            <h2 className={styles.sectionTitle}>Confirmations</h2>
            <div className={styles.placeholderText}>No confirmations yet.</div>
          </div>
        );
      
      case 'direct':
        return (
          <div className={styles.messagesContent}>
            <h2 className={styles.sectionTitle}>Direct Communication</h2>
            <div className={styles.placeholderText}>No messages yet.</div>
          </div>
        );
      
      default:
        return (
          <div className={styles.messagesContent}>
            <h2 className={styles.sectionTitle}>Messages</h2>
            <div className={styles.placeholderText}>No messages yet.</div>
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
