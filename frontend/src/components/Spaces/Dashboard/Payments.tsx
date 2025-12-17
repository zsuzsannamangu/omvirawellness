'use client';

import styles from '@/styles/Spaces/Dashboard.module.scss';

interface PaymentsProps {
  activeSubmenu: string;
}

export default function Payments({ activeSubmenu }: PaymentsProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'earnings':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Earnings Overview</h2>
            <div className={styles.placeholderText}>
              <p>Your earnings will appear here once you have completed bookings.</p>
            </div>
          </div>
        );
      
      case 'payouts':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Payout History</h2>
            <div className={styles.placeholderText}>
              <p>No payout history yet.</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Payments</h2>
            <div className={styles.placeholderText}>
              <p>Manage your space rental payments and earnings.</p>
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
