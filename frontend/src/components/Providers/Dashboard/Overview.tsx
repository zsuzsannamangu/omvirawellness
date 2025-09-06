'use client';

import styles from '@/styles/Providers/Dashboard.module.scss';

interface OverviewProps {
  activeSubmenu: string;
}

export default function Overview({ activeSubmenu }: OverviewProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'dashboard':
        return (
          <div className={styles.overviewContent}>
            <h2 className={styles.sectionTitle}>Provider Dashboard</h2>
            
            {/* Stats Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3 className={styles.statNumber}>18</h3>
                  <p className={styles.statLabel}>Sessions This Month</p>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3 className={styles.statNumber}>$3,600</h3>
                  <p className={styles.statLabel}>Revenue This Month</p>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3 className={styles.statNumber}>4.9</h3>
                  <p className={styles.statLabel}>Average Rating</p>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statContent}>
                  <h3 className={styles.statNumber}>24</h3>
                  <p className={styles.statLabel}>Active Clients</p>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className={styles.recentBookings}>
              <h3 className={styles.subsectionTitle}>Recent Sessions</h3>
              <div className={styles.bookingsList}>
                <div className={styles.bookingItem}>
                  <div className={styles.bookingInfo}>
                    <h4 className={styles.bookingTitle}>Massage Therapy Session</h4>
                    <p className={styles.bookingProvider}>with John Smith</p>
                    <p className={styles.bookingTime}>Today, 2:00 PM - 3:00 PM</p>
                  </div>
                  <div className={styles.bookingStatus}>
                    <span className={styles.statusConfirmed}>Completed</span>
                  </div>
                </div>
                
                <div className={styles.bookingItem}>
                  <div className={styles.bookingInfo}>
                    <h4 className={styles.bookingTitle}>Yoga Class</h4>
                    <p className={styles.bookingProvider}>with Emma Wilson</p>
                    <p className={styles.bookingTime}>Tomorrow, 10:00 AM - 11:00 AM</p>
                  </div>
                  <div className={styles.bookingStatus}>
                    <span className={styles.statusPending}>Upcoming</span>
                  </div>
                </div>
                
                <div className={styles.bookingItem}>
                  <div className={styles.bookingInfo}>
                    <h4 className={styles.bookingTitle}>Meditation Session</h4>
                    <p className={styles.bookingProvider}>with Mike Chen</p>
                    <p className={styles.bookingTime}>Dec 22, 7:00 PM - 8:00 PM</p>
                  </div>
                  <div className={styles.bookingStatus}>
                    <span className={styles.statusPending}>Upcoming</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
              <h3 className={styles.subsectionTitle}>Quick Actions</h3>
              <div className={styles.actionsGrid}>
                <button className={styles.actionButton}>
                  <span className={styles.actionLabel}>View Calendar</span>
                </button>
                <button className={styles.actionButton}>
                  <span className={styles.actionLabel}>Update Availability</span>
                </button>
                <button className={styles.actionButton}>
                  <span className={styles.actionLabel}>Manage Services</span>
                </button>
                <button className={styles.actionButton}>
                  <span className={styles.actionLabel}>View Analytics</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'recent':
        return (
          <div className={styles.recentActivity}>
            <h2 className={styles.sectionTitle}>Recent Activity</h2>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <div className={styles.activityContent}>
                  <h4 className={styles.activityTitle}>Session Completed</h4>
                  <p className={styles.activityDescription}>Massage therapy session with John Smith completed successfully</p>
                  <p className={styles.activityTime}>2 hours ago</p>
                </div>
              </div>
              
              <div className={styles.activityItem}>
                <div className={styles.activityContent}>
                  <h4 className={styles.activityTitle}>New Booking Received</h4>
                  <p className={styles.activityDescription}>Emma Wilson booked a yoga class for tomorrow at 10:00 AM</p>
                  <p className={styles.activityTime}>4 hours ago</p>
                </div>
              </div>
              
              <div className={styles.activityItem}>
                <div className={styles.activityContent}>
                  <h4 className={styles.activityTitle}>New Review</h4>
                  <p className={styles.activityDescription}>Mike Chen left a 5-star review for your massage therapy service</p>
                  <p className={styles.activityTime}>1 day ago</p>
                </div>
              </div>
              
              <div className={styles.activityItem}>
                <div className={styles.activityContent}>
                  <h4 className={styles.activityTitle}>Payment Received</h4>
                  <p className={styles.activityDescription}>$120 payment processed for completed meditation session</p>
                  <p className={styles.activityTime}>2 days ago</p>
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
