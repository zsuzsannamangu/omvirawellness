'use client';

import styles from '@/styles/Providers/Dashboard.module.scss';

interface AnalyticsProps {
  activeSubmenu: string;
}

export default function Analytics({ activeSubmenu }: AnalyticsProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'bookings':
        return (
          <div className={styles.sessionsContent}>
            <h2 className={styles.sectionTitle}>Bookings</h2>
            <div className={styles.placeholderText}>
              <p>No booking analytics available yet.</p>
            </div>
          </div>
        );

      case 'revenue':
        return (
          <div className={styles.revenueContent}>
            <h2 className={styles.sectionTitle}>Revenue Trends</h2>
            <div className={styles.placeholderText}>
              <p>No revenue data available yet.</p>
            </div>
          </div>
        );

      case 'retention':
        return (
          <div className={styles.reviewsContent}>
            <h2 className={styles.sectionTitle}>Retention</h2>
            <div className={styles.placeholderText}>
              <p>No retention data available yet.</p>
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
