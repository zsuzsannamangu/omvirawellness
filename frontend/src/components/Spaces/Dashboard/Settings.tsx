'use client';

import styles from '@/styles/Spaces/Dashboard.module.scss';

interface SettingsProps {
  activeSubmenu: string;
}

export default function Settings({ activeSubmenu }: SettingsProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'profile':
        return (
          <div className={styles.profileContent}>
            <h2 className={styles.sectionTitle}>Space Profile</h2>
            
            <div className={styles.profileForm}>
              <div className={styles.formSection}>
                <h3 className={styles.subsectionTitle}>Basic Information</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Space Name</label>
                    <input type="text" className={styles.formInput} defaultValue="Zen Wellness Studio" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Space Type</label>
                    <select className={styles.formSelect}>
                      <option value="massage">Massage Room</option>
                      <option value="yoga">Yoga Studio</option>
                      <option value="meditation">Meditation Space</option>
                      <option value="therapy">Therapy Room</option>
                    </select>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea className={styles.formTextarea} rows={4} defaultValue="A peaceful and serene space perfect for wellness practices. Features natural lighting, calming colors, and all necessary equipment."></textarea>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.subsectionTitle}>Location</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Address</label>
                    <input type="text" className={styles.formInput} defaultValue="123 Wellness St" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>City</label>
                    <input type="text" className={styles.formInput} defaultValue="San Francisco" />
                  </div>
                </div>
                
                <div className={styles.formRow}>
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
                <h3 className={styles.subsectionTitle}>Peak Hours Pricing</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Peak Hours</label>
                    <select className={styles.formSelect}>
                      <option value="weekday-evening">Weekday Evenings (6-9 PM)</option>
                      <option value="weekend">Weekends</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Peak Rate Multiplier</label>
                    <select className={styles.formSelect}>
                      <option value="1.2">1.2x (20% more)</option>
                      <option value="1.5" selected>1.5x (50% more)</option>
                      <option value="2.0">2.0x (100% more)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.saveBtn}>Update Pricing</button>
              </div>
            </div>
          </div>
        );

      case 'amenities':
        return (
          <div className={styles.amenitiesContent}>
            <h2 className={styles.sectionTitle}>Amenities & Features</h2>
            
            <div className={styles.amenitiesForm}>
              <div className={styles.formSection}>
                <h3 className={styles.subsectionTitle}>Available Amenities</h3>
                <div className={styles.amenitiesGrid}>
                  <label className={styles.amenityItem}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.amenityLabel}>Massage Table</span>
                  </label>
                  <label className={styles.amenityItem}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.amenityLabel}>Yoga Mats</span>
                  </label>
                  <label className={styles.amenityItem}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.amenityLabel}>Sound System</span>
                  </label>
                  <label className={styles.amenityItem}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.amenityLabel}>Air Conditioning</span>
                  </label>
                  <label className={styles.amenityItem}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.amenityLabel}>WiFi</span>
                  </label>
                  <label className={styles.amenityItem}>
                    <input type="checkbox" />
                    <span className={styles.amenityLabel}>Parking</span>
                  </label>
                  <label className={styles.amenityItem}>
                    <input type="checkbox" />
                    <span className={styles.amenityLabel}>Shower</span>
                  </label>
                  <label className={styles.amenityItem}>
                    <input type="checkbox" />
                    <span className={styles.amenityLabel}>Kitchen</span>
                  </label>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.subsectionTitle}>Space Capacity</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Maximum Occupancy</label>
                    <input type="number" className={styles.formInput} defaultValue="8" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Square Footage</label>
                    <input type="number" className={styles.formInput} defaultValue="400" />
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.saveBtn}>Update Amenities</button>
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
