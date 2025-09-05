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
              <div className={styles.statCard}>
                <h3 className={styles.statNumber}>3</h3>
                <p className={styles.statLabel}>Upcoming Sessions</p>
              </div>

              <div className={styles.statCard}>
                <h3 className={styles.statNumber}>12</h3>
                <p className={styles.statLabel}>Completed Sessions</p>
              </div>

              <div className={styles.statCard}>
                <h3 className={styles.statNumber}>4.8</h3>
                <p className={styles.statLabel}>Average Rating</p>
              </div>

              <div className={styles.statCard}>
                <h3 className={styles.statNumber}>$480</h3>
                <p className={styles.statLabel}>Total Spent</p>
              </div>
            </div>

            <div className={styles.recentActivity}>
              <h3 className={styles.sectionTitle}>Recent Activity</h3>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>Completed massage session with Sarah</p>
                    <p className={styles.activityTime}>2 hours ago</p>
                  </div>
                </div>

                <div className={styles.activityItem}>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>Booked yoga session for tomorrow</p>
                    <p className={styles.activityTime}>1 day ago</p>
                  </div>
                </div>

                <div className={styles.activityItem}>
                  <div className={styles.activityContent}>
                    <p className={styles.activityText}>Payment processed for meditation class</p>
                    <p className={styles.activityTime}>3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'upcoming':
        return (
          <div className={styles.upcomingContent}>
            <h2 className={styles.sectionTitle}>Upcoming Sessions</h2>
            <div className={styles.sessionsList}>
              <div className={styles.sessionCard}>
                <div className={styles.sessionDate}>
                  <span className={styles.day}>15</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.sessionDetails}>
                  <h4 className={styles.sessionTitle}>Massage Therapy</h4>
                  <p className={styles.sessionProvider}>with Sarah Johnson</p>
                  <p className={styles.sessionTime}>2:00 PM - 3:00 PM</p>
                </div>
                <div className={styles.sessionActions}>
                  <button className={styles.actionBtn}>Reschedule</button>
                  <button className={styles.actionBtn}>Cancel</button>
                </div>
              </div>

              <div className={styles.sessionCard}>
                <div className={styles.sessionDate}>
                  <span className={styles.day}>18</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.sessionDetails}>
                  <h4 className={styles.sessionTitle}>Yoga Class</h4>
                  <p className={styles.sessionProvider}>with Mike Chen</p>
                  <p className={styles.sessionTime}>10:00 AM - 11:00 AM</p>
                </div>
                <div className={styles.sessionActions}>
                  <button className={styles.actionBtn}>Reschedule</button>
                  <button className={styles.actionBtn}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'recent':
        return (
          <div className={styles.recentContent}>
            <h2 className={styles.sectionTitle}>Recent Sessions</h2>
            <div className={styles.sessionsList}>
              <div className={styles.sessionCard}>
                <div className={styles.sessionDate}>
                  <span className={styles.day}>12</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.sessionDetails}>
                  <h4 className={styles.sessionTitle}>Meditation Session</h4>
                  <p className={styles.sessionProvider}>with Lisa Wang</p>
                  <p className={styles.sessionTime}>Completed • 1 hour</p>
                  <div className={styles.rating}>
                    <span className={styles.stars}>⭐⭐⭐⭐⭐</span>
                    <span className={styles.ratingText}>5.0</span>
                  </div>
                </div>
                <div className={styles.sessionActions}>
                  <button className={styles.actionBtn}>Review</button>
                  <button className={styles.actionBtn}>Book Again</button>
                </div>
              </div>
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
