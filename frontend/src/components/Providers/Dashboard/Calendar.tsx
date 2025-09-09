'use client';

import styles from '@/styles/Providers/Dashboard.module.scss';

interface CalendarProps {
  activeSubmenu: string;
}

export default function Calendar({ activeSubmenu }: CalendarProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'sync':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Sync with Google/Apple Calendar</h2>
            <div className={styles.placeholderText}>
              <p>Connect your calendar to sync appointments and availability.</p>
              <p>Integrate with Google Calendar or Apple Calendar for seamless scheduling.</p>
            </div>
          </div>
        );

      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className={styles.dashboardSection}>
      {renderContent()}
    </div>
  );
}
