'use client';

import styles from '@/styles/Spaces/Dashboard.module.scss';

interface BookingsProps {
  activeSubmenu: string;
}

export default function Bookings({ activeSubmenu }: BookingsProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'requests':
        return (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Space Requests</h2>
            <div className={styles.placeholderText}>
              <p>No booking requests yet.</p>
            </div>
          </div>
        );
      
      case 'upcoming':
        return (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Upcoming Bookings</h2>
            <div className={styles.placeholderText}>
              <p>No upcoming bookings yet.</p>
            </div>
          </div>
        );

      case 'past':
        return (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Past Bookings</h2>
            <div className={styles.placeholderText}>
              <p>No past bookings yet.</p>
            </div>
          </div>
        );

      case 'canceled':
        return (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Canceled Bookings</h2>
            <div className={styles.placeholderText}>
              <p>No canceled bookings.</p>
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
