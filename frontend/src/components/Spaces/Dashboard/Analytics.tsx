'use client';

import { FaChartLine, FaChartBar, FaCalendarAlt, FaDollarSign, FaUsers, FaClock } from 'react-icons/fa';
import styles from '@/styles/Spaces/Dashboard.module.scss';

interface AnalyticsProps {
  activeSubmenu: string;
}

export default function Analytics({ activeSubmenu }: AnalyticsProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'occupancy':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Occupancy Rates</h2>
            
            <div className={styles.occupancyGrid}>
              <div className={styles.occupancyCard}>
                <div className={styles.occupancyIcon}><FaChartBar /></div>
                <div className={styles.occupancyInfo}>
                  <h3 className={styles.occupancyRate}>78%</h3>
                  <p className={styles.occupancyLabel}>Overall Occupancy</p>
                  <p className={styles.occupancyChange}>+12% vs last month</p>
                </div>
              </div>
              
              <div className={styles.occupancyCard}>
                <div className={styles.occupancyIcon}><FaClock /></div>
                <div className={styles.occupancyInfo}>
                  <h3 className={styles.occupancyRate}>92%</h3>
                  <p className={styles.occupancyLabel}>Peak Hours</p>
                  <p className={styles.occupancyChange}>6-8 PM</p>
                </div>
              </div>
              
              <div className={styles.occupancyCard}>
                <div className={styles.occupancyIcon}><FaUsers /></div>
                <div className={styles.occupancyInfo}>
                  <h3 className={styles.occupancyRate}>156</h3>
                  <p className={styles.occupancyLabel}>Total Bookings</p>
                  <p className={styles.occupancyChange}>This month</p>
                </div>
              </div>
            </div>

            <div className={styles.spaceOccupancy}>
              <h3 className={styles.subsectionTitle}>Space Occupancy Breakdown</h3>
              <div className={styles.spaceList}>
                <div className={styles.spaceItem}>
                  <div className={styles.spaceInfo}>
                    <h4 className={styles.spaceName}>Yoga Studio</h4>
                    <p className={styles.spaceDescription}>Most popular space</p>
                  </div>
                  <div className={styles.spaceStats}>
                    <div className={styles.occupancyBar}>
                      <div className={styles.occupancyFill} style={{width: '85%'}}></div>
                    </div>
                    <span className={styles.occupancyPercent}>85%</span>
                  </div>
                </div>

                <div className={styles.spaceItem}>
                  <div className={styles.spaceInfo}>
                    <h4 className={styles.spaceName}>Meditation Room</h4>
                    <p className={styles.spaceDescription}>Steady bookings</p>
                  </div>
                  <div className={styles.spaceStats}>
                    <div className={styles.occupancyBar}>
                      <div className={styles.occupancyFill} style={{width: '72%'}}></div>
                    </div>
                    <span className={styles.occupancyPercent}>72%</span>
                  </div>
                </div>

                <div className={styles.spaceItem}>
                  <div className={styles.spaceInfo}>
                    <h4 className={styles.spaceName}>Conference Room</h4>
                    <p className={styles.spaceDescription}>Weekday focused</p>
                  </div>
                  <div className={styles.spaceStats}>
                    <div className={styles.occupancyBar}>
                      <div className={styles.occupancyFill} style={{width: '45%'}}></div>
                    </div>
                    <span className={styles.occupancyPercent}>45%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'revenue':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Revenue Insights</h2>
            
            <div className={styles.revenueGrid}>
              <div className={styles.revenueCard}>
                <div className={styles.revenueIcon}><FaDollarSign /></div>
                <div className={styles.revenueInfo}>
                  <h3 className={styles.revenueAmount}>$2,400</h3>
                  <p className={styles.revenueLabel}>This Month</p>
                  <p className={styles.revenueChange}>+18% vs last month</p>
                </div>
              </div>
              
              <div className={styles.revenueCard}>
                <div className={styles.revenueIcon}><FaChartLine /></div>
                <div className={styles.revenueInfo}>
                  <h3 className={styles.revenueAmount}>$18,500</h3>
                  <p className={styles.revenueLabel}>Total Revenue</p>
                  <p className={styles.revenueChange}>Year to date</p>
                </div>
              </div>
              
              <div className={styles.revenueCard}>
                <div className={styles.revenueIcon}><FaCalendarAlt /></div>
                <div className={styles.revenueInfo}>
                  <h3 className={styles.revenueAmount}>$156</h3>
                  <p className={styles.revenueLabel}>Average per Booking</p>
                  <p className={styles.revenueChange}>+5% vs last month</p>
                </div>
              </div>
            </div>

            <div className={styles.revenueBreakdown}>
              <h3 className={styles.subsectionTitle}>Revenue by Space</h3>
              <div className={styles.spaceRevenueList}>
                <div className={styles.spaceRevenueItem}>
                  <div className={styles.spaceInfo}>
                    <h4 className={styles.spaceName}>Yoga Studio</h4>
                    <p className={styles.spaceDescription}>Highest revenue generator</p>
                  </div>
                  <div className={styles.spaceRevenue}>
                    <span className={styles.revenueAmount}>$1,200</span>
                    <span className={styles.revenuePercent}>50%</span>
                  </div>
                </div>

                <div className={styles.spaceRevenueItem}>
                  <div className={styles.spaceInfo}>
                    <h4 className={styles.spaceName}>Meditation Room</h4>
                    <p className={styles.spaceDescription}>Consistent performer</p>
                  </div>
                  <div className={styles.spaceRevenue}>
                    <span className={styles.revenueAmount}>$800</span>
                    <span className={styles.revenuePercent}>33%</span>
                  </div>
                </div>

                <div className={styles.spaceRevenueItem}>
                  <div className={styles.spaceInfo}>
                    <h4 className={styles.spaceName}>Conference Room</h4>
                    <p className={styles.spaceDescription}>Weekday bookings</p>
                  </div>
                  <div className={styles.spaceRevenue}>
                    <span className={styles.revenueAmount}>$400</span>
                    <span className={styles.revenuePercent}>17%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.revenueTrends}>
              <h3 className={styles.subsectionTitle}>Revenue Trends</h3>
              <div className={styles.trendsChart}>
                <div className={styles.chartPlaceholder}>
                  <FaChartLine />
                  <p>Revenue trend chart would be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Analytics</h2>
            <div className={styles.placeholderText}>
              <p>View analytics and insights for your space rentals.</p>
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