'use client';

import styles from '@/styles/Spaces/Dashboard.module.scss';

interface SpacesProps {
  activeSubmenu: string;
}

export default function Spaces({ activeSubmenu }: SpacesProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'listings':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Manage Listings</h2>
            <div className={styles.placeholderText}>
              <p>Manage your space listings and availability.</p>
              <p>Add, edit, or remove space listings and set their status.</p>
            </div>
          </div>
        );
      
      case 'pricing':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Pricing</h2>
            <div className={styles.placeholderText}>
              <p>Set and manage pricing for your space rentals.</p>
              <p>Configure hourly rates, daily rates, and special pricing rules.</p>
            </div>
          </div>
        );
      
      case 'photos':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Photos</h2>
            <div className={styles.placeholderText}>
              <p>Upload and manage photos of your spaces.</p>
              <p>Showcase your spaces with high-quality images to attract renters.</p>
            </div>
          </div>
        );
      
      case 'amenities':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Amenities</h2>
            <div className={styles.placeholderText}>
              <p>Manage amenities and features for your spaces.</p>
              <p>List available equipment, facilities, and special features.</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Spaces</h2>
            <div className={styles.placeholderText}>
              <p>Manage your space listings and settings.</p>
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
