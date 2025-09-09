'use client';

import { FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaUser, FaDollarSign } from 'react-icons/fa';
import styles from '@/styles/Spaces/Dashboard.module.scss';

interface BookingsProps {
  activeSubmenu: string;
}

export default function Bookings({ activeSubmenu }: BookingsProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'requests':
        return (
          <div className={styles.historyContent}>
            <h2 className={styles.sectionTitle}>Space Requests</h2>
            <div className={styles.compactList}>
              <div className={styles.compactItem}>
                <div className={styles.compactDate}>
                  <span className={styles.day}>20</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.compactDetails}>
                  <h4 className={styles.compactTitle}>Yoga Studio Request</h4>
                  <p className={styles.compactClient}>Wellness Center • 3:00 PM - 4:00 PM • $120</p>
                  <p className={styles.compactRequestInfo}>Requested: Dec 15 • For: Dec 20</p>
                </div>
                <div className={styles.compactActions}>
                  <button className={styles.confirmBtn}>Confirm</button>
                  <button className={styles.declineBtn}>Decline</button>
                  <button className={styles.actionBtn}>View Details</button>
                </div>
              </div>

              <div className={styles.compactItem}>
                <div className={styles.compactDate}>
                  <span className={styles.day}>25</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.compactDetails}>
                  <h4 className={styles.compactTitle}>Meditation Room Request</h4>
                  <p className={styles.compactClient}>Mindful Living • 11:00 AM - 12:00 PM • $80</p>
                  <p className={styles.compactRequestInfo}>Requested: Dec 18 • For: Dec 25</p>
                </div>
                <div className={styles.compactActions}>
                  <button className={styles.confirmBtn}>Confirm</button>
                  <button className={styles.declineBtn}>Decline</button>
                  <button className={styles.actionBtn}>View Details</button>
                </div>
              </div>

              <div className={styles.compactItem}>
                <div className={styles.compactDate}>
                  <span className={styles.day}>28</span>
                  <span className={styles.month}>Dec</span>
                </div>
                <div className={styles.compactDetails}>
                  <h4 className={styles.compactTitle}>Conference Room Request</h4>
                  <p className={styles.compactClient}>Business Retreat • 2:00 PM - 5:00 PM • $180</p>
                  <p className={styles.compactRequestInfo}>Requested: Dec 22 • For: Dec 28</p>
                </div>
                <div className={styles.compactActions}>
                  <button className={styles.confirmBtn}>Confirm</button>
                  <button className={styles.declineBtn}>Decline</button>
                  <button className={styles.actionBtn}>View Details</button>
                </div>
              </div>
            </div>
          </div>
        );
      
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