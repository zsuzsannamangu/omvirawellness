'use client';

import { FaUser, FaCog, FaBell } from 'react-icons/fa';
import styles from '@/styles/Clients/Dashboard.module.scss';

interface ProfileProps {
  activeSubmenu: string;
}

export default function Profile({ activeSubmenu }: ProfileProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'personal':
        return (
          <div className={styles.profileContent}>
            <h2 className={styles.sectionTitle}>Personal Information</h2>
            <div className={styles.profileForm}>
              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Basic Information</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>First Name</label>
                    <input type="text" className={styles.formInput} defaultValue="John" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Last Name</label>
                    <input type="text" className={styles.formInput} defaultValue="Doe" />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email</label>
                    <input type="email" className={styles.formInput} defaultValue="john.doe@email.com" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone</label>
                    <input type="tel" className={styles.formInput} defaultValue="(555) 123-4567" />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Date of Birth</label>
                  <input type="date" className={styles.formInput} defaultValue="1990-01-15" />
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Address</h3>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Street Address</label>
                  <input type="text" className={styles.formInput} defaultValue="123 Main Street" />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>City</label>
                    <input type="text" className={styles.formInput} defaultValue="San Francisco" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>State</label>
                    <input type="text" className={styles.formInput} defaultValue="CA" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>ZIP Code</label>
                    <input type="text" className={styles.formInput} defaultValue="94102" />
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.saveBtn}>Save Changes</button>
                <button className={styles.cancelBtn}>Cancel</button>
              </div>
            </div>
          </div>
        );
      
      case 'preferences':
        return (
          <div className={styles.profileContent}>
            <h2 className={styles.sectionTitle}>Wellness Preferences</h2>
            <div className={styles.preferencesForm}>
              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Preferred Services</h3>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.checkboxText}>Massage Therapy</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.checkboxText}>Yoga Classes</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.checkboxText}>Meditation</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" />
                    <span className={styles.checkboxText}>Personal Training</span>
                  </label>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Preferred Times</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Start Time</label>
                    <select className={styles.formSelect} defaultValue="afternoon">
                      <option value="morning">Morning (6 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                      <option value="evening">Evening (6 PM - 10 PM)</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Days</label>
                    <select className={styles.formSelect} defaultValue="weekends">
                      <option value="weekdays">Weekdays</option>
                      <option value="weekends">Weekends</option>
                      <option value="any">Any Day</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Location Preferences</h3>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Preferred Location</label>
                  <select className={styles.formSelect}>
                    <option value="downtown">Downtown Wellness Center</option>
                    <option value="zen">Zen Studio</option>
                    <option value="mindful">Mindful Living Center</option>
                    <option value="any">Any Location</option>
                  </select>
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.saveBtn}>Save Preferences</button>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className={styles.profileContent}>
            <h2 className={styles.sectionTitle}>Notification Settings</h2>
            <div className={styles.notificationsForm}>
              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Email Notifications</h3>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.checkboxText}>Appointment confirmations</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.checkboxText}>Appointment reminders</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.checkboxText}>Payment confirmations</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" />
                    <span className={styles.checkboxText}>Marketing emails</span>
                  </label>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>SMS Notifications</h3>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.checkboxText}>Appointment reminders (24 hours before)</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" />
                    <span className={styles.checkboxText}>Appointment reminders (2 hours before)</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.checkboxText}>Cancellation confirmations</span>
                  </label>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Push Notifications</h3>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.checkboxText}>New messages from providers</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" />
                    <span className={styles.checkboxText}>Appointment updates</span>
                  </label>
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.saveBtn}>Save Settings</button>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.profileContent}>
            <h2 className={styles.sectionTitle}>Profile & Settings</h2>
            <div className={styles.profileOverview}>
              <div className={styles.overviewCard}>
                <div className={styles.cardIcon}><FaUser /></div>
                <h3>Personal Information</h3>
                <p className={styles.subtext}>Manage your basic info and contact details</p>
                <button className={styles.viewBtn}>Edit Profile</button>
              </div>
              <div className={styles.overviewCard}>
                <div className={styles.cardIcon}><FaCog /></div>
                <h3>Wellness Preferences</h3>
                <p className={styles.subtext}>Customize your service preferences</p>
                <button className={styles.viewBtn}>Set Preferences</button>
              </div>
              <div className={styles.overviewCard}>
                <div className={styles.cardIcon}><FaBell /></div>
                <h3>Notifications</h3>
                <p className={styles.subtext}>Control how you receive updates</p>
                <button className={styles.viewBtn}>Manage Notifications</button>
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
