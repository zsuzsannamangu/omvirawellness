'use client';

import styles from '@/styles/Providers/Dashboard.module.scss';

interface BookingsProps {
  activeSubmenu: string;
}

export default function Bookings({ activeSubmenu }: BookingsProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'upcoming':
        return (
          <div className={styles.bookingsContent}>
            <h2 className={styles.sectionTitle}>Upcoming Sessions</h2>
            <div className={styles.bookingsList}>
              <div className={styles.bookingCard}>
                <div className={styles.bookingHeader}>
                  <div className={styles.bookingDate}>
                    <span className={styles.day}>15</span>
                    <span className={styles.month}>Dec</span>
                  </div>
                  <div className={styles.bookingDetails}>
                    <h4 className={styles.bookingTitle}>Massage Therapy Session</h4>
                    <p className={styles.bookingClient}>with John Smith</p>
                    <p className={styles.bookingTime}>2:00 PM - 3:00 PM</p>
                    <p className={styles.bookingPrice}>$120</p>
                  </div>
                  <div className={styles.bookingActions}>
                    <button className={styles.actionBtn}>View Details</button>
                    <button className={styles.actionBtn}>Message Client</button>
                  </div>
                </div>
              </div>

              <div className={styles.bookingCard}>
                <div className={styles.bookingHeader}>
                  <div className={styles.bookingDate}>
                    <span className={styles.day}>18</span>
                    <span className={styles.month}>Dec</span>
                  </div>
                  <div className={styles.bookingDetails}>
                    <h4 className={styles.bookingTitle}>Yoga Class</h4>
                    <p className={styles.bookingClient}>with Emma Wilson</p>
                    <p className={styles.bookingTime}>10:00 AM - 11:00 AM</p>
                    <p className={styles.bookingPrice}>$80</p>
                  </div>
                  <div className={styles.bookingActions}>
                    <button className={styles.actionBtn}>View Details</button>
                    <button className={styles.actionBtn}>Message Client</button>
                  </div>
                </div>
              </div>

              <div className={styles.bookingCard}>
                <div className={styles.bookingHeader}>
                  <div className={styles.bookingDate}>
                    <span className={styles.day}>22</span>
                    <span className={styles.month}>Dec</span>
                  </div>
                  <div className={styles.bookingDetails}>
                    <h4 className={styles.bookingTitle}>Meditation Session</h4>
                    <p className={styles.bookingClient}>with Mike Chen</p>
                    <p className={styles.bookingTime}>7:00 PM - 8:00 PM</p>
                    <p className={styles.bookingPrice}>$60</p>
                  </div>
                  <div className={styles.bookingActions}>
                    <button className={styles.actionBtn}>View Details</button>
                    <button className={styles.actionBtn}>Message Client</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'pending':
        return (
          <div className={styles.pendingContent}>
            <h2 className={styles.sectionTitle}>Pending Requests</h2>
            <div className={styles.requestsList}>
              <div className={styles.requestCard}>
                <div className={styles.requestInfo}>
                  <h4 className={styles.requestTitle}>Massage Therapy Session</h4>
                  <p className={styles.requestClient}>Requested by David Kim</p>
                  <p className={styles.requestTime}>Dec 25, 3:00 PM - 4:00 PM</p>
                  <p className={styles.requestPrice}>$120</p>
                </div>
                <div className={styles.requestActions}>
                  <button className={styles.approveBtn}>Approve</button>
                  <button className={styles.declineBtn}>Decline</button>
                </div>
              </div>

              <div className={styles.requestCard}>
                <div className={styles.requestInfo}>
                  <h4 className={styles.requestTitle}>Personal Training</h4>
                  <p className={styles.requestClient}>Requested by Lisa Wang</p>
                  <p className={styles.requestTime}>Dec 26, 11:00 AM - 12:00 PM</p>
                  <p className={styles.requestPrice}>$100</p>
                </div>
                <div className={styles.requestActions}>
                  <button className={styles.approveBtn}>Approve</button>
                  <button className={styles.declineBtn}>Decline</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'history':
        return (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Session History</h2>
            <div className={styles.historyList}>
              <div className={styles.historyItem}>
                <div className={styles.historyDate}>
                  <span className={styles.day}>10</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.historyDetails}>
                  <h4 className={styles.historyTitle}>Massage Therapy Session</h4>
                  <p className={styles.historyClient}>with John Smith</p>
                  <p className={styles.historyTime}>2:00 PM - 3:00 PM</p>
                  <p className={styles.historyPrice}>$120</p>
                </div>
                <div className={styles.historyStatus}>
                  <span className={styles.statusCompleted}>Completed</span>
                </div>
              </div>

              <div className={styles.historyItem}>
                <div className={styles.historyDate}>
                  <span className={styles.day}>8</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.historyDetails}>
                  <h4 className={styles.historyTitle}>Yoga Class</h4>
                  <p className={styles.historyClient}>with Emma Wilson</p>
                  <p className={styles.historyTime}>10:00 AM - 11:00 AM</p>
                  <p className={styles.historyPrice}>$80</p>
                </div>
                <div className={styles.historyStatus}>
                  <span className={styles.statusCompleted}>Completed</span>
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
