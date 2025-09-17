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
            <div className={styles.paymentMethods}>
              <div className={styles.paymentCard}>
                <div className={styles.cardInfo}>
                  <div className={styles.cardIcon}><FaCreditCard /></div>
                  <div className={styles.cardDetails}>
                    <h4 className={styles.cardName}>Visa ending in 4242</h4>
                    <p className={styles.cardExpiry}>Expires 12/26</p>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.actionBtn}>Edit</button>
                  <button className={styles.removeBtn}>Remove</button>
                </div>
              </div>

              <div className={styles.paymentCard}>
                <div className={styles.cardInfo}>
                  <div className={styles.cardIcon}><FaUniversity /></div>
                  <div className={styles.cardDetails}>
                    <h4 className={styles.cardName}>Chase Bank Account</h4>
                    <p className={styles.cardExpiry}>Account ending in 1234</p>
                  </div>
                </div>
                <div className={styles.cardActions}>
                  <button className={styles.actionBtn}>Edit</button>
                  <button className={styles.removeBtn}>Remove</button>
                </div>
              </div>

              <button className={styles.addPaymentBtn}>
                <span className={styles.addIcon}><FaPlus /></span>
                Add Payment Method
              </button>
            </div>
          </div>
        );
      
      case 'receipts':
        return (
          <div className={styles.paymentsContent}>
            <h2 className={styles.sectionTitle}>Receipts & Invoices</h2>
            <div className={styles.receiptsList}>
              <div className={styles.receiptItem}>
                <div className={styles.receiptInfo}>
                  <h4 className={styles.receiptTitle}>Massage Therapy - Sarah Johnson</h4>
                  <p className={styles.receiptDate}>December 10, 2024</p>
                  <p className={styles.receiptAmount}>$120.00</p>
                </div>
                <div className={styles.receiptActions}>
                  <button className={styles.downloadBtn}>Download PDF</button>
                  <button className={styles.viewBtn}>View</button>
                </div>
              </div>

              <div className={styles.receiptItem}>
                <div className={styles.receiptInfo}>
                  <h4 className={styles.receiptTitle}>Yoga Class - Mike Chen</h4>
                  <p className={styles.receiptDate}>December 8, 2024</p>
                  <p className={styles.receiptAmount}>$45.00</p>
                </div>
                <div className={styles.receiptActions}>
                  <button className={styles.downloadBtn}>Download PDF</button>
                  <button className={styles.viewBtn}>View</button>
                </div>
              </div>

              <div className={styles.receiptItem}>
                <div className={styles.receiptInfo}>
                  <h4 className={styles.receiptTitle}>Meditation Session - Lisa Wang</h4>
                  <p className={styles.receiptDate}>December 5, 2024</p>
                  <p className={styles.receiptAmount}>$35.00</p>
                </div>
                <div className={styles.receiptActions}>
                  <button className={styles.downloadBtn}>Download PDF</button>
                  <button className={styles.viewBtn}>View</button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.paymentsContent}>
            <h2 className={styles.sectionTitle}>Payments</h2>
            <div className={styles.paymentsOverview}>
              <div className={styles.overviewCard}>
                <h3>Total Spent This Month</h3>
                <p className={styles.amount}>$200.00</p>
                <p className={styles.subtext}>3 appointments</p>
              </div>
              <div className={styles.overviewCard}>
                <h3>Payment Methods</h3>
                <p className={styles.count}>2 methods</p>
                <button className={styles.viewBtn}>Manage</button>
              </div>
              <div className={styles.overviewCard}>
                <h3>Recent Receipts</h3>
                <p className={styles.count}>3 receipts</p>
                <button className={styles.viewBtn}>View All</button>
              </div>
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
