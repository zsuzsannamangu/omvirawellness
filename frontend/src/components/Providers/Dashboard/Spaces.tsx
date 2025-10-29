'use client';

import { FaCheckCircle, FaTimesCircle, FaStar, FaUser, FaCalendarAlt, FaClock, FaDollarSign, FaSearch, FaPlus, FaHeart } from 'react-icons/fa';
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
            <div className={styles.placeholderText}>
              <p>No upcoming space bookings.</p>
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Saved Spaces</h2>
            <div className={styles.placeholderText}>
              <p>No saved spaces yet.</p>
            </div>
          </div>
        );

      case 'past':
        return (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Past Space Bookings</h2>
            <div className={styles.placeholderText}>
              <p>No past space bookings.</p>
            </div>
          </div>
        );

      case 'request':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Request a Space</h2>
            <div className={styles.placeholderText}>
              <p>Space request functionality coming soon.</p>
            </div>
          </div>
        );

      case 'find':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Find a Space</h2>
            <div className={styles.placeholderText}>
              <p>Space search functionality coming soon.</p>
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
