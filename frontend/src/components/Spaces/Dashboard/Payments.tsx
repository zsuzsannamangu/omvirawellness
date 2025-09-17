'use client';

import { FaDollarSign, FaChartLine, FaDownload, FaEye, FaCalendarAlt, FaUser } from 'react-icons/fa';
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
            
            <div className={styles.earningsGrid}>
              <div className={styles.earningsCard}>
                <div className={styles.earningsIcon}><FaDollarSign /></div>
                <div className={styles.earningsInfo}>
                  <h3 className={styles.earningsAmount}>$2,400</h3>
                  <p className={styles.earningsLabel}>This Month</p>
                </div>
              </div>
              
              <div className={styles.earningsCard}>
                <div className={styles.earningsIcon}><FaChartLine /></div>
                <div className={styles.earningsInfo}>
                  <h3 className={styles.earningsAmount}>$18,500</h3>
                  <p className={styles.earningsLabel}>Total Earnings</p>
                </div>
              </div>
              
              <div className={styles.earningsCard}>
                <div className={styles.earningsIcon}><FaUser /></div>
                <div className={styles.earningsInfo}>
                  <h3 className={styles.earningsAmount}>89</h3>
                  <p className={styles.earningsLabel}>Total Bookings</p>
                </div>
              </div>
            </div>

            <div className={styles.recentEarnings}>
              <h3 className={styles.subsectionTitle}>Recent Earnings</h3>
              <div className={styles.earningsList}>
                <div className={styles.earningsItem}>
                  <div className={styles.earningsDate}>
                    <FaCalendarAlt /> Dec 15, 2024
                  </div>
                  <div className={styles.earningsDetails}>
                    <h4 className={styles.earningsTitle}>Yoga Studio Rental</h4>
                    <p className={styles.earningsClient}><FaUser /> Sarah Johnson • 2:00 PM - 3:00 PM</p>
                  </div>
                  <div className={styles.earningsAmount}>
                    <span className={styles.amount}>$120.00</span>
                    <span className={styles.status}>Completed</span>
                  </div>
                </div>

                <div className={styles.earningsItem}>
                  <div className={styles.earningsDate}>
                    <FaCalendarAlt /> Dec 14, 2024
                  </div>
                  <div className={styles.earningsDetails}>
                    <h4 className={styles.earningsTitle}>Meditation Room</h4>
                    <p className={styles.earningsClient}><FaUser /> Mike Chen • 10:00 AM - 11:00 AM</p>
                  </div>
                  <div className={styles.earningsAmount}>
                    <span className={styles.amount}>$80.00</span>
                    <span className={styles.status}>Completed</span>
                  </div>
                </div>

                <div className={styles.earningsItem}>
                  <div className={styles.earningsDate}>
                    <FaCalendarAlt /> Dec 13, 2024
                  </div>
                  <div className={styles.earningsDetails}>
                    <h4 className={styles.earningsTitle}>Conference Room</h4>
                    <p className={styles.earningsClient}><FaUser /> Emma Wilson • 7:00 PM - 8:00 PM</p>
                  </div>
                  <div className={styles.earningsAmount}>
                    <span className={styles.amount}>$60.00</span>
                    <span className={styles.status}>Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'payouts':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Payout History</h2>
            
            <div className={styles.payoutsList}>
              <div className={styles.payoutItem}>
                <div className={styles.payoutDate}>
                  <FaCalendarAlt /> Dec 15, 2024
                </div>
                <div className={styles.payoutDetails}>
                  <h4 className={styles.payoutTitle}>Weekly Payout</h4>
                  <p className={styles.payoutPeriod}>Dec 8 - Dec 14, 2024</p>
                </div>
                <div className={styles.payoutAmount}>
                  <span className={styles.amount}>$1,240.00</span>
                  <span className={styles.status}>Completed</span>
                </div>
                <div className={styles.payoutActions}>
                  <button className={styles.actionBtn}><FaDownload /> Download</button>
                  <button className={styles.viewBtn}><FaEye /> View</button>
                </div>
              </div>

              <div className={styles.payoutItem}>
                <div className={styles.payoutDate}>
                  <FaCalendarAlt /> Dec 8, 2024
                </div>
                <div className={styles.payoutDetails}>
                  <h4 className={styles.payoutTitle}>Weekly Payout</h4>
                  <p className={styles.payoutPeriod}>Dec 1 - Dec 7, 2024</p>
                </div>
                <div className={styles.payoutAmount}>
                  <span className={styles.amount}>$1,180.00</span>
                  <span className={styles.status}>Completed</span>
                </div>
                <div className={styles.payoutActions}>
                  <button className={styles.actionBtn}><FaDownload /> Download</button>
                  <button className={styles.viewBtn}><FaEye /> View</button>
                </div>
              </div>

              <div className={styles.payoutItem}>
                <div className={styles.payoutDate}>
                  <FaCalendarAlt /> Dec 1, 2024
                </div>
                <div className={styles.payoutDetails}>
                  <h4 className={styles.payoutTitle}>Weekly Payout</h4>
                  <p className={styles.payoutPeriod}>Nov 24 - Nov 30, 2024</p>
                </div>
                <div className={styles.payoutAmount}>
                  <span className={styles.amount}>$980.00</span>
                  <span className={styles.status}>Completed</span>
                </div>
                <div className={styles.payoutActions}>
                  <button className={styles.actionBtn}><FaDownload /> Download</button>
                  <button className={styles.viewBtn}><FaEye /> View</button>
                </div>
              </div>
            </div>

            <div className={styles.payoutSettings}>
              <h3 className={styles.subsectionTitle}>Payout Settings</h3>
              <div className={styles.settingsCard}>
                <div className={styles.settingItem}>
                  <label className={styles.settingLabel}>Payout Method</label>
                  <span className={styles.settingValue}>Bank Account (****1234)</span>
                  <button className={styles.editBtn}>Edit</button>
                </div>
                <div className={styles.settingItem}>
                  <label className={styles.settingLabel}>Payout Schedule</label>
                  <span className={styles.settingValue}>Weekly (Every Monday)</span>
                  <button className={styles.editBtn}>Edit</button>
                </div>
                <div className={styles.settingItem}>
                  <label className={styles.settingLabel}>Minimum Payout</label>
                  <span className={styles.settingValue}>$50.00</span>
                  <button className={styles.editBtn}>Edit</button>
                </div>
              </div>
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
