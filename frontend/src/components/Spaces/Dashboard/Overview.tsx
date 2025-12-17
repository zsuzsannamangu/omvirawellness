'use client';

import styles from '@/styles/Spaces/Dashboard.module.scss';

interface OverviewProps {
  activeSubmenu: string;
}

export default function Overview({ activeSubmenu }: OverviewProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'dashboard':
        return (
          <div className={styles.overviewContent}>
            <h2 className={styles.sectionTitle}>Space Dashboard</h2>
            <div className={styles.placeholderText}>
              <p>Your dashboard stats and recent bookings will appear here once you have activity.</p>
            </div>
          </div>
        );

      case 'recent':
        return (
          <div className={styles.recentActivity}>
            <h2 className={styles.sectionTitle}>Recent Activity</h2>
            <div className={styles.placeholderText}>
              <p>No recent activity yet.</p>
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
