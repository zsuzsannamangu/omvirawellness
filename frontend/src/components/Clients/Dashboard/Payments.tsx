'use client';

import { FaCreditCard, FaUniversity, FaPlus } from 'react-icons/fa';
import styles from '@/styles/Clients/Dashboard.module.scss';

interface PaymentsProps {
  activeSubmenu: string;
}

export default function Payments({ activeSubmenu }: PaymentsProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'methods':
        return (
          <div className={styles.paymentsContent}>
            <h2 className={styles.sectionTitle}>Payment Methods</h2>
            <div className={styles.placeholderText}>No payment methods yet.</div>
          </div>
        );
      
      case 'receipts':
        return (
          <div className={styles.paymentsContent}>
            <h2 className={styles.sectionTitle}>Payment History</h2>
            <div className={styles.placeholderText}>No payment history yet.</div>
          </div>
        );
      
      default:
        return (
          <div className={styles.paymentsContent}>
            <h2 className={styles.sectionTitle}>Payments</h2>
            <div className={styles.placeholderText}>No payments data yet.</div>
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
