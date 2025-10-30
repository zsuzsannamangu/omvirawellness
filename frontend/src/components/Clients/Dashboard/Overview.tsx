'use client';

import styles from '@/styles/Clients/Dashboard.module.scss';

interface OverviewProps {
  activeSubmenu: string;
}

export default function Overview({ activeSubmenu }: OverviewProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'overview':
        return (
          <div className={styles.overviewContent}>
            <div className={styles.welcomeSection}>
              <h2 className={styles.welcomeTitle}>Welcome back!</h2>
              <p className={styles.welcomeSubtitle}>
                Here's what's happening with your wellness journey
              </p>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}><p className={styles.statLabel}>Upcoming Sessions</p><h3 className={styles.statNumber}>—</h3></div>
              <div className={styles.statCard}><p className={styles.statLabel}>Completed Sessions</p><h3 className={styles.statNumber}>—</h3></div>
              <div className={styles.statCard}><p className={styles.statLabel}>Average Rating</p><h3 className={styles.statNumber}>—</h3></div>
              <div className={styles.statCard}><p className={styles.statLabel}>Total Spent</p><h3 className={styles.statNumber}>—</h3></div>
            </div>

            <div className={styles.recentActivity}>
              <h3 className={styles.sectionTitle}>Recent Activity</h3>
              <div className={styles.activityList}>
                <div className={styles.placeholderText}>No recent activity yet.</div>
              </div>
            </div>
          </div>
        );

      case 'upcoming':
        return (
          <div className={styles.upcomingContent}>
            <h2 className={styles.sectionTitle}>Upcoming Sessions</h2>
            <div className={styles.sessionsList}><div className={styles.placeholderText}>No upcoming sessions.</div></div>
          </div>
        );

      case 'recent':
        return (
          <div className={styles.recentContent}>
            <h2 className={styles.sectionTitle}>Recent Sessions</h2>
            <div className={styles.sessionsList}><div className={styles.placeholderText}>No recent sessions.</div></div>
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
