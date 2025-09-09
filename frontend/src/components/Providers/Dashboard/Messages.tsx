'use client';

import { FaEnvelope, FaPaperPlane, FaClock, FaUser, FaBell, FaCheckCircle, FaEdit, FaTrash } from 'react-icons/fa';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface MessagesProps {
  activeSubmenu: string;
}

export default function Messages({ activeSubmenu }: MessagesProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'communication':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Client Communication</h2>
            
            <div className={styles.messagesContainer}>
              <div className={styles.conversationsList}>
                <h3 className={styles.conversationsTitle}>Recent Conversations</h3>
                <div className={styles.conversationItem}>
                  <div className={styles.conversationAvatar}>
                    <FaUser />
                  </div>
                  <div className={styles.conversationInfo}>
                    <h4 className={styles.conversationName}>John Smith</h4>
                    <p className={styles.conversationPreview}>Thanks for the great session today!</p>
                    <p className={styles.conversationTime}>2 hours ago</p>
                  </div>
                  <div className={styles.conversationStatus}>
                    <span className={styles.unreadBadge}>2</span>
                  </div>
                </div>

                <div className={styles.conversationItem}>
                  <div className={styles.conversationAvatar}>
                    <FaUser />
                  </div>
                  <div className={styles.conversationInfo}>
                    <h4 className={styles.conversationName}>Emma Wilson</h4>
                    <p className={styles.conversationPreview}>Can we reschedule for next week?</p>
                    <p className={styles.conversationTime}>1 day ago</p>
                  </div>
                  <div className={styles.conversationStatus}>
                    <FaCheckCircle className={styles.readIcon} />
                  </div>
                </div>

                <div className={styles.conversationItem}>
                  <div className={styles.conversationAvatar}>
                    <FaUser />
                  </div>
                  <div className={styles.conversationInfo}>
                    <h4 className={styles.conversationName}>Mike Chen</h4>
                    <p className={styles.conversationPreview}>Looking forward to our session tomorrow</p>
                    <p className={styles.conversationTime}>2 days ago</p>
                  </div>
                  <div className={styles.conversationStatus}>
                    <FaCheckCircle className={styles.readIcon} />
                  </div>
                </div>
              </div>

              <div className={styles.messageCompose}>
                <h3 className={styles.composeTitle}>Send Message</h3>
                <div className={styles.composeForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>To</label>
                    <select className={styles.formSelect}>
                      <option value="">Select client</option>
                      <option value="john">John Smith</option>
                      <option value="emma">Emma Wilson</option>
                      <option value="mike">Mike Chen</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Subject</label>
                    <input type="text" className={styles.formInput} placeholder="Message subject" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Message</label>
                    <textarea className={styles.formTextarea} rows={4} placeholder="Type your message here..."></textarea>
                  </div>
                  <div className={styles.composeActions}>
                    <button className={styles.sendBtn}>
                      <FaPaperPlane /> Send Message
                    </button>
                    <button className={styles.draftBtn}>Save as Draft</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'reminders':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Reminders</h2>
            
            <div className={styles.remindersContainer}>
              <div className={styles.reminderTemplates}>
                <h3 className={styles.templatesTitle}>Reminder Templates</h3>
                <div className={styles.templateList}>
                  <div className={styles.templateItem}>
                    <div className={styles.templateInfo}>
                      <h4 className={styles.templateName}>Appointment Confirmation</h4>
                      <p className={styles.templateText}>Hi {clientName}, this is a reminder that you have an appointment with me on {date} at {time}.</p>
                    </div>
                    <div className={styles.templateActions}>
                      <button className={styles.editBtn}><FaEdit /></button>
                      <button className={styles.deleteBtn}><FaTrash /></button>
                    </div>
                  </div>

                  <div className={styles.templateItem}>
                    <div className={styles.templateInfo}>
                      <h4 className={styles.templateName}>24-Hour Reminder</h4>
                      <p className={styles.templateText}>Don't forget about your appointment tomorrow at {time}. See you soon!</p>
                    </div>
                    <div className={styles.templateActions}>
                      <button className={styles.editBtn}><FaEdit /></button>
                      <button className={styles.deleteBtn}><FaTrash /></button>
                    </div>
                  </div>

                  <div className={styles.templateItem}>
                    <div className={styles.templateInfo}>
                      <h4 className={styles.templateName}>Follow-up Message</h4>
                      <p className={styles.templateText}>How are you feeling after our session? I hope you found it helpful!</p>
                    </div>
                    <div className={styles.templateActions}>
                      <button className={styles.editBtn}><FaEdit /></button>
                      <button className={styles.deleteBtn}><FaTrash /></button>
                    </div>
                  </div>
                </div>

                <button className={styles.addTemplateBtn}>
                  <FaEdit /> Add New Template
                </button>
              </div>

              <div className={styles.reminderSettings}>
                <h3 className={styles.settingsTitle}>Reminder Settings</h3>
                <div className={styles.settingItem}>
                  <label className={styles.settingLabel}>
                    <input type="checkbox" defaultChecked />
                    Send appointment confirmations
                  </label>
                  <p className={styles.settingDescription}>Automatically send confirmation when appointment is booked</p>
                </div>
                <div className={styles.settingItem}>
                  <label className={styles.settingLabel}>
                    <input type="checkbox" defaultChecked />
                    Send 24-hour reminders
                  </label>
                  <p className={styles.settingDescription}>Remind clients 24 hours before their appointment</p>
                </div>
                <div className={styles.settingItem}>
                  <label className={styles.settingLabel}>
                    <input type="checkbox" />
                    Send follow-up messages
                  </label>
                  <p className={styles.settingDescription}>Send a follow-up message after each session</p>
                </div>
                <div className={styles.settingItem}>
                  <label className={styles.settingLabel}>
                    <input type="checkbox" />
                    Send birthday wishes
                  </label>
                  <p className={styles.settingDescription}>Automatically send birthday messages to clients</p>
                </div>
              </div>
            </div>

            <div className={styles.scheduledReminders}>
              <h3 className={styles.scheduledTitle}>Scheduled Reminders</h3>
              <div className={styles.reminderList}>
                <div className={styles.reminderItem}>
                  <div className={styles.reminderIcon}>
                    <FaBell />
                  </div>
                  <div className={styles.reminderInfo}>
                    <h4 className={styles.reminderTitle}>Appointment Confirmation</h4>
                    <p className={styles.reminderClient}>John Smith - Dec 20, 2:00 PM</p>
                    <p className={styles.reminderTime}>Scheduled for Dec 19, 2:00 PM</p>
                  </div>
                  <div className={styles.reminderStatus}>
                    <span className={styles.statusPending}>Pending</span>
                  </div>
                </div>

                <div className={styles.reminderItem}>
                  <div className={styles.reminderIcon}>
                    <FaBell />
                  </div>
                  <div className={styles.reminderInfo}>
                    <h4 className={styles.reminderTitle}>24-Hour Reminder</h4>
                    <p className={styles.reminderClient}>Emma Wilson - Dec 18, 10:00 AM</p>
                    <p className={styles.reminderTime}>Scheduled for Dec 17, 10:00 AM</p>
                  </div>
                  <div className={styles.reminderStatus}>
                    <span className={styles.statusSent}>Sent</span>
                  </div>
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
              <p>Manage all your client communications.</p>
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
