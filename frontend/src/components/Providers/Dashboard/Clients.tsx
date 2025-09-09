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
            <div className={styles.clientsTableContainer}>
              <table className={styles.clientsTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Sessions</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.clientNameCell}>
                      <div className={styles.clientNameInfo}>
                        <span className={styles.clientName}>John Smith</span>
                      </div>
                    </td>
                    <td className={styles.clientEmailCell}>john.smith@email.com</td>
                    <td className={styles.clientPhoneCell}>+1 (555) 123-4567</td>
                    <td className={styles.clientSessionsCell}>12 sessions</td>
                    <td className={styles.clientActionsCell}>
                      <div className={styles.actionButtons}>
                        <button className={styles.actionBtn} title="View">
                          <FaEye />
                        </button>
                        <button className={styles.actionBtn} title="Message">
                          <FaEnvelope />
                        </button>
                        <button className={styles.actionBtn} title="Add Note">
                          <FaStickyNote />
                        </button>
                        <button className={styles.actionBtn} title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className={styles.clientNameCell}>
                      <div className={styles.clientNameInfo}>
                        <span className={styles.clientName}>Emma Wilson</span>
                      </div>
                    </td>
                    <td className={styles.clientEmailCell}>emma.wilson@email.com</td>
                    <td className={styles.clientPhoneCell}>+1 (555) 234-5678</td>
                    <td className={styles.clientSessionsCell}>8 sessions</td>
                    <td className={styles.clientActionsCell}>
                      <div className={styles.actionButtons}>
                        <button className={styles.actionBtn} title="View">
                          <FaEye />
                        </button>
                        <button className={styles.actionBtn} title="Message">
                          <FaEnvelope />
                        </button>
                        <button className={styles.actionBtn} title="Add Note">
                          <FaStickyNote />
                        </button>
                        <button className={styles.actionBtn} title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className={styles.clientNameCell}>
                      <div className={styles.clientNameInfo}>
                        <span className={styles.clientName}>Mike Chen</span>
                      </div>
                    </td>
                    <td className={styles.clientEmailCell}>mike.chen@email.com</td>
                    <td className={styles.clientPhoneCell}>+1 (555) 345-6789</td>
                    <td className={styles.clientSessionsCell}>5 sessions</td>
                    <td className={styles.clientActionsCell}>
                      <div className={styles.actionButtons}>
                        <button className={styles.actionBtn} title="View">
                          <FaEye />
                        </button>
                        <button className={styles.actionBtn} title="Message">
                          <FaEnvelope />
                        </button>
                        <button className={styles.actionBtn} title="Add Note">
                          <FaStickyNote />
                        </button>
                        <button className={styles.actionBtn} title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
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
