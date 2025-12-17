'use client';

import styles from '@/styles/Spaces/Dashboard.module.scss';

interface AnalyticsProps {
  activeSubmenu: string;
}

export default function Analytics({ activeSubmenu }: AnalyticsProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'occupancy':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Occupancy Rates</h2>
            <div className={styles.placeholderText}>
              <p>Occupancy data will appear here once you have bookings.</p>
            </div>
          </div>
        );
      
      case 'revenue':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Revenue Insights</h2>
            <div className={styles.placeholderText}>
              <p>Revenue insights will appear here once you have completed bookings.</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Analytics</h2>
            <div className={styles.placeholderText}>
              <p>View analytics and insights for your space rentals.</p>
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
