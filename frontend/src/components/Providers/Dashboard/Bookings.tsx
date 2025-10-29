'use client';

import { FaCheckCircle, FaTimesCircle, FaStar, FaUser, FaCalendarAlt, FaClock } from 'react-icons/fa';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface BookingsProps {
  activeSubmenu: string;
}

export default function Bookings({ activeSubmenu }: BookingsProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'requests':
        return (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Booking Requests</h2>
            <div className={styles.placeholderText}>
              <p>No booking requests at this time.</p>
            </div>
          </div>
        );

      case 'upcoming':
        return (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Upcoming Sessions</h2>
            <div className={styles.placeholderText}>
              <p>No upcoming sessions scheduled.</p>
            </div>
          </div>
        );

      case 'past':
        return (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Past Sessions</h2>
            <div className={styles.placeholderText}>
              <p>No past sessions yet.</p>
            </div>
          </div>
        );

      case 'canceled':
        return (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Canceled Sessions</h2>
            <div className={styles.placeholderText}>
              <p>No canceled sessions.</p>
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
