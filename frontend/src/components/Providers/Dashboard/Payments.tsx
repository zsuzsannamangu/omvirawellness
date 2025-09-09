'use client';

import styles from '@/styles/Providers/Dashboard.module.scss';

interface PaymentsProps {
  activeSubmenu: string;
}

export default function Payments({ activeSubmenu }: PaymentsProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'balance':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Balance Overview</h2>
            <div className={styles.placeholderText}>
              <p>View your current earnings balance and pending payments.</p>
              <p>Track your total earnings, available balance, and upcoming payouts.</p>
            </div>
          </div>
        );
      
      case 'payouts':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Payouts</h2>
            <div className={styles.placeholderText}>
              <p>Manage your payout settings and view payout history.</p>
              <p>Set up automatic payouts and track payment schedules.</p>
            </div>
          </div>
        );
      
      case 'reports':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Reports</h2>
            <div className={styles.placeholderText}>
              <p>Generate detailed financial reports and tax documents.</p>
              <p>Export earnings data for accounting and tax purposes.</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Payments & Earnings</h2>
            <div className={styles.placeholderText}>
              <p>Manage your payments and earnings.</p>
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
