'use client';

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
            <div className={styles.clientsList}>
              <div className={styles.clientCard}>
                <div className={styles.clientInfo}>
                  <h4 className={styles.clientName}>John Smith</h4>
                  <p className={styles.clientEmail}>john.smith@email.com</p>
                  <p className={styles.clientPhone}>+1 (555) 123-4567</p>
                  <p className={styles.clientSessions}>12 sessions completed</p>
                </div>
                <div className={styles.clientActions}>
                  <button className={styles.actionBtn}>View Profile</button>
                  <button className={styles.actionBtn}>Message</button>
                </div>
              </div>

              <div className={styles.clientCard}>
                <div className={styles.clientInfo}>
                  <h4 className={styles.clientName}>Emma Wilson</h4>
                  <p className={styles.clientEmail}>emma.wilson@email.com</p>
                  <p className={styles.clientPhone}>+1 (555) 234-5678</p>
                  <p className={styles.clientSessions}>8 sessions completed</p>
                </div>
                <div className={styles.clientActions}>
                  <button className={styles.actionBtn}>View Profile</button>
                  <button className={styles.actionBtn}>Message</button>
                </div>
              </div>

              <div className={styles.clientCard}>
                <div className={styles.clientInfo}>
                  <h4 className={styles.clientName}>Mike Chen</h4>
                  <p className={styles.clientEmail}>mike.chen@email.com</p>
                  <p className={styles.clientPhone}>+1 (555) 345-6789</p>
                  <p className={styles.clientSessions}>5 sessions completed</p>
                </div>
                <div className={styles.clientActions}>
                  <button className={styles.actionBtn}>View Profile</button>
                  <button className={styles.actionBtn}>Message</button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className={styles.notesContent}>
            <h2 className={styles.sectionTitle}>Notes & Preferences</h2>
            <div className={styles.notesList}>
              <div className={styles.noteItem}>
                <div className={styles.noteHeader}>
                  <h4 className={styles.noteClient}>John Smith</h4>
                  <p className={styles.noteDate}>Dec 10, 2024</p>
                </div>
                <p className={styles.noteText}>Prefers deep tissue massage. Has lower back tension. Use medium pressure on shoulders.</p>
              </div>

              <div className={styles.noteItem}>
                <div className={styles.noteHeader}>
                  <h4 className={styles.noteClient}>Emma Wilson</h4>
                  <p className={styles.noteDate}>Dec 8, 2024</p>
                </div>
                <p className={styles.noteText}>New to yoga. Focus on basic poses and breathing techniques. Very flexible.</p>
              </div>

              <div className={styles.noteItem}>
                <div className={styles.noteHeader}>
                  <h4 className={styles.noteClient}>Mike Chen</h4>
                  <p className={styles.noteDate}>Dec 5, 2024</p>
                </div>
                <p className={styles.noteText}>Meditation beginner. Prefers guided sessions. Very responsive to breathing exercises.</p>
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
