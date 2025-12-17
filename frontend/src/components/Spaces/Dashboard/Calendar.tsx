'use client';

import styles from '@/styles/Spaces/Dashboard.module.scss';

interface CalendarProps {
  activeSubmenu: string;
}

export default function Calendar({ activeSubmenu }: CalendarProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'calendar':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Calendar</h2>
            <div className={styles.placeholderText}>
              <p>Your booking calendar will appear here once you have spaces listed and bookings scheduled.</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Calendar View</h2>
            <div className={styles.placeholderText}>
              <p>View your space bookings and availability in calendar format.</p>
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
