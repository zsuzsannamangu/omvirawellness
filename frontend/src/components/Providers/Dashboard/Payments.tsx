'use client';

import { FaDollarSign, FaDownload, FaCalendarAlt, FaCreditCard, FaChartLine, FaFileAlt, FaClock, FaCheckCircle } from 'react-icons/fa';
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
              <p>No earnings data available yet.</p>
            </div>
          </div>
        );
      
      case 'payouts':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Payouts</h2>
            <div className={styles.placeholderText}>
              <p>No payout information available yet.</p>
            </div>
          </div>
        );
      
      case 'reports':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Reports</h2>
            <div className={styles.placeholderText}>
              <p>No reports available yet.</p>
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
    <div className={styles.dashboardSection}>
      {renderContent()}
    </div>
  );
}
