'use client';

import styles from '@/styles/Clients/Dashboard.module.scss';

interface FavoritesProps {
  activeSubmenu: string;
}

export default function Favorites({ activeSubmenu }: FavoritesProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'providers':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Saved Providers</h2>
            <div className={styles.placeholderText}>
              <p>Your saved providers will appear here.</p>
              <p>Click the heart icon on any provider to save them for easy booking.</p>
            </div>
          </div>
        );
      
      case 'services':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Saved Services</h2>
            <div className={styles.placeholderText}>
              <p>Your saved services will appear here.</p>
              <p>Bookmark your favorite treatments for quick access.</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Favorites</h2>
            <div className={styles.placeholderText}>
              <p>Manage your saved providers and services.</p>
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
