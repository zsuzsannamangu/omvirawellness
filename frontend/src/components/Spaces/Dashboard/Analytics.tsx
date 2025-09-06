'use client';

import styles from '@/styles/Spaces/Dashboard.module.scss';

interface AnalyticsProps {
  activeSubmenu: string;
}

export default function Analytics({ activeSubmenu }: AnalyticsProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'revenue':
        return (
          <div className={styles.revenueContent}>
            <h2 className={styles.sectionTitle}>Revenue Analytics</h2>
            
            <div className={styles.revenueStats}>
              <div className={styles.revenueCard}>
                <h3 className={styles.revenueTitle}>This Month</h3>
                <p className={styles.revenueAmount}>$2,400</p>
                <p className={styles.revenueChange}>+12% from last month</p>
              </div>
              
              <div className={styles.revenueCard}>
                <h3 className={styles.revenueTitle}>This Year</h3>
                <p className={styles.revenueAmount}>$28,800</p>
                <p className={styles.revenueChange}>+25% from last year</p>
              </div>
              
              <div className={styles.revenueCard}>
                <h3 className={styles.revenueTitle}>Average per Booking</h3>
                <p className={styles.revenueAmount}>$120</p>
                <p className={styles.revenueChange}>+5% from last month</p>
              </div>
            </div>

            <div className={styles.revenueChart}>
              <h3 className={styles.subsectionTitle}>Revenue Trend</h3>
              <div className={styles.chartPlaceholder}>
                <p>Revenue chart would be displayed here</p>
              </div>
            </div>
          </div>
        );

      case 'usage':
        return (
          <div className={styles.usageContent}>
            <h2 className={styles.sectionTitle}>Space Usage Analytics</h2>
            
            <div className={styles.usageStats}>
              <div className={styles.usageCard}>
                <h3 className={styles.usageTitle}>Utilization Rate</h3>
                <p className={styles.usagePercentage}>78%</p>
                <p className={styles.usageDescription}>of available time slots booked</p>
              </div>
              
              <div className={styles.usageCard}>
                <h3 className={styles.usageTitle}>Peak Hours</h3>
                <p className={styles.usageTime}>2:00 PM - 4:00 PM</p>
                <p className={styles.usageDescription}>Most popular booking times</p>
              </div>
              
              <div className={styles.usageCard}>
                <h3 className={styles.usageTitle}>Peak Days</h3>
                <p className={styles.usageDays}>Tuesday, Thursday</p>
                <p className={styles.usageDescription}>Most popular booking days</p>
              </div>
            </div>

            <div className={styles.usageChart}>
              <h3 className={styles.subsectionTitle}>Usage by Day of Week</h3>
              <div className={styles.chartPlaceholder}>
                <p>Usage chart would be displayed here</p>
              </div>
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className={styles.reviewsContent}>
            <h2 className={styles.sectionTitle}>Reviews & Ratings</h2>
            
            <div className={styles.ratingOverview}>
              <div className={styles.ratingSummary}>
                <h3 className={styles.ratingNumber}>4.8</h3>
                <div className={styles.ratingStars}>⭐⭐⭐⭐⭐</div>
                <p className={styles.ratingCount}>Based on 24 reviews</p>
              </div>
              
              <div className={styles.ratingBreakdown}>
                <div className={styles.ratingBar}>
                  <span className={styles.ratingLabel}>5 stars</span>
                  <div className={styles.ratingBarBg}>
                    <div className={styles.ratingBarFill} style={{width: '85%'}}></div>
                  </div>
                  <span className={styles.ratingCount}>20</span>
                </div>
                <div className={styles.ratingBar}>
                  <span className={styles.ratingLabel}>4 stars</span>
                  <div className={styles.ratingBarBg}>
                    <div className={styles.ratingBarFill} style={{width: '15%'}}></div>
                  </div>
                  <span className={styles.ratingCount}>4</span>
                </div>
                <div className={styles.ratingBar}>
                  <span className={styles.ratingLabel}>3 stars</span>
                  <div className={styles.ratingBarBg}>
                    <div className={styles.ratingBarFill} style={{width: '0%'}}></div>
                  </div>
                  <span className={styles.ratingCount}>0</span>
                </div>
                <div className={styles.ratingBar}>
                  <span className={styles.ratingLabel}>2 stars</span>
                  <div className={styles.ratingBarBg}>
                    <div className={styles.ratingBarFill} style={{width: '0%'}}></div>
                  </div>
                  <span className={styles.ratingCount}>0</span>
                </div>
                <div className={styles.ratingBar}>
                  <span className={styles.ratingLabel}>1 star</span>
                  <div className={styles.ratingBarBg}>
                    <div className={styles.ratingBarFill} style={{width: '0%'}}></div>
                  </div>
                  <span className={styles.ratingCount}>0</span>
                </div>
              </div>
            </div>

            <div className={styles.reviewsList}>
              <h3 className={styles.subsectionTitle}>Recent Reviews</h3>
              <div className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewerInfo}>
                    <h4 className={styles.reviewerName}>Sarah Johnson</h4>
                    <div className={styles.reviewStars}>⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className={styles.reviewDate}>Dec 10, 2024</p>
                </div>
                <p className={styles.reviewText}>"Perfect space for massage therapy. Clean, quiet, and well-equipped. Highly recommend!"</p>
              </div>
              
              <div className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewerInfo}>
                    <h4 className={styles.reviewerName}>Mike Chen</h4>
                    <div className={styles.reviewStars}>⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className={styles.reviewDate}>Dec 8, 2024</p>
                </div>
                <p className={styles.reviewText}>"Great space for yoga classes. The atmosphere is peaceful and the lighting is perfect."</p>
              </div>
              
              <div className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewerInfo}>
                    <h4 className={styles.reviewerName}>Lisa Wang</h4>
                    <div className={styles.reviewStars}>⭐⭐⭐⭐</div>
                  </div>
                  <p className={styles.reviewDate}>Dec 5, 2024</p>
                </div>
                <p className={styles.reviewText}>"Good space for meditation sessions. Could use better soundproofing but overall satisfied."</p>
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
