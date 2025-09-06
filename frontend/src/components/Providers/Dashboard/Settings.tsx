'use client';

import styles from '@/styles/Providers/Dashboard.module.scss';

interface SettingsProps {
  activeSubmenu: string;
}

export default function Settings({ activeSubmenu }: SettingsProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'profile':
        return (
          <div className={styles.profileContent}>
            <h2 className={styles.sectionTitle}>Provider Profile</h2>
            
            <div className={styles.profileForm}>
              <div className={styles.formSection}>
                <h3 className={styles.subsectionTitle}>Basic Information</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Full Name</label>
                    <input type="text" className={styles.formInput} defaultValue="Sarah Johnson" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Specialty</label>
                    <select className={styles.formSelect}>
                      <option value="massage">Massage Therapist</option>
                      <option value="yoga">Yoga Instructor</option>
                      <option value="meditation">Meditation Guide</option>
                      <option value="training">Personal Trainer</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Bio</label>
                  <textarea className={styles.formTextarea} rows={4} defaultValue="Licensed massage therapist with 8 years of experience specializing in deep tissue and therapeutic massage. Certified in multiple modalities including Swedish, hot stone, and prenatal massage."></textarea>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.subsectionTitle}>Contact Information</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email</label>
                    <input type="email" className={styles.formInput} defaultValue="sarah.johnson@email.com" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone</label>
                    <input type="tel" className={styles.formInput} defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Address</label>
                  <input type="text" className={styles.formInput} defaultValue="123 Wellness St, San Francisco, CA 94102" />
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.saveBtn}>Save Changes</button>
              </div>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className={styles.servicesContent}>
            <h2 className={styles.sectionTitle}>Services Offered</h2>
            
            <div className={styles.servicesForm}>
              <div className={styles.formSection}>
                <h3 className={styles.subsectionTitle}>Available Services</h3>
                <div className={styles.servicesGrid}>
                  <label className={styles.serviceItem}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.serviceLabel}>Massage Therapy</span>
                  </label>
                  <label className={styles.serviceItem}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.serviceLabel}>Yoga Classes</span>
                  </label>
                  <label className={styles.serviceItem}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.serviceLabel}>Meditation Sessions</span>
                  </label>
                  <label className={styles.serviceItem}>
                    <input type="checkbox" />
                    <span className={styles.serviceLabel}>Personal Training</span>
                  </label>
                  <label className={styles.serviceItem}>
                    <input type="checkbox" />
                    <span className={styles.serviceLabel}>Energy Healing</span>
                  </label>
                  <label className={styles.serviceItem}>
                    <input type="checkbox" />
                    <span className={styles.serviceLabel}>Aromatherapy</span>
                  </label>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.subsectionTitle}>Service Details</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Session Duration (minutes)</label>
                    <select className={styles.formSelect}>
                      <option value="30">30 minutes</option>
                      <option value="60" selected>60 minutes</option>
                      <option value="90">90 minutes</option>
                      <option value="120">120 minutes</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Maximum Clients per Session</label>
                    <input type="number" className={styles.formInput} defaultValue="1" />
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.saveBtn}>Update Services</button>
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className={styles.pricingContent}>
            <h2 className={styles.sectionTitle}>Pricing Settings</h2>
            
            <div className={styles.pricingForm}>
              <div className={styles.formSection}>
                <h3 className={styles.subsectionTitle}>Base Pricing</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Hourly Rate</label>
                    <div className={styles.priceInput}>
                      <span className={styles.currencySymbol}>$</span>
                      <input type="number" className={styles.formInput} defaultValue="120" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Minimum Booking</label>
                    <select className={styles.formSelect}>
                      <option value="30">30 minutes</option>
                      <option value="60" selected>1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.subsectionTitle}>Package Deals</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>5-Session Package</label>
                    <div className={styles.priceInput}>
                      <span className={styles.currencySymbol}>$</span>
                      <input type="number" className={styles.formInput} defaultValue="550" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>10-Session Package</label>
                    <div className={styles.priceInput}>
                      <span className={styles.currencySymbol}>$</span>
                      <input type="number" className={styles.formInput} defaultValue="1000" />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.saveBtn}>Update Pricing</button>
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
