'use client';

import { useState, useEffect } from 'react';
import { FaUser, FaCog } from 'react-icons/fa';
import { updateClientProfile } from '@/services/auth';
import styles from '@/styles/Clients/Dashboard.module.scss';

interface ProfileProps {
  activeSubmenu: string;
}

export default function Profile({ activeSubmenu }: ProfileProps) {
  const [userData, setUserData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUserData(JSON.parse(user));
    }
  }, []);

  // Show loading state until userData is loaded
  if (!userData) {
    return <div className={styles.profileContent}>Loading...</div>;
  }

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Collect profile data from inputs
      const profileData = {
        firstName: (document.querySelector('[name="firstName"]') as HTMLInputElement)?.value,
        lastName: (document.querySelector('[name="lastName"]') as HTMLInputElement)?.value,
        phoneNumber: (document.querySelector('[name="phoneNumber"]') as HTMLInputElement)?.value,
        dateOfBirth: (document.querySelector('[name="dateOfBirth"]') as HTMLInputElement)?.value,
        gender: (document.querySelector('[name="gender"]') as HTMLSelectElement)?.value,
        pronoun: (document.querySelector('[name="pronoun"]') as HTMLInputElement)?.value,
        emergencyContactName: (document.querySelector('[name="emergencyContactName"]') as HTMLInputElement)?.value,
        emergencyContactPhone: (document.querySelector('[name="emergencyContactPhone"]') as HTMLInputElement)?.value,
        emergencyContactRelationship: (document.querySelector('[name="emergencyContactRelationship"]') as HTMLSelectElement)?.value,
        otherGoals: (document.querySelector('[name="otherGoals"]') as HTMLTextAreaElement)?.value,
        address: (document.querySelector('[name="address"]') as HTMLInputElement)?.value,
        city: (document.querySelector('[name="city"]') as HTMLInputElement)?.value,
        state: (document.querySelector('[name="state"]') as HTMLInputElement)?.value,
        zipCode: (document.querySelector('[name="zipCode"]') as HTMLInputElement)?.value,
        country: (document.querySelector('[name="country"]') as HTMLInputElement)?.value,
        sessionLength: (document.querySelector('[name="sessionLength"]') as HTMLSelectElement)?.value,
        frequency: (document.querySelector('[name="frequency"]') as HTMLSelectElement)?.value,
        budget: (document.querySelector('[name="budget"]') as HTMLSelectElement)?.value,
        locationPreference: (document.querySelector('[name="locationPreference"]') as HTMLSelectElement)?.value,
        timePreference: (document.querySelector('[name="timePreference"]') as HTMLSelectElement)?.value,
        specialRequirements: (document.querySelector('[name="specialRequirements"]') as HTMLInputElement)?.value,
        travelWillingness: (document.querySelector('[name="travelWillingness"]') as HTMLInputElement)?.checked,
        maxTravelDistance: (document.querySelector('[name="maxTravelDistance"]') as HTMLSelectElement)?.value,
      };

      const result = await updateClientProfile(profileData);
      setSaveMessage('Profile updated successfully!');
      
      // Update local storage with data from server response
      if (userData && result && result.profile) {
        const updatedUser = {
          ...userData,
          profile: result.profile  // Use the complete profile from server response
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
      }
      
      // Dispatch custom event to notify dashboard of profile update
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (error: any) {
      setSaveMessage(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };
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
                    <input 
                      type="text" 
                      name="firstName"
                      className={styles.formInput} 
                      defaultValue={userData?.profile?.first_name || ''} 
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      className={styles.formInput} 
                      defaultValue={userData?.profile?.last_name || ''} 
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email</label>
                    <input 
                      type="email" 
                      className={styles.formInput} 
                      defaultValue={userData?.email || ''} 
                      disabled
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone</label>
                    <input 
                      type="tel" 
                      name="phoneNumber"
                      className={styles.formInput} 
                      defaultValue={userData?.profile?.phone_number || ''} 
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Date of Birth</label>
                    <input 
                      type="date" 
                      name="dateOfBirth"
                      className={styles.formInput}
                      defaultValue={userData?.profile?.date_of_birth ? userData.profile.date_of_birth.split('T')[0] : ''}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Gender</label>
                    <select name="gender" className={styles.formSelect} defaultValue={userData?.profile?.gender || ''}>
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Pronoun</label>
                    <input 
                      type="text" 
                      name="pronoun"
                      className={styles.formInput} 
                      defaultValue={userData?.profile?.pronoun || ''}
                      placeholder="e.g., they/them"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    {/* Empty div to maintain grid layout */}
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Emergency Contact</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Emergency Contact Name</label>
                    <input 
                      type="text" 
                      name="emergencyContactName"
                      className={styles.formInput} 
                      defaultValue={userData?.profile?.emergency_contact_name || ''}
                      placeholder="Enter emergency contact name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Emergency Contact Phone</label>
                    <input 
                      type="tel" 
                      name="emergencyContactPhone"
                      className={styles.formInput} 
                      defaultValue={userData?.profile?.emergency_contact_phone || ''}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Relationship</label>
                  <select name="emergencyContactRelationship" className={styles.formSelect} defaultValue={userData?.profile?.emergency_contact_relationship || ''}>
                    <option value="">Select relationship</option>
                    <option value="spouse">Spouse</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {saveMessage && (
                <div style={{ 
                  padding: '12px 24px', 
                  margin: '16px 0',
                  backgroundColor: saveMessage.includes('Error') ? '#fee' : '#efe',
                  border: `1px solid ${saveMessage.includes('Error') ? '#fcc' : '#cfc'}`,
                  borderRadius: '8px',
                  color: saveMessage.includes('Error') ? '#c33' : '#3c3'
                }}>
                  {saveMessage}
                </div>
              )}
              
              <div className={styles.formActions}>
                <button 
                  className={styles.saveBtn}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
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
                <h3 className={styles.formSectionTitle}>Wellness Goals</h3>
                <div className={styles.checkboxGroup}>
                  {['stress-relief', 'pain-management', 'flexibility', 'strength-building', 'mental-health', 'recovery', 'prevention', 'relaxation', 'better-sleep', 'energy-boost'].map((goal) => (
                    <label key={goal} className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        defaultChecked={userData?.profile?.wellness_goals?.includes(goal.toLowerCase()) || false}
                      />
                      <span className={styles.checkboxText}>
                        {goal.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </label>
                  ))}
                </div>
                <div className={styles.formGroup} style={{ marginTop: '24px' }}>
                  <label className={styles.formLabel}>Other Goals (Optional)</label>
                  <textarea 
                    name="otherGoals"
                    className={styles.formTextarea} 
                    defaultValue={userData?.profile?.other_goals || ''}
                    placeholder="Tell us about any other wellness goals..."
                    rows={3}
                  />
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Services You Are Interested In</h3>
                <div className={styles.checkboxGroup}>
                  {['massage-therapy', 'yoga', 'meditation', 'acupuncture', 'chiropractic', 'physical-therapy', 'nutrition-counseling', 'counseling', 'personal-training', 'reiki'].map((service) => (
                    <label key={service} className={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        defaultChecked={userData?.profile?.preferred_services?.includes(service.toLowerCase()) || false}
                      />
                      <span className={styles.checkboxText}>
                        {service.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Session Preferences</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Preferred Session Length</label>
                    <select name="sessionLength" className={styles.formSelect} defaultValue={userData?.profile?.preferred_session_length || ''}>
                      <option value="">Select length</option>
                      <option value="30">30 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                      <option value="120">120 minutes</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>How Often</label>
                    <select name="frequency" className={styles.formSelect} defaultValue={userData?.profile?.preferred_frequency || ''}>
                      <option value="">Select frequency</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="as-needed">As needed</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Budget Per Session</label>
                    <select name="budget" className={styles.formSelect} defaultValue={userData?.profile?.budget_per_session || ''}>
                      <option value="">Select budget</option>
                      <option value="under-50">Under $50</option>
                      <option value="50-100">$50 - $100</option>
                      <option value="100-150">$100 - $150</option>
                      <option value="150-200">$150 - $200</option>
                      <option value="over-150">Over $200</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Location Preference</label>
                    <select name="locationPreference" className={styles.formSelect} defaultValue={userData?.profile?.location_preference || ''}>
                      <option value="">Select location</option>
                      <option value="at-home">At Home</option>
                      <option value="online">Online</option>
                      <option value="provider-location">Provider Location</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Time Preference</label>
                    <select name="timePreference" className={styles.formSelect} defaultValue={userData?.profile?.time_preference || ''}>
                      <option value="">Select time</option>
                      <option value="morning">Morning (6 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                      <option value="evening">Evening (6 PM - 10 PM)</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Special Requirements</label>
                    <input 
                      type="text" 
                      name="specialRequirements"
                      className={styles.formInput}
                      defaultValue={userData?.profile?.special_requirements || ''}
                      placeholder="Any special requirements or accommodations needed..."
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Address</h3>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Street Address</label>
                  <input 
                    type="text" 
                    name="address"
                    className={styles.formInput} 
                    defaultValue={userData?.profile?.address_line1 || ''}
                    placeholder="Enter your address" 
                  />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>City</label>
                    <input 
                      type="text" 
                      name="city"
                      className={styles.formInput} 
                      defaultValue={userData?.profile?.city || ''}
                      placeholder="City" 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>State</label>
                    <input 
                      type="text" 
                      name="state"
                      className={styles.formInput} 
                      defaultValue={userData?.profile?.state || ''}
                      placeholder="State" 
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>ZIP Code</label>
                    <input 
                      type="text" 
                      name="zipCode"
                      className={styles.formInput} 
                      defaultValue={userData?.profile?.zip_code || ''}
                      placeholder="ZIP"
                      onKeyDown={(e) => {
                        // Allow: backspace, delete, tab, escape, enter, and numbers
                        if (
                          [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
                          // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                          (e.keyCode === 65 && e.ctrlKey === true) ||
                          (e.keyCode === 67 && e.ctrlKey === true) ||
                          (e.keyCode === 86 && e.ctrlKey === true) ||
                          (e.keyCode === 88 && e.ctrlKey === true) ||
                          // Allow: home, end, left, right, down, up
                          (e.keyCode >= 35 && e.keyCode <= 40)
                        ) {
                          return;
                        }
                        // Ensure that it is a number and stop the keypress
                        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Country</label>
                    <input 
                      type="text" 
                      name="country"
                      className={styles.formInput} 
                      defaultValue={userData?.profile?.country || 'United States'} 
                      placeholder="Country" 
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Travel Preferences</h3>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      name="travelWillingness"
                      defaultChecked={userData?.profile?.travel_willingness || false}
                    />
                    <span className={styles.checkboxText}>I'm willing to travel for appointments</span>
                  </label>
                </div>
                <div className={styles.formGroup} style={{ marginTop: '24px' }}>
                  <label className={styles.formLabel}>Maximum Travel Distance</label>
                  <select name="maxTravelDistance" className={styles.formSelect} defaultValue={userData?.profile?.max_travel_distance || ''}>
                    <option value="">Select distance</option>
                    <option value="5">1-2 miles</option>
                    <option value="10">up to 5 miles</option>
                    <option value="15">up to 10 miles</option>
                    <option value="25">up to 25 miles</option>
                    <option value="50">up to 50 miles</option>
                    <option value="100">I'm flexible</option>
                  </select>
                </div>
              </div>

              {saveMessage && (
                <div style={{ 
                  padding: '12px 24px', 
                  margin: '16px 0',
                  backgroundColor: saveMessage.includes('Error') ? '#fee' : '#efe',
                  border: `1px solid ${saveMessage.includes('Error') ? '#fcc' : '#cfc'}`,
                  borderRadius: '8px',
                  color: saveMessage.includes('Error') ? '#c33' : '#3c3'
                }}>
                  {saveMessage}
                </div>
              )}

              <div className={styles.formActions}>
                <button 
                  className={styles.saveBtn}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.profileContent}>
            <h2 className={styles.sectionTitle}>Profile & Preferences</h2>
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
