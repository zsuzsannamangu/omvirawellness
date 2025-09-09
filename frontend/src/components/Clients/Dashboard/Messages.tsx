'use client';

import { FaCheckCircle, FaClock, FaDollarSign, FaUser } from 'react-icons/fa';
import styles from '@/styles/Clients/Dashboard.module.scss';

interface MessagesProps {
  activeSubmenu: string;
}

export default function Messages({ activeSubmenu }: MessagesProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'confirmations':
        return (
          <div className={styles.messagesContent}>
            <h2 className={styles.sectionTitle}>Confirmations</h2>
            <div className={styles.messagesList}>
              <div className={styles.messageItem}>
                <div className={styles.messageIcon}><FaCheckCircle /></div>
                <div className={styles.messageContent}>
                  <h4 className={styles.messageTitle}>Appointment Confirmed</h4>
                  <p className={styles.messageText}>Your massage therapy session with Sarah Johnson on Dec 15 at 2:00 PM has been confirmed.</p>
                  <p className={styles.messageTime}>2 hours ago</p>
                </div>
                <div className={styles.messageActions}>
                  <button className={styles.viewBtn}>View Details</button>
                </div>
              </div>

              <div className={styles.messageItem}>
                <div className={styles.messageIcon}><FaClock /></div>
                <div className={styles.messageContent}>
                  <h4 className={styles.messageTitle}>Reminder: Upcoming Appointment</h4>
                  <p className={styles.messageText}>Don't forget! You have a yoga class with Mike Chen tomorrow at 10:00 AM.</p>
                  <p className={styles.messageTime}>1 day ago</p>
                </div>
                <div className={styles.messageActions}>
                  <button className={styles.viewBtn}>View Details</button>
                </div>
              </div>

              <div className={styles.messageItem}>
                <div className={styles.messageIcon}><FaDollarSign /></div>
                <div className={styles.messageContent}>
                  <h4 className={styles.messageTitle}>Payment Confirmed</h4>
                  <p className={styles.messageText}>Payment of $120.00 for your meditation session with Lisa Wang has been processed.</p>
                  <p className={styles.messageTime}>3 days ago</p>
                </div>
                <div className={styles.messageActions}>
                  <button className={styles.viewBtn}>View Receipt</button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'direct':
        return (
          <div className={styles.messagesContent}>
            <h2 className={styles.sectionTitle}>Direct Communication</h2>
            <div className={styles.conversationsList}>
              <div className={styles.conversationItem}>
                <div className={styles.conversationAvatar}>
                  <FaUser />
                </div>
                <div className={styles.conversationContent}>
                  <div className={styles.conversationHeader}>
                    <h4 className={styles.conversationName}>Sarah Johnson</h4>
                    <span className={styles.conversationTime}>2 hours ago</span>
                  </div>
                  <p className={styles.conversationPreview}>Hi! I wanted to confirm your preferences for tomorrow's massage session...</p>
                  <div className={styles.conversationBadge}>
                    <span className={styles.unreadCount}>2</span>
                  </div>
                </div>
              </div>

              <div className={styles.conversationItem}>
                <div className={styles.conversationAvatar}>
                  <FaUser />
                </div>
                <div className={styles.conversationContent}>
                  <div className={styles.conversationHeader}>
                    <h4 className={styles.conversationName}>Mike Chen</h4>
                    <span className={styles.conversationTime}>1 day ago</span>
                  </div>
                  <p className={styles.conversationPreview}>Thanks for the great session today! See you next week for yoga class.</p>
                </div>
              </div>

              <div className={styles.conversationItem}>
                <div className={styles.conversationAvatar}>
                  <FaUser />
                </div>
                <div className={styles.conversationContent}>
                  <div className={styles.conversationHeader}>
                    <h4 className={styles.conversationName}>Lisa Wang</h4>
                    <span className={styles.conversationTime}>3 days ago</span>
                  </div>
                  <p className={styles.conversationPreview}>I've prepared some new meditation techniques for our next session...</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.messagesContent}>
            <h2 className={styles.sectionTitle}>Messages</h2>
            <div className={styles.messagesOverview}>
              <div className={styles.overviewCard}>
                <h3>Unread Messages</h3>
                <p className={styles.count}>2 messages</p>
                <button className={styles.viewBtn}>View All</button>
              </div>
              <div className={styles.overviewCard}>
                <h3>Active Conversations</h3>
                <p className={styles.count}>3 providers</p>
                <button className={styles.viewBtn}>View All</button>
              </div>
              <div className={styles.overviewCard}>
                <h3>Recent Confirmations</h3>
                <p className={styles.count}>5 confirmations</p>
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
