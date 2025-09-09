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
              <p>Track your space occupancy rates and utilization.</p>
              <p>Analyze peak times, popular spaces, and booking patterns.</p>
            </div>
          </div>
        );
      
      case 'revenue':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Revenue Insights</h2>
            <div className={styles.placeholderText}>
              <p>Analyze your space rental revenue and financial performance.</p>
              <p>View trends, compare periods, and identify growth opportunities.</p>
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