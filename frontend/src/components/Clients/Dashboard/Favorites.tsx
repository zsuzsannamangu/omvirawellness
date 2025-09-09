'use client';

import { FaUser, FaHeart, FaClock } from 'react-icons/fa';
import styles from '@/styles/Clients/Dashboard.module.scss';

interface FavoritesProps {
  activeSubmenu: string;
}

export default function Favorites({ activeSubmenu }: FavoritesProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'providers':
        return (
          <div className={styles.favoritesContent}>
            <h2 className={styles.sectionTitle}>Saved Providers</h2>
            <div className={styles.providersGrid}>
              <div className={styles.providerCard}>
                <div className={styles.providerImage}>
                  <div className={styles.providerInitials}>SJ</div>
                </div>
                <div className={styles.providerInfo}>
                  <h4 className={styles.providerName}>Sarah Johnson</h4>
                  <p className={styles.providerSpecialty}>Massage Therapist</p>
                  <div className={styles.providerRating}>
                    <span className={styles.stars}>★★★★★</span>
                    <span className={styles.ratingText}>4.9 (127 reviews)</span>
                  </div>
                  <p className={styles.providerLocation}>Downtown Wellness Center</p>
                </div>
                <div className={styles.providerActions}>
                  <button className={styles.bookBtn}>Book Now</button>
                  <button className={styles.removeBtn}>Remove</button>
                </div>
              </div>

              <div className={styles.providerCard}>
                <div className={styles.providerImage}>
                  <div className={styles.providerInitials}>MC</div>
                </div>
                <div className={styles.providerInfo}>
                  <h4 className={styles.providerName}>Mike Chen</h4>
                  <p className={styles.providerSpecialty}>Yoga Instructor</p>
                  <div className={styles.providerRating}>
                    <span className={styles.stars}>★★★★★</span>
                    <span className={styles.ratingText}>4.8 (89 reviews)</span>
                  </div>
                  <p className={styles.providerLocation}>Zen Studio</p>
                </div>
                <div className={styles.providerActions}>
                  <button className={styles.bookBtn}>Book Now</button>
                  <button className={styles.removeBtn}>Remove</button>
                </div>
              </div>

              <div className={styles.providerCard}>
                <div className={styles.providerImage}>
                  <div className={styles.providerInitials}>LW</div>
                </div>
                <div className={styles.providerInfo}>
                  <h4 className={styles.providerName}>Lisa Wang</h4>
                  <p className={styles.providerSpecialty}>Meditation Guide</p>
                  <div className={styles.providerRating}>
                    <span className={styles.stars}>★★★★★</span>
                    <span className={styles.ratingText}>4.9 (156 reviews)</span>
                  </div>
                  <p className={styles.providerLocation}>Mindful Living Center</p>
                </div>
                <div className={styles.providerActions}>
                  <button className={styles.bookBtn}>Book Now</button>
                  <button className={styles.removeBtn}>Remove</button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'services':
        return (
          <div className={styles.favoritesContent}>
            <h2 className={styles.sectionTitle}>Saved Services</h2>
            <div className={styles.servicesGrid}>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}><FaUser /></div>
                <div className={styles.serviceInfo}>
                  <h4 className={styles.serviceName}>Deep Tissue Massage</h4>
                  <p className={styles.serviceDescription}>60-minute therapeutic massage focusing on muscle tension</p>
                  <div className={styles.serviceDetails}>
                    <span className={styles.serviceDuration}>60 min</span>
                    <span className={styles.servicePrice}>$120</span>
                  </div>
                </div>
                <div className={styles.serviceActions}>
                  <button className={styles.bookBtn}>Book Now</button>
                  <button className={styles.removeBtn}>Remove</button>
                </div>
              </div>

              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}><FaHeart /></div>
                <div className={styles.serviceInfo}>
                  <h4 className={styles.serviceName}>Vinyasa Flow Yoga</h4>
                  <p className={styles.serviceDescription}>Dynamic yoga practice connecting breath with movement</p>
                  <div className={styles.serviceDetails}>
                    <span className={styles.serviceDuration}>75 min</span>
                    <span className={styles.servicePrice}>$45</span>
                  </div>
                </div>
                <div className={styles.serviceActions}>
                  <button className={styles.bookBtn}>Book Now</button>
                  <button className={styles.removeBtn}>Remove</button>
                </div>
              </div>

              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}><FaClock /></div>
                <div className={styles.serviceInfo}>
                  <h4 className={styles.serviceName}>Guided Meditation</h4>
                  <p className={styles.serviceDescription}>Mindfulness and stress reduction techniques</p>
                  <div className={styles.serviceDetails}>
                    <span className={styles.serviceDuration}>30 min</span>
                    <span className={styles.servicePrice}>$35</span>
                  </div>
                </div>
                <div className={styles.serviceActions}>
                  <button className={styles.bookBtn}>Book Now</button>
                  <button className={styles.removeBtn}>Remove</button>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.favoritesContent}>
            <h2 className={styles.sectionTitle}>Favorites</h2>
            <div className={styles.favoritesOverview}>
              <div className={styles.overviewCard}>
                <h3>Saved Providers</h3>
                <p className={styles.count}>3 providers</p>
                <button className={styles.viewBtn}>View All</button>
              </div>
              <div className={styles.overviewCard}>
                <h3>Saved Services</h3>
                <p className={styles.count}>3 services</p>
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
