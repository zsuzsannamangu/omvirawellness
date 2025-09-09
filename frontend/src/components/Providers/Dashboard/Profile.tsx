'use client';

import { FaPlus, FaEdit, FaTrash, FaClock, FaDollarSign, FaUpload, FaFileAlt, FaCheckCircle, FaStar } from 'react-icons/fa';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface ProfileProps {
  activeSubmenu: string;
}

export default function Profile({ activeSubmenu }: ProfileProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'services':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Service Menu</h2>
            
            <div className={styles.servicesContainer}>
              <div className={styles.servicesHeader}>
                <h3 className={styles.servicesSubtitle}>Your Services</h3>
                <button className={styles.addServiceBtn}>
                  <FaPlus /> Add New Service
                </button>
              </div>

              <div className={styles.servicesList}>
                <div className={styles.serviceItem}>
                  <div className={styles.serviceInfo}>
                    <h4 className={styles.serviceName}>Massage Therapy</h4>
                    <p className={styles.serviceDescription}>Deep tissue and Swedish massage therapy sessions</p>
                    <div className={styles.serviceDetails}>
                      <span className={styles.serviceDuration}><FaClock /> 60 minutes</span>
                      <span className={styles.servicePrice}><FaDollarSign /> $120</span>
                    </div>
                  </div>
                  <div className={styles.serviceActions}>
                    <button className={styles.editBtn}><FaEdit /></button>
                    <button className={styles.deleteBtn}><FaTrash /></button>
                  </div>
                </div>

                <div className={styles.serviceItem}>
                  <div className={styles.serviceInfo}>
                    <h4 className={styles.serviceName}>Yoga Class</h4>
                    <p className={styles.serviceDescription}>Hatha and Vinyasa yoga classes for all levels</p>
                    <div className={styles.serviceDetails}>
                      <span className={styles.serviceDuration}><FaClock /> 45 minutes</span>
                      <span className={styles.servicePrice}><FaDollarSign /> $80</span>
                    </div>
                  </div>
                  <div className={styles.serviceActions}>
                    <button className={styles.editBtn}><FaEdit /></button>
                    <button className={styles.deleteBtn}><FaTrash /></button>
                  </div>
                </div>

                <div className={styles.serviceItem}>
                  <div className={styles.serviceInfo}>
                    <h4 className={styles.serviceName}>Meditation Session</h4>
                    <p className={styles.serviceDescription}>Guided meditation and mindfulness sessions</p>
                    <div className={styles.serviceDetails}>
                      <span className={styles.serviceDuration}><FaClock /> 30 minutes</span>
                      <span className={styles.servicePrice}><FaDollarSign /> $60</span>
                    </div>
                  </div>
                  <div className={styles.serviceActions}>
                    <button className={styles.editBtn}><FaEdit /></button>
                    <button className={styles.deleteBtn}><FaTrash /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'availability':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Availability</h2>
            
            <div className={styles.availabilityContainer}>
              <div className={styles.availabilitySettings}>
                <h3 className={styles.availabilitySubtitle}>Working Hours</h3>
                <div className={styles.hoursGrid}>
                  <div className={styles.dayHours}>
                    <h4 className={styles.dayName}>Monday</h4>
                    <div className={styles.timeInputs}>
                      <input type="time" className={styles.timeInput} defaultValue="09:00" />
                      <span className={styles.timeSeparator}>to</span>
                      <input type="time" className={styles.timeInput} defaultValue="17:00" />
                    </div>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked />
                      Available
                    </label>
                  </div>

                  <div className={styles.dayHours}>
                    <h4 className={styles.dayName}>Tuesday</h4>
                    <div className={styles.timeInputs}>
                      <input type="time" className={styles.timeInput} defaultValue="09:00" />
                      <span className={styles.timeSeparator}>to</span>
                      <input type="time" className={styles.timeInput} defaultValue="17:00" />
                    </div>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked />
                      Available
                    </label>
                  </div>

                  <div className={styles.dayHours}>
                    <h4 className={styles.dayName}>Wednesday</h4>
                    <div className={styles.timeInputs}>
                      <input type="time" className={styles.timeInput} defaultValue="09:00" />
                      <span className={styles.timeSeparator}>to</span>
                      <input type="time" className={styles.timeInput} defaultValue="17:00" />
                    </div>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked />
                      Available
                    </label>
                  </div>

                  <div className={styles.dayHours}>
                    <h4 className={styles.dayName}>Thursday</h4>
                    <div className={styles.timeInputs}>
                      <input type="time" className={styles.timeInput} defaultValue="09:00" />
                      <span className={styles.timeSeparator}>to</span>
                      <input type="time" className={styles.timeInput} defaultValue="17:00" />
                    </div>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked />
                      Available
                    </label>
                  </div>

                  <div className={styles.dayHours}>
                    <h4 className={styles.dayName}>Friday</h4>
                    <div className={styles.timeInputs}>
                      <input type="time" className={styles.timeInput} defaultValue="09:00" />
                      <span className={styles.timeSeparator}>to</span>
                      <input type="time" className={styles.timeInput} defaultValue="17:00" />
                    </div>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked />
                      Available
                    </label>
                  </div>

                  <div className={styles.dayHours}>
                    <h4 className={styles.dayName}>Saturday</h4>
                    <div className={styles.timeInputs}>
                      <input type="time" className={styles.timeInput} defaultValue="10:00" />
                      <span className={styles.timeSeparator}>to</span>
                      <input type="time" className={styles.timeInput} defaultValue="15:00" />
                    </div>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" />
                      Available
                    </label>
                  </div>

                  <div className={styles.dayHours}>
                    <h4 className={styles.dayName}>Sunday</h4>
                    <div className={styles.timeInputs}>
                      <input type="time" className={styles.timeInput} defaultValue="10:00" />
                      <span className={styles.timeSeparator}>to</span>
                      <input type="time" className={styles.timeInput} defaultValue="15:00" />
                    </div>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" />
                      Available
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.blockedTimes}>
                <h3 className={styles.blockedTitle}>Blocked Times</h3>
                <div className={styles.blockedList}>
                  <div className={styles.blockedItem}>
                    <div className={styles.blockedInfo}>
                      <h4 className={styles.blockedName}>Vacation</h4>
                      <p className={styles.blockedDate}>Dec 25 - Jan 2, 2025</p>
                    </div>
                    <button className={styles.removeBlockedBtn}><FaTrash /></button>
                  </div>
                </div>
                <button className={styles.addBlockedBtn}>
                  <FaPlus /> Add Blocked Time
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'bio':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Bio</h2>
            
            <div className={styles.bioContainer}>
              <div className={styles.bioForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Professional Title</label>
                  <input type="text" className={styles.formInput} defaultValue="Licensed Massage Therapist & Yoga Instructor" />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Bio</label>
                  <textarea 
                    className={styles.formTextarea} 
                    rows={8} 
                    defaultValue="With over 8 years of experience in wellness and healing, I specialize in therapeutic massage and mindful yoga practices. I'm passionate about helping clients achieve physical and mental well-being through personalized treatment plans and holistic approaches.

My journey began with a deep interest in alternative healing methods, leading me to pursue certifications in Swedish massage, deep tissue therapy, and various yoga traditions. I believe in creating a safe, nurturing environment where clients can relax, heal, and reconnect with their bodies.

I'm committed to continuing education and staying current with the latest techniques in massage therapy and yoga instruction. My goal is to empower each client to take an active role in their wellness journey."
                  ></textarea>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Specialties</label>
                  <div className={styles.specialtiesList}>
                    <span className={styles.specialtyTag}>Deep Tissue Massage</span>
                    <span className={styles.specialtyTag}>Swedish Massage</span>
                    <span className={styles.specialtyTag}>Hatha Yoga</span>
                    <span className={styles.specialtyTag}>Vinyasa Yoga</span>
                    <span className={styles.specialtyTag}>Meditation</span>
                    <span className={styles.specialtyTag}>Stress Relief</span>
                  </div>
                </div>

                <div className={styles.bioActions}>
                  <button className={styles.saveBtn}>Save Bio</button>
                  <button className={styles.previewBtn}>Preview</button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'certifications':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Certifications</h2>
            
            <div className={styles.certificationsContainer}>
              <div className={styles.certificationsList}>
                <div className={styles.certificationItem}>
                  <div className={styles.certIcon}>
                    <FaFileAlt />
                  </div>
                  <div className={styles.certInfo}>
                    <h4 className={styles.certName}>Licensed Massage Therapist</h4>
                    <p className={styles.certIssuer}>California Massage Therapy Council</p>
                    <p className={styles.certDate}>Issued: March 2018 • Expires: March 2025</p>
                  </div>
                  <div className={styles.certStatus}>
                    <span className={styles.statusValid}>Valid</span>
                  </div>
                  <div className={styles.certActions}>
                    <button className={styles.editBtn}><FaEdit /></button>
                    <button className={styles.deleteBtn}><FaTrash /></button>
                  </div>
                </div>

                <div className={styles.certificationItem}>
                  <div className={styles.certIcon}>
                    <FaFileAlt />
                  </div>
                  <div className={styles.certInfo}>
                    <h4 className={styles.certName}>200-Hour Yoga Teacher Training</h4>
                    <p className={styles.certIssuer}>Yoga Alliance</p>
                    <p className={styles.certDate}>Issued: June 2020 • No expiration</p>
                  </div>
                  <div className={styles.certStatus}>
                    <span className={styles.statusValid}>Valid</span>
                  </div>
                  <div className={styles.certActions}>
                    <button className={styles.editBtn}><FaEdit /></button>
                    <button className={styles.deleteBtn}><FaTrash /></button>
                  </div>
                </div>

                <div className={styles.certificationItem}>
                  <div className={styles.certIcon}>
                    <FaFileAlt />
                  </div>
                  <div className={styles.certInfo}>
                    <h4 className={styles.certName}>CPR & First Aid Certification</h4>
                    <p className={styles.certIssuer}>American Red Cross</p>
                    <p className={styles.certDate}>Issued: January 2024 • Expires: January 2026</p>
                  </div>
                  <div className={styles.certStatus}>
                    <span className={styles.statusValid}>Valid</span>
                  </div>
                  <div className={styles.certActions}>
                    <button className={styles.editBtn}><FaEdit /></button>
                    <button className={styles.deleteBtn}><FaTrash /></button>
                  </div>
                </div>
              </div>

              <div className={styles.addCertification}>
                <h3 className={styles.addCertTitle}>Add New Certification</h3>
                <div className={styles.certForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Certification Name</label>
                      <input type="text" className={styles.formInput} placeholder="e.g., Advanced Massage Techniques" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Issuing Organization</label>
                      <input type="text" className={styles.formInput} placeholder="e.g., National Certification Board" />
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Issue Date</label>
                      <input type="date" className={styles.formInput} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Expiration Date</label>
                      <input type="date" className={styles.formInput} />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Upload Certificate</label>
                    <div className={styles.uploadArea}>
                      <FaUpload className={styles.uploadIcon} />
                      <p className={styles.uploadText}>Click to upload or drag and drop</p>
                      <p className={styles.uploadSubtext}>PDF, PNG, JPG up to 10MB</p>
                    </div>
                  </div>

                  <div className={styles.certActions}>
                    <button className={styles.addCertBtn}>
                      <FaPlus /> Add Certification
                    </button>
                    <button className={styles.cancelBtn}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Profile & Settings</h2>
            <div className={styles.placeholderText}>
              <p>Manage your profile and account settings.</p>
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
