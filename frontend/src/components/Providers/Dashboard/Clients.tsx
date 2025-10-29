'use client';

import { FaEye, FaEnvelope, FaStickyNote, FaTrash } from 'react-icons/fa';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface ClientsProps {
  activeSubmenu: string;
}

export default function Clients({ activeSubmenu }: ClientsProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'directory':
        return (
          <div className={styles.clientsContent}>
            <h2 className={styles.sectionTitle}>Directory of Past Clients</h2>
            <div className={styles.placeholderText}>
              <p>No clients yet.</p>
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className={styles.notesContent}>
            <h2 className={styles.sectionTitle}>Notes & Preferences</h2>
            <div className={styles.placeholderText}>
              <p>No notes or preferences saved yet.</p>
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
