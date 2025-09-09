'use client';

import styles from '@/styles/Providers/Dashboard.module.scss';

interface SpacesProps {
  activeSubmenu: string;
}

export default function Spaces({ activeSubmenu }: SpacesProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'upcoming':
        return (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Upcoming Space Bookings</h2>
            <div className={styles.compactList}>
              <div className={styles.compactItem}>
                <div className={styles.compactDate}>
                  <span className={styles.day}>20</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.compactDetails}>
                  <h4 className={styles.compactTitle}>Yoga Studio Rental</h4>
                  <p className={styles.compactClient}>Zen Wellness Center • 9:00 AM - 11:00 AM • $150</p>
                </div>
                <div className={styles.compactActions}>
                  <button className={styles.actionBtn}>View Details</button>
                  <button className={styles.messageBtn}>Message</button>
                </div>
              </div>

              <div className={styles.compactItem}>
                <div className={styles.compactDate}>
                  <span className={styles.day}>25</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.compactDetails}>
                  <h4 className={styles.compactTitle}>Meditation Room</h4>
                  <p className={styles.compactClient}>Peaceful Space • 2:00 PM - 4:00 PM • $80</p>
                </div>
                <div className={styles.compactActions}>
                  <button className={styles.actionBtn}>View Details</button>
                  <button className={styles.messageBtn}>Message</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Favorite Spaces</h2>
            <div className={styles.placeholderText}>
              <p>Your favorite spaces will appear here.</p>
              <p>Save spaces you frequently rent for quick access.</p>
            </div>
          </div>
        );

      case 'past':
        return (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Past Space Bookings</h2>
            <div className={styles.compactList}>
              <div className={styles.compactItem}>
                <div className={styles.compactDate}>
                  <span className={styles.day}>10</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.compactDetails}>
                  <h4 className={styles.compactTitle}>Conference Room</h4>
                  <p className={styles.compactClient}>Business Center • 10:00 AM - 12:00 PM • $200</p>
                </div>
                <div className={styles.compactActions}>
                  <span className={styles.statusCompleted}>Completed</span>
                  <button className={styles.messageBtn}>Message</button>
                </div>
              </div>

              <div className={styles.compactItem}>
                <div className={styles.compactDate}>
                  <span className={styles.day}>5</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.compactDetails}>
                  <h4 className={styles.compactTitle}>Wellness Studio</h4>
                  <p className={styles.compactClient}>Healing Hub • 3:00 PM - 5:00 PM • $120</p>
                </div>
                <div className={styles.compactActions}>
                  <span className={styles.statusCompleted}>Completed</span>
                  <button className={styles.messageBtn}>Message</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'request':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Request a Space</h2>
            <div className={styles.placeholderText}>
              <p>Submit a request for a specific space rental.</p>
              <p>Specify your requirements and preferred dates.</p>
            </div>
          </div>
        );

      case 'find':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Find a Space</h2>
            <div className={styles.placeholderText}>
              <p>Browse available spaces for rent.</p>
              <p>Search by location, amenities, and availability.</p>
            </div>
          </div>
        );

      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Space Rentals</h2>
            <div className={styles.placeholderText}>
              <p>Manage your space rental bookings and preferences.</p>
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
