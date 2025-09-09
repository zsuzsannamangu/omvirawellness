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
            <h2 className={styles.sectionTitle}>Earnings</h2>
            <div className={styles.placeholderText}>
              <p>View your space rental earnings and financial performance.</p>
              <p>Track revenue, fees, and net income from your space listings.</p>
            </div>
          </div>
        );
      
      case 'payouts':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Payout History</h2>
            <div className={styles.placeholderText}>
              <p>View your payout history and payment schedules.</p>
              <p>Track when payments were processed and manage your payout settings.</p>
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
