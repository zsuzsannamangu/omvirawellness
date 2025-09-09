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
            
            <div className={styles.balanceCards}>
              <div className={styles.balanceCard}>
                <div className={styles.balanceIcon}>
                  <FaDollarSign />
                </div>
                <div className={styles.balanceInfo}>
                  <h3 className={styles.balanceTitle}>Available Balance</h3>
                  <p className={styles.balanceAmount}>$2,450.00</p>
                  <p className={styles.balanceSubtext}>Ready for payout</p>
                </div>
              </div>

              <div className={styles.balanceCard}>
                <div className={styles.balanceIcon}>
                  <FaClock />
                </div>
                <div className={styles.balanceInfo}>
                  <h3 className={styles.balanceTitle}>Pending Earnings</h3>
                  <p className={styles.balanceAmount}>$320.00</p>
                  <p className={styles.balanceSubtext}>Next payout: Dec 20</p>
                </div>
              </div>

              <div className={styles.balanceCard}>
                <div className={styles.balanceIcon}>
                  <FaChartLine />
                </div>
                <div className={styles.balanceInfo}>
                  <h3 className={styles.balanceTitle}>This Month</h3>
                  <p className={styles.balanceAmount}>$1,890.00</p>
                  <p className={styles.balanceSubtext}>+12% from last month</p>
                </div>
              </div>
            </div>

            <div className={styles.recentTransactions}>
              <h3 className={styles.transactionsTitle}>Recent Transactions</h3>
              <div className={styles.transactionList}>
                <div className={styles.transactionItem}>
                  <div className={styles.transactionIcon}>
                    <FaCheckCircle />
                  </div>
                  <div className={styles.transactionDetails}>
                    <h4 className={styles.transactionTitle}>Massage Therapy Session</h4>
                    <p className={styles.transactionDate}>Dec 15, 2024 • John Smith</p>
                  </div>
                  <div className={styles.transactionAmount}>+$120.00</div>
                </div>

                <div className={styles.transactionItem}>
                  <div className={styles.transactionIcon}>
                    <FaCheckCircle />
                  </div>
                  <div className={styles.transactionDetails}>
                    <h4 className={styles.transactionTitle}>Yoga Class</h4>
                    <p className={styles.transactionDate}>Dec 14, 2024 • Emma Wilson</p>
                  </div>
                  <div className={styles.transactionAmount}>+$80.00</div>
                </div>

                <div className={styles.transactionItem}>
                  <div className={styles.transactionIcon}>
                    <FaCheckCircle />
                  </div>
                  <div className={styles.transactionDetails}>
                    <h4 className={styles.transactionTitle}>Meditation Session</h4>
                    <p className={styles.transactionDate}>Dec 13, 2024 • Mike Chen</p>
                  </div>
                  <div className={styles.transactionAmount}>+$60.00</div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'payouts':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Payouts</h2>
            
            <div className={styles.payoutSettings}>
              <h3 className={styles.payoutSettingsTitle}>Payout Settings</h3>
              <div className={styles.payoutCard}>
                <div className={styles.payoutInfo}>
                  <h4 className={styles.payoutMethod}>Bank Account</h4>
                  <p className={styles.payoutDetails}>****1234 • Chase Bank</p>
                  <p className={styles.payoutSchedule}>Weekly payouts every Friday</p>
                </div>
                <button className={styles.editPayoutBtn}>Edit</button>
              </div>
            </div>

            <div className={styles.payoutHistory}>
              <h3 className={styles.payoutHistoryTitle}>Payout History</h3>
              <div className={styles.payoutList}>
                <div className={styles.payoutItem}>
                  <div className={styles.payoutDate}>
                    <FaCalendarAlt />
                    Dec 13, 2024
                  </div>
                  <div className={styles.payoutDetails}>
                    <h4 className={styles.payoutTitle}>Weekly Payout</h4>
                    <p className={styles.payoutMethod}>Chase Bank • ****1234</p>
                  </div>
                  <div className={styles.payoutAmount}>$1,890.00</div>
                  <div className={styles.payoutStatus}>
                    <span className={styles.statusCompleted}>Completed</span>
                  </div>
                </div>

                <div className={styles.payoutItem}>
                  <div className={styles.payoutDate}>
                    <FaCalendarAlt />
                    Dec 6, 2024
                  </div>
                  <div className={styles.payoutDetails}>
                    <h4 className={styles.payoutTitle}>Weekly Payout</h4>
                    <p className={styles.payoutMethod}>Chase Bank • ****1234</p>
                  </div>
                  <div className={styles.payoutAmount}>$1,650.00</div>
                  <div className={styles.payoutStatus}>
                    <span className={styles.statusCompleted}>Completed</span>
                  </div>
                </div>

                <div className={styles.payoutItem}>
                  <div className={styles.payoutDate}>
                    <FaCalendarAlt />
                    Nov 29, 2024
                  </div>
                  <div className={styles.payoutDetails}>
                    <h4 className={styles.payoutTitle}>Weekly Payout</h4>
                    <p className={styles.payoutMethod}>Chase Bank • ****1234</p>
                  </div>
                  <div className={styles.payoutAmount}>$1,420.00</div>
                  <div className={styles.payoutStatus}>
                    <span className={styles.statusCompleted}>Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'reports':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Reports</h2>
            
            <div className={styles.reportsGrid}>
              <div className={styles.reportCard}>
                <div className={styles.reportIcon}>
                  <FaFileAlt />
                </div>
                <h3 className={styles.reportTitle}>Monthly Summary</h3>
                <p className={styles.reportDescription}>December 2024 earnings and bookings summary</p>
                <button className={styles.downloadBtn}>
                  <FaDownload /> Download PDF
                </button>
              </div>

              <div className={styles.reportCard}>
                <div className={styles.reportIcon}>
                  <FaChartLine />
                </div>
                <h3 className={styles.reportTitle}>Tax Report</h3>
                <p className={styles.reportDescription}>Annual earnings report for tax purposes</p>
                <button className={styles.downloadBtn}>
                  <FaDownload /> Download CSV
                </button>
              </div>

              <div className={styles.reportCard}>
                <div className={styles.reportIcon}>
                  <FaDollarSign />
                </div>
                <h3 className={styles.reportTitle}>Service Breakdown</h3>
                <p className={styles.reportDescription}>Earnings by service type and client</p>
                <button className={styles.downloadBtn}>
                  <FaDownload /> Download Excel
                </button>
              </div>
            </div>

            <div className={styles.reportFilters}>
              <h3 className={styles.filtersTitle}>Generate Custom Report</h3>
              <div className={styles.filterRow}>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Date Range</label>
                  <select className={styles.filterSelect}>
                    <option value="this-month">This Month</option>
                    <option value="last-month">Last Month</option>
                    <option value="last-3-months">Last 3 Months</option>
                    <option value="last-6-months">Last 6 Months</option>
                    <option value="this-year">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>Format</label>
                  <select className={styles.filterSelect}>
                    <option value="pdf">PDF</option>
                    <option value="csv">CSV</option>
                    <option value="excel">Excel</option>
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <button className={styles.generateBtn}>Generate Report</button>
                </div>
              </div>
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
