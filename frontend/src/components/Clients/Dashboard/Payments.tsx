'use client';

import styles from '@/styles/Clients/Dashboard.module.scss';

interface PaymentsProps {
  activeSubmenu: string;
}

export default function Payments({ activeSubmenu }: PaymentsProps) {
  return (
    <div className={styles.dashboardSection}>
      <h2 className={styles.sectionTitle}>Payments - {activeSubmenu}</h2>
      <p className={styles.placeholderText}>Payments content will be implemented here</p>
    </div>
  );
}
