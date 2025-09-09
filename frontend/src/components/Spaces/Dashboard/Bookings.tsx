'use client';

import styles from '@/styles/Spaces/Dashboard.module.scss';

interface BookingsProps {
  activeSubmenu: string;
}

export default function Bookings({ activeSubmenu }: BookingsProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'upcoming':
        return (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Upcoming Bookings</h2>
            <div className={styles.compactList}>
              <div className={styles.compactItem}>
                <div className={styles.compactDate}>
                  <span className={styles.day}>15</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.compactDetails}>
                  <h4 className={styles.compactTitle}>Yoga Studio Rental</h4>
                  <p className={styles.compactClient}>Sarah Johnson • 2:00 PM - 3:00 PM • $120</p>
                </div>
                <div className={styles.compactActions}>
                  <button className={styles.actionBtn}>View Details</button>
                  <button className={styles.messageBtn}>Message</button>
                </div>
              </div>

              <div className={styles.compactItem}>
                <div className={styles.compactDate}>
                  <span className={styles.day}>18</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.compactDetails}>
                  <h4 className={styles.compactTitle}>Meditation Room</h4>
                  <p className={styles.compactClient}>Mike Chen • 10:00 AM - 11:00 AM • $80</p>
                </div>
                <div className={styles.compactActions}>
                  <button className={styles.actionBtn}>View Details</button>
                  <button className={styles.messageBtn}>Message</button>
                </div>
              </div>

              <div className={styles.compactItem}>
                <div className={styles.compactDate}>
                  <span className={styles.day}>22</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.compactDetails}>
                  <h4 className={styles.compactTitle}>Conference Room</h4>
                  <p className={styles.compactClient}>Emma Wilson • 7:00 PM - 8:00 PM • $60</p>
                </div>
                <div className={styles.compactActions}>
                  <button className={styles.actionBtn}>View Details</button>
                  <button className={styles.messageBtn}>Message</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'past':
        return (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Past Bookings</h2>
            <div className={styles.compactList}>
              <div className={styles.compactItem}>
                <div className={styles.compactDate}>
                  <span className={styles.day}>10</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.compactDetails}>
                  <h4 className={styles.compactTitle}>Yoga Studio Rental</h4>
                  <p className={styles.compactClient}>Sarah Johnson • 2:00 PM - 3:00 PM • $120</p>
                </div>
                <div className={styles.compactActions}>
                  <span className={styles.statusCompleted}>Completed</span>
                  <button className={styles.messageBtn}>Message</button>
                </div>
              </div>

              <div className={styles.compactItem}>
                <div className={styles.compactDate}>
                  <span className={styles.day}>8</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.compactDetails}>
                  <h4 className={styles.compactTitle}>Meditation Room</h4>
                  <p className={styles.compactClient}>Mike Chen • 10:00 AM - 11:00 AM • $80</p>
                </div>
                <div className={styles.compactActions}>
                  <span className={styles.statusCompleted}>Completed</span>
                  <button className={styles.messageBtn}>Message</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'canceled':
        return (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Canceled Bookings</h2>
            <div className={styles.compactList}>
              <div className={styles.compactItem}>
                <div className={styles.compactDate}>
                  <span className={styles.day}>5</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.compactDetails}>
                  <h4 className={styles.compactTitle}>Conference Room</h4>
                  <p className={styles.compactClient}>David Kim • 3:00 PM - 4:00 PM • $120</p>
                </div>
                <div className={styles.compactActions}>
                  <span className={styles.statusCanceled}>Canceled</span>
                  <button className={styles.messageBtn}>Message</button>
                </div>
              </div>

              <div className={styles.compactItem}>
                <div className={styles.compactDate}>
                  <span className={styles.day}>3</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.compactDetails}>
                  <h4 className={styles.compactTitle}>Yoga Studio Rental</h4>
                  <p className={styles.compactClient}>Lisa Wang • 11:00 AM - 12:00 PM • $100</p>
                </div>
                <div className={styles.compactActions}>
                  <span className={styles.statusCanceled}>Canceled</span>
                  <button className={styles.messageBtn}>Message</button>
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