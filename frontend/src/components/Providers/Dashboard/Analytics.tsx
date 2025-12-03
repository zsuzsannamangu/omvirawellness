'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaStar } from 'react-icons/fa';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface AnalyticsProps {
  activeSubmenu: string;
}

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
  reviewer_first_name: string | null;
  reviewer_last_name: string | null;
  reviewer_email: string;
}

export default function Analytics({ activeSubmenu }: AnalyticsProps) {
  const params = useParams();
  const userId = params.userId as string;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);

  useEffect(() => {
    if (activeSubmenu === 'reviews' && userId) {
      loadReviews();
    }
  }, [activeSubmenu, userId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:4000/api/reviews/provider/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : []);
        
        // Calculate average rating
        if (data.length > 0) {
          const avg = data.reduce((sum: number, r: Review) => sum + r.rating, 0) / data.length;
          setAverageRating(avg);
          setTotalReviews(data.length);
        } else {
          setAverageRating(0);
          setTotalReviews(0);
        }
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderContent = () => {
    switch (activeSubmenu) {
      case 'bookings':
        return (
          <div className={styles.sessionsContent}>
            <h2 className={styles.sectionTitle}>Bookings</h2>
            <div className={styles.placeholderText}>
              <p>No booking analytics available yet.</p>
            </div>
          </div>
        );

      case 'revenue':
        return (
          <div className={styles.revenueContent}>
            <h2 className={styles.sectionTitle}>Revenue Trends</h2>
            <div className={styles.placeholderText}>
              <p>No revenue data available yet.</p>
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className={styles.reviewsContent}>
            <h2 className={styles.sectionTitle}>Reviews</h2>
            
            {loading ? (
              <div className={styles.placeholderText}>
                <p>Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className={styles.placeholderText}>
                <p>No reviews yet.</p>
              </div>
            ) : (
              <>
                {/* Rating Summary */}
                <div className={styles.ratingOverview}>
                  <div className={styles.ratingSummary}>
                    <div className={styles.ratingNumber}>{averageRating.toFixed(1)}</div>
                    <div className={styles.ratingStars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={star <= Math.round(averageRating) ? styles.starFilled : styles.starEmpty}
                        />
                      ))}
                    </div>
                    <p className={styles.ratingCount}>{totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</p>
                  </div>
                </div>

                {/* Reviews List */}
                <div className={styles.reviewsList}>
                  {reviews.map((review) => {
                    const reviewerName = review.reviewer_first_name && review.reviewer_last_name
                      ? `${review.reviewer_first_name} ${review.reviewer_last_name}`
                      : review.reviewer_email?.split('@')[0] || 'Anonymous';
                    
                    return (
                      <div key={review.id} className={styles.reviewItem}>
                        <div className={styles.reviewHeader}>
                          <div className={styles.reviewRating}>
                            <div className={styles.stars}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={star <= review.rating ? styles.starFilled : styles.starEmpty}
                                />
                              ))}
                            </div>
                            <span className={styles.ratingNumber}>{review.rating}</span>
                          </div>
                          <div className={styles.reviewerInfo}>
                            <div className={styles.avatar}>
                              {reviewerName.charAt(0).toUpperCase()}
                            </div>
                            <div className={styles.reviewerDetails}>
                              <span className={styles.reviewerName}>{reviewerName}</span>
                              <span className={styles.reviewDate}>{formatDate(review.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        {review.title && (
                          <h4 className={styles.reviewTitle}>{review.title}</h4>
                        )}
                        {review.comment && (
                          <p className={styles.reviewComment}>{review.comment}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        );

      case 'retention':
        return (
          <div className={styles.reviewsContent}>
            <h2 className={styles.sectionTitle}>Retention</h2>
            <div className={styles.placeholderText}>
              <p>No retention data available yet.</p>
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
