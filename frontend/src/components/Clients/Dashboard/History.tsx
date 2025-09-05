'use client';

import styles from '@/styles/Clients/Dashboard.module.scss';

interface HistoryProps {
  activeSubmenu: string;
}

export default function History({ activeSubmenu }: HistoryProps) {
  return (
    <div className={styles.dashboardSection}>
      <h2 className={styles.sectionTitle}>History - {activeSubmenu}</h2>
      <p className={styles.placeholderText}>History content will be implemented here</p>
    </div>
  );
}
