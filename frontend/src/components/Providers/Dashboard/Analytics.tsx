'use client';

import styles from '@/styles/Providers/Dashboard.module.scss';

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
                <p className={styles.revenueAmount}>$3,600</p>
                <p className={styles.revenueChange}>+15% from last month</p>
              </div>
              
              <div className={styles.revenueCard}>
                <h3 className={styles.revenueTitle}>This Year</h3>
                <p className={styles.revenueAmount}>$43,200</p>
                <p className={styles.revenueChange}>+28% from last year</p>
              </div>
              
              <div className={styles.revenueCard}>
                <h3 className={styles.revenueTitle}>Average per Session</h3>
                <p className={styles.revenueAmount}>$120</p>
                <p className={styles.revenueChange}>+8% from last month</p>
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

      case 'sessions':
        return (
          <div className={styles.sessionsContent}>
            <h2 className={styles.sectionTitle}>Session Analytics</h2>
            
            <div className={styles.sessionsStats}>
              <div className={styles.sessionsCard}>
                <h3 className={styles.sessionsTitle}>Sessions This Month</h3>
                <p className={styles.sessionsNumber}>18</p>
                <p className={styles.sessionsDescription}>+3 from last month</p>
              </div>
              
              <div className={styles.sessionsCard}>
                <h3 className={styles.sessionsTitle}>Peak Hours</h3>
                <p className={styles.sessionsNumber}>2-4 PM</p>
                <p className={styles.sessionsDescription}>Most popular booking times</p>
              </div>
              
              <div className={styles.sessionsCard}>
                <h3 className={styles.sessionsTitle}>Peak Days</h3>
                <p className={styles.sessionsNumber}>Tue, Thu</p>
                <p className={styles.sessionsDescription}>Most popular booking days</p>
              </div>
            </div>

            <div className={styles.sessionsChart}>
              <h3 className={styles.subsectionTitle}>Sessions by Day of Week</h3>
              <div className={styles.chartPlaceholder}>
                <p>Sessions chart would be displayed here</p>
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
                <h3 className={styles.ratingNumber}>4.9</h3>
                <div className={styles.ratingStars}>⭐⭐⭐⭐⭐</div>
                <p className={styles.ratingCount}>Based on 32 reviews</p>
              </div>
              
              <div className={styles.ratingBreakdown}>
                <div className={styles.ratingBar}>
                  <span className={styles.ratingLabel}>5 stars</span>
                  <div className={styles.ratingBarBg}>
                    <div className={styles.ratingBarFill} style={{width: '90%'}}></div>
                  </div>
                  <span className={styles.ratingCount}>29</span>
                </div>
                <div className={styles.ratingBar}>
                  <span className={styles.ratingLabel}>4 stars</span>
                  <div className={styles.ratingBarBg}>
                    <div className={styles.ratingBarFill} style={{width: '10%'}}></div>
                  </div>
                  <span className={styles.ratingCount}>3</span>
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
                    <h4 className={styles.reviewerName}>John Smith</h4>
                    <div className={styles.reviewStars}>⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className={styles.reviewDate}>Dec 10, 2024</p>
                </div>
                <p className={styles.reviewText}>"Amazing massage therapy session. Sarah is incredibly skilled and professional. Highly recommend!"</p>
              </div>
              
              <div className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewerInfo}>
                    <h4 className={styles.reviewerName}>Emma Wilson</h4>
                    <div className={styles.reviewStars}>⭐⭐⭐⭐⭐</div>
                  </div>
                  <p className={styles.reviewDate}>Dec 8, 2024</p>
                </div>
                <p className={styles.reviewText}>"Great yoga class. Sarah's instruction is clear and the atmosphere is very calming."</p>
              </div>
              
              <div className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewerInfo}>
                    <h4 className={styles.reviewerName}>Mike Chen</h4>
                    <div className={styles.reviewStars}>⭐⭐⭐⭐</div>
                  </div>
                  <p className={styles.reviewDate}>Dec 5, 2024</p>
                </div>
                <p className={styles.reviewText}>"Good meditation session. Very helpful for stress relief. Would book again."</p>
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
