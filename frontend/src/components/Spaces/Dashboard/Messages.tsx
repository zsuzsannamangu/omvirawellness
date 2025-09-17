'use client';

import { FaUser, FaCalendarAlt, FaDollarSign, FaCheckCircle, FaClock, FaEye, FaReply } from 'react-icons/fa';
import styles from '@/styles/Spaces/Dashboard.module.scss';

interface MessagesProps {
  activeSubmenu: string;
}

export default function Messages({ activeSubmenu }: MessagesProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'inquiries':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Rental Inquiries</h2>
            
            <div className={styles.inquiriesList}>
              <div className={styles.inquiryItem}>
                <div className={styles.inquiryAvatar}>
                  <FaUser />
                </div>
                <div className={styles.inquiryContent}>
                  <div className={styles.inquiryHeader}>
                    <h4 className={styles.inquiryName}>Sarah Johnson</h4>
                    <span className={styles.inquiryTime}>2 hours ago</span>
                  </div>
                  <p className={styles.inquiryMessage}>Hi! I'm interested in renting your yoga studio for a private class on Dec 20th from 2-4 PM. Is it available?</p>
                  <div className={styles.inquiryDetails}>
                    <span className={styles.inquirySpace}><FaCalendarAlt /> Yoga Studio</span>
                    <span className={styles.inquiryDate}>Dec 20, 2:00 PM - 4:00 PM</span>
                    <span className={styles.inquiryPrice}><FaDollarSign /> $240</span>
                  </div>
                </div>
                <div className={styles.inquiryActions}>
                  <button className={styles.replyBtn}>Reply</button>
                  <button className={styles.viewBtn}>View</button>
                </div>
              </div>

              <div className={styles.inquiryItem}>
                <div className={styles.inquiryAvatar}>
                  <FaUser />
                </div>
                <div className={styles.inquiryContent}>
                  <div className={styles.inquiryHeader}>
                    <h4 className={styles.inquiryName}>Mike Chen</h4>
                    <span className={styles.inquiryTime}>1 day ago</span>
                  </div>
                  <p className={styles.inquiryMessage}>Hello! I'd like to book the meditation room for a group session. Do you have availability this weekend?</p>
                  <div className={styles.inquiryDetails}>
                    <span className={styles.inquirySpace}><FaCalendarAlt /> Meditation Room</span>
                    <span className={styles.inquiryDate}>This weekend</span>
                    <span className={styles.inquiryPrice}><FaDollarSign /> TBD</span>
                  </div>
                </div>
                <div className={styles.inquiryActions}>
                  <button className={styles.replyBtn}>Reply</button>
                  <button className={styles.viewBtn}>View</button>
                </div>
              </div>

              <div className={styles.inquiryItem}>
                <div className={styles.inquiryAvatar}>
                  <FaUser />
                </div>
                <div className={styles.inquiryContent}>
                  <div className={styles.inquiryHeader}>
                    <h4 className={styles.inquiryName}>Emma Wilson</h4>
                    <span className={styles.inquiryTime}>3 days ago</span>
                  </div>
                  <p className={styles.inquiryMessage}>Hi there! I'm looking for a conference room for a business meeting. What are your rates?</p>
                  <div className={styles.inquiryDetails}>
                    <span className={styles.inquirySpace}><FaCalendarAlt /> Conference Room</span>
                    <span className={styles.inquiryDate}>Flexible timing</span>
                    <span className={styles.inquiryPrice}><FaDollarSign /> Rate inquiry</span>
                  </div>
                </div>
                <div className={styles.inquiryActions}>
                  <button className={styles.replyBtn}>Reply</button>
                  <button className={styles.viewBtn}>View</button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'confirmations':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Booking Confirmations</h2>
            
            <div className={styles.confirmationsList}>
              <div className={styles.confirmationItem}>
                <div className={styles.confirmationIcon}><FaCheckCircle /></div>
                <div className={styles.confirmationContent}>
                  <h4 className={styles.confirmationTitle}>Booking Confirmed</h4>
                  <p className={styles.confirmationMessage}>Yoga Studio rental for Sarah Johnson on Dec 20th has been confirmed.</p>
                  <div className={styles.confirmationDetails}>
                    <span className={styles.confirmationSpace}><FaCalendarAlt /> Yoga Studio</span>
                    <span className={styles.confirmationDate}>Dec 20, 2:00 PM - 4:00 PM</span>
                    <span className={styles.confirmationPrice}><FaDollarSign /> $240</span>
                  </div>
                  <p className={styles.confirmationTime}>Sent 2 hours ago</p>
                </div>
                <div className={styles.confirmationActions}>
                  <button className={styles.viewBtn}>View</button>
                </div>
              </div>

              <div className={styles.confirmationItem}>
                <div className={styles.confirmationIcon}><FaClock /></div>
                <div className={styles.confirmationContent}>
                  <h4 className={styles.confirmationTitle}>Reminder Sent</h4>
                  <p className={styles.confirmationMessage}>Booking reminder sent to Mike Chen for meditation room session tomorrow.</p>
                  <div className={styles.confirmationDetails}>
                    <span className={styles.confirmationSpace}><FaCalendarAlt /> Meditation Room</span>
                    <span className={styles.confirmationDate}>Dec 18, 10:00 AM - 11:00 AM</span>
                    <span className={styles.confirmationPrice}><FaDollarSign /> $80</span>
                  </div>
                  <p className={styles.confirmationTime}>Sent 1 day ago</p>
                </div>
                <div className={styles.confirmationActions}>
                  <button className={styles.viewBtn}>View</button>
                </div>
              </div>

              <div className={styles.confirmationItem}>
                <div className={styles.confirmationIcon}><FaCheckCircle /></div>
                <div className={styles.confirmationContent}>
                  <h4 className={styles.confirmationTitle}>Payment Confirmed</h4>
                  <p className={styles.confirmationMessage}>Payment of $120 for Emma Wilson's conference room booking has been processed.</p>
                  <div className={styles.confirmationDetails}>
                    <span className={styles.confirmationSpace}><FaCalendarAlt /> Conference Room</span>
                    <span className={styles.confirmationDate}>Dec 22, 7:00 PM - 8:00 PM</span>
                    <span className={styles.confirmationPrice}><FaDollarSign /> $60</span>
                  </div>
                  <p className={styles.confirmationTime}>Sent 3 days ago</p>
                </div>
                <div className={styles.confirmationActions}>
                  <button className={styles.viewBtn}>View</button>
                </div>
              </div>
            </div>

            <div className={styles.confirmationSettings}>
              <h3 className={styles.subsectionTitle}>Auto-Confirmation Settings</h3>
              <div className={styles.settingsCard}>
                <div className={styles.settingItem}>
                  <label className={styles.settingLabel}>Auto-confirm bookings</label>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className={styles.settingItem}>
                  <label className={styles.settingLabel}>Send reminders 24h before</label>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className={styles.settingItem}>
                  <label className={styles.settingLabel}>Send payment confirmations</label>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Messages</h2>
            <div className={styles.placeholderText}>
              <p>Manage all your space rental communications.</p>
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
