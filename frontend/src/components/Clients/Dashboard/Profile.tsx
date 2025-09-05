'use client';

import styles from '@/styles/Clients/Dashboard.module.scss';

interface ProfileProps {
  activeSubmenu: string;
}

export default function Profile({ activeSubmenu }: ProfileProps) {
  return (
    <div className={styles.dashboardSection}>
      <h2 className={styles.sectionTitle}>Profile - {activeSubmenu}</h2>
      <p className={styles.placeholderText}>Profile content will be implemented here</p>
    </div>
  );
}
