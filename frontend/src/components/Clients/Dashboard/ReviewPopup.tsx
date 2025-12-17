'use client';

import { useState } from 'react';
import { FaStar, FaTimes } from 'react-icons/fa';
import styles from '@/styles/ReviewModal.module.scss';

interface ReviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  providerName: string;
  serviceName: string;
  onSubmit: (review: ReviewData) => void;
}

interface ReviewData {
  rating: number;
  comment: string;
  recommends: boolean;
}

export default function ReviewPopup({ isOpen, onClose, providerName, serviceName, onSubmit }: ReviewPopupProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [recommends, setRecommends] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit({
      rating,
      comment,
      recommends
    });

    // Reset form
    setRating(0);
    setComment('');
    setRecommends(true);
    setIsSubmitting(false);
    onClose();
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.reviewModalOverlay}>
      <div className={styles.reviewModalContent}>
        <div className={styles.reviewModalHeader}>
          <h2 className={styles.reviewModalTitle}>Leave a Review</h2>
          <button className={styles.reviewModalClose} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.reviewModalBody}>
          <div className={styles.reviewLayout}>
            <div className={styles.reviewLeftSection}>
              <div className={styles.reviewProviderInfo}>
                <h3 className={styles.reviewProviderName}>{providerName}</h3>
                <p className={styles.reviewServiceName}>{serviceName}</p>
                <p className={styles.reviewPurchaseInfo}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>

            <div className={styles.reviewRightSection}>
              <form onSubmit={handleSubmit} className={styles.reviewForm}>
            {/* Rating Section */}
            <div className={styles.reviewSection}>
              <label className={styles.reviewLabel}>Overall Rating *</label>
              <div className={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={styles.starButton}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                  >
                    <FaStar
                      className={`${styles.star} ${
                        star <= (hoveredRating || rating)
                          ? styles.starFilled
                          : styles.starEmpty
                      }`}
                    />
                  </button>
                ))}
                <span className={styles.ratingText}>
                  {rating > 0 && (
                    rating === 1 ? 'Poor' :
                    rating === 2 ? 'Fair' :
                    rating === 3 ? 'Good' :
                    rating === 4 ? 'Very Good' :
                    'Excellent'
                  )}
                </span>
              </div>
            </div>

            {/* Comment Section */}
            <div className={styles.reviewSection}>
              <label htmlFor="comment" className={styles.reviewLabel}>
                Tell us about your experience *
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details about your experience with this provider..."
                className={styles.reviewTextarea}
                rows={3}
              />
            </div>

            {/* Recommendation Section */}
            <div className={styles.reviewSection}>
              <label className={styles.reviewLabel}>Would you recommend this provider? *</label>
              <div className={styles.recommendationButtons}>
                <button
                  type="button"
                  className={`${styles.recommendButton} ${recommends ? styles.recommendButtonActive : ''}`}
                  onClick={() => setRecommends(true)}
                >
                  Yes
                </button>
                <button
                  type="button"
                  className={`${styles.recommendButton} ${!recommends ? styles.recommendButtonActive : ''}`}
                  onClick={() => setRecommends(false)}
                >
                  No
                </button>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className={styles.reviewModalActions}>
              <button
                type="button"
                className={styles.reviewCancelButton}
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.reviewSubmitButton}
                disabled={rating === 0 || !comment.trim() || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
