'use client';

import styles from '@/styles/Clients/Dashboard.module.scss';

interface CalendarProps {
  activeSubmenu: string;
}

export default function Calendar({ activeSubmenu }: CalendarProps) {
  const renderContent = () => {
    return (
      <div className={styles.dashboardSection}>
        <h2 className={styles.sectionTitle}>Calendar View</h2>
        <div className={styles.placeholderText}>
          <p>Your personal calendar view of booked sessions.</p>
          <p>See all your upcoming appointments in a calendar format.</p>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.content}>
      {renderContent()}
    </div>
  );
}
