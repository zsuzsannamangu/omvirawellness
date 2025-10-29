'use client';

import { FaGoogle, FaApple, FaCalendarAlt, FaSync, FaCheckCircle, FaClock, FaUser } from 'react-icons/fa';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface CalendarProps {
  activeSubmenu: string;
}

export default function Calendar({ activeSubmenu }: CalendarProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'overview':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Calendar Overview</h2>
            <div className={styles.placeholderText}>
              <p>No calendar events yet.</p>
            </div>
          </div>
        );

      case 'sync':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Sync with Google/Apple Calendar</h2>
            <div className={styles.placeholderText}>
              <p>Calendar sync not yet available.</p>
            </div>
          </div>
        );

      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Calendar Overview</h2>
            <div className={styles.placeholderText}>
              <p>Select a calendar option from the submenu above.</p>
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
