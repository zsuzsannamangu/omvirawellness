'use client';

import { FaUser, FaCog, FaFileAlt, FaSave, FaTimes, FaCheckCircle, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import styles from '@/styles/Spaces/Dashboard.module.scss';

interface ProfileProps {
  activeSubmenu: string;
}

export default function Profile({ activeSubmenu }: ProfileProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'host':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Host Information</h2>
            
            <div className={styles.hostForm}>
              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Basic Information</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Business Name</label>
                    <input type="text" className={styles.formInput} defaultValue="Zen Wellness Studio" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Contact Person</label>
                    <input type="text" className={styles.formInput} defaultValue="Sarah Johnson" />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone Number</label>
                    <input type="tel" className={styles.formInput} defaultValue="(555) 123-4567" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email Address</label>
                    <input type="email" className={styles.formInput} defaultValue="sarah@zenwellness.com" />
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Address</h3>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Street Address</label>
                  <input type="text" className={styles.formInput} defaultValue="123 Wellness Way" />
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

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Business Description</h3>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Bio</label>
                  <textarea className={styles.formTextarea} rows={4} defaultValue="Zen Wellness Studio offers a peaceful sanctuary for yoga, meditation, and wellness practices. Our beautifully designed spaces provide the perfect environment for personal growth and healing."></textarea>
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.saveBtn}>Save Changes</button>
                <button className={styles.cancelBtn}>Cancel</button>
              </div>
            </div>
          </div>
        );
      
      case 'policies':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Rental Policies</h2>
            
            <div className={styles.policiesForm}>
              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Cancellation Policy</h3>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Cancellation Window</label>
                  <select className={styles.formSelect} defaultValue="24">
                    <option value="1">1 hour before</option>
                    <option value="24">24 hours before</option>
                    <option value="48">48 hours before</option>
                    <option value="72">72 hours before</option>
                    <option value="7">7 days before</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Refund Policy</label>
                  <select className={styles.formSelect} defaultValue="partial">
                    <option value="full">Full refund</option>
                    <option value="partial">Partial refund (50%)</option>
                    <option value="credit">Credit only</option>
                    <option value="none">No refund</option>
                  </select>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>House Rules</h3>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.checkboxText}>No smoking</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.checkboxText}>No pets allowed</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.checkboxText}>No outside food/drinks</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.checkboxText}>Clean up after use</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.checkboxText}>Respect quiet hours</span>
                  </label>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Rental Terms</h3>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Minimum Rental Duration</label>
                  <select className={styles.formSelect} defaultValue="1">
                    <option value="0.5">30 minutes</option>
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="4">4 hours</option>
                    <option value="8">8 hours</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Maximum Rental Duration</label>
                  <select className={styles.formSelect} defaultValue="8">
                    <option value="4">4 hours</option>
                    <option value="8">8 hours</option>
                    <option value="12">12 hours</option>
                    <option value="24">24 hours</option>
                    <option value="unlimited">Unlimited</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Advance Booking Required</label>
                  <select className={styles.formSelect} defaultValue="24">
                    <option value="1">1 hour</option>
                    <option value="24">24 hours</option>
                    <option value="48">48 hours</option>
                    <option value="72">72 hours</option>
                    <option value="7">7 days</option>
                  </select>
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.saveBtn}>Save Policies</button>
              </div>
            </div>
          </div>
        );
      
      case 'instructions':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Renter Instructions</h2>
            
            <div className={styles.instructionsForm}>
              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Access Information</h3>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Entry Instructions</label>
                  <textarea className={styles.formTextarea} rows={3} defaultValue="Please use the main entrance on Wellness Way. The door code is 1234. Ring the bell if you need assistance."></textarea>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Parking Information</label>
                  <textarea className={styles.formTextarea} rows={2} defaultValue="Free street parking available on Wellness Way. Please do not block the driveway."></textarea>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Emergency Contact</label>
                  <input type="text" className={styles.formInput} defaultValue="(555) 123-4567 - Sarah Johnson" />
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Space-Specific Instructions</h3>
                <div className={styles.spaceInstructions}>
                  <div className={styles.spaceInstructionItem}>
                    <h4 className={styles.spaceName}>Yoga Studio</h4>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Usage Guidelines</label>
                      <textarea className={styles.formTextarea} rows={2} defaultValue="Please remove shoes before entering. Yoga mats and props are provided. Please clean and return all equipment after use."></textarea>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Equipment Available</label>
                      <textarea className={styles.formTextarea} rows={2} defaultValue="Yoga mats, blocks, straps, blankets, and meditation cushions. Sound system with Bluetooth connectivity."></textarea>
                    </div>
                  </div>

                  <div className={styles.spaceInstructionItem}>
                    <h4 className={styles.spaceName}>Meditation Room</h4>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Usage Guidelines</label>
                      <textarea className={styles.formTextarea} rows={2} defaultValue="Please maintain silence in this space. Meditation cushions and blankets are provided. Please turn off all electronic devices."></textarea>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Equipment Available</label>
                      <textarea className={styles.formTextarea} rows={2} defaultValue="Meditation cushions, blankets, meditation timer, and soft lighting controls."></textarea>
                    </div>
                  </div>

                  <div className={styles.spaceInstructionItem}>
                    <h4 className={styles.spaceName}>Conference Room</h4>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Usage Guidelines</label>
                      <textarea className={styles.formTextarea} rows={2} defaultValue="Please keep the space clean and organized. All equipment should be turned off when finished. Whiteboard markers are provided."></textarea>
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Equipment Available</label>
                      <textarea className={styles.formTextarea} rows={2} defaultValue="Projector, projection screen, whiteboard, conference table, chairs, and WiFi access."></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <button className={styles.saveBtn}>Save Instructions</button>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Profile & Preferences</h2>
            <div className={styles.placeholderText}>
              <p>Manage your host profile and space settings.</p>
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
