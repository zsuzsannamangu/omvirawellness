'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from '@/styles/Spaces/Dashboard.module.scss';

interface ProfileProps {
  activeSubmenu: string;
}

export default function Profile({ activeSubmenu }: ProfileProps) {
  const params = useParams();
  const userId = params.userId as string;
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:4000/api/space-owners/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched profile data:', data);
        setProfileData(data);
      } else {
        console.error('Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profileData) return;

    setIsSaving(true);
    setSaveMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Collect profile data from form inputs
      const updateData: any = {};

      // Profile fields
      const businessNameEl = document.querySelector('[data-field="business_name"]') as HTMLInputElement;
      const contactNameEl = document.querySelector('[data-field="contact_name"]') as HTMLInputElement;
      const phoneNumberEl = document.querySelector('[data-field="phone_number"]') as HTMLInputElement;
      const bioEl = document.querySelector('[data-field="bio"]') as HTMLTextAreaElement;
      const addressLine1El = document.querySelector('[data-field="address_line1"]') as HTMLInputElement;
      const addressLine2El = document.querySelector('[data-field="address_line2"]') as HTMLInputElement;
      const cityEl = document.querySelector('[data-field="city"]') as HTMLInputElement;
      const stateEl = document.querySelector('[data-field="state"]') as HTMLInputElement;
      const zipCodeEl = document.querySelector('[data-field="zip_code"]') as HTMLInputElement;
      const countryEl = document.querySelector('[data-field="country"]') as HTMLInputElement;
      const profilePhotoUrlEl = document.querySelector('[data-field="profile_photo_url"]') as HTMLInputElement;

      // Always include fields if elements exist, even if empty
      if (businessNameEl) updateData.businessName = businessNameEl.value || '';
      if (contactNameEl) updateData.contactName = contactNameEl.value || '';
      if (phoneNumberEl) updateData.phoneNumber = phoneNumberEl.value || '';
      if (bioEl) updateData.bio = bioEl.value || '';
      if (addressLine1El) updateData.addressLine1 = addressLine1El.value || '';
      if (addressLine2El) updateData.addressLine2 = addressLine2El.value || '';
      if (cityEl) updateData.city = cityEl.value || '';
      if (stateEl) updateData.state = stateEl.value || '';
      if (zipCodeEl) updateData.zipCode = zipCodeEl.value || '';
      if (countryEl) updateData.country = countryEl.value || '';
      if (profilePhotoUrlEl) updateData.profilePhotoUrl = profilePhotoUrlEl.value || '';

      // Space fields
      const spaceNameEl = document.querySelector('[data-field="space_name"]') as HTMLInputElement;
      const spaceTypeEl = document.querySelector('[data-field="space_type"]') as HTMLInputElement;
      const descriptionEl = document.querySelector('[data-field="description"]') as HTMLTextAreaElement;
      const capacityEl = document.querySelector('[data-field="capacity"]') as HTMLInputElement;
      const squareFootageEl = document.querySelector('[data-field="square_footage"]') as HTMLInputElement;
      const hourlyRateEl = document.querySelector('[data-field="hourly_rate"]') as HTMLInputElement;
      const minimumBookingHoursEl = document.querySelector('[data-field="minimum_booking_hours"]') as HTMLInputElement;
      const cancellationPolicyEl = document.querySelector('[data-field="cancellation_policy"]') as HTMLTextAreaElement;

      if (spaceNameEl) updateData.spaceName = spaceNameEl.value || '';
      if (spaceTypeEl) updateData.spaceType = spaceTypeEl.value || '';
      if (descriptionEl) updateData.description = descriptionEl.value || '';
      if (capacityEl) updateData.capacity = capacityEl.value || '';
      if (squareFootageEl) updateData.squareFootage = squareFootageEl.value || '';
      if (hourlyRateEl) updateData.hourlyRate = hourlyRateEl.value || '';
      if (minimumBookingHoursEl) updateData.minimumBookingHours = minimumBookingHoursEl.value || '';
      if (cancellationPolicyEl) updateData.cancellationPolicy = cancellationPolicyEl.value || '';

      console.log('Saving profile data:', updateData);
      console.log('Phone number element:', phoneNumberEl, phoneNumberEl?.value);
      console.log('Space name element:', spaceNameEl, spaceNameEl?.value);

      // Send to backend
      const response = await fetch(`http://localhost:4000/api/space-owners/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      let result;
      try {
        result = await response.json();
      } catch (error) {
        const text = await response.text();
        console.error('Failed to parse JSON response:', text);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        console.error('Backend error response:', result);
        throw new Error(result.error || result.message || 'Failed to update profile');
      }

      console.log('Backend response:', result);
      
      // Refresh profile data
      await fetchProfileData();
      
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setSaveMessage(`Error: ${error.message || 'Failed to save changes'}`);
      setTimeout(() => setSaveMessage(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className={styles.placeholderText}><p>Loading...</p></div>;
    }

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
                    <input 
                      type="text" 
                      data-field="business_name"
                      className={styles.formInput} 
                      defaultValue={profileData?.business_name || ''}
                      placeholder="Enter business name" 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Contact Person</label>
                    <input 
                      type="text" 
                      data-field="contact_name"
                      className={styles.formInput} 
                      defaultValue={profileData?.contact_name || ''}
                      placeholder="Enter contact person name" 
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone Number</label>
                    <input 
                      type="tel" 
                      data-field="phone_number"
                      className={styles.formInput} 
                      defaultValue={profileData?.phone_number || ''}
                      placeholder="Enter phone number" 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Email Address</label>
                    <input 
                      type="email" 
                      className={styles.formInput} 
                      defaultValue={profileData?.email || ''}
                      placeholder="Enter email" 
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Space Type</h3>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Space Name</label>
                  <input 
                    type="text" 
                    data-field="space_name"
                    className={styles.formInput} 
                    defaultValue={profileData?.space?.space_name || ''}
                    placeholder="Enter space name" 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Renting What</label>
                  <input 
                    type="text" 
                    data-field="space_type"
                    className={styles.formInput} 
                    defaultValue={profileData?.space?.space_type || ''}
                    placeholder="e.g., Yoga Studio, Massage Room" 
                  />
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Address</h3>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Street Address</label>
                  <input 
                    type="text" 
                    data-field="address_line1"
                    className={styles.formInput} 
                    defaultValue={profileData?.space?.address_line1 || profileData?.address_line1 || ''}
                    placeholder="Enter street address" 
                  />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>City</label>
                    <input 
                      type="text" 
                      data-field="city"
                      className={styles.formInput} 
                      defaultValue={profileData?.space?.city || profileData?.city || ''}
                      placeholder="Enter city" 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>State</label>
                    <input 
                      type="text" 
                      data-field="state"
                      className={styles.formInput} 
                      defaultValue={profileData?.space?.state || profileData?.state || ''}
                      placeholder="State" 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>ZIP Code</label>
                    <input 
                      type="text" 
                      data-field="zip_code"
                      className={styles.formInput} 
                      defaultValue={profileData?.space?.zip_code || profileData?.zip_code || ''}
                      placeholder="ZIP" 
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Space Details</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Capacity</label>
                    <input 
                      type="number" 
                      data-field="capacity"
                      className={styles.formInput} 
                      defaultValue={profileData?.space?.capacity || ''}
                      placeholder="Max capacity" 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Square Footage</label>
                    <input 
                      type="number" 
                      data-field="square_footage"
                      className={styles.formInput} 
                      defaultValue={profileData?.space?.square_footage || ''}
                      placeholder="Square footage" 
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea 
                    data-field="description"
                    className={styles.formTextarea} 
                    rows={4} 
                    defaultValue={profileData?.space?.description || ''}
                    placeholder="Describe your space..."
                  ></textarea>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Pricing</h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Hourly Rate</label>
                    <input 
                      type="number" 
                      data-field="hourly_rate"
                      className={styles.formInput} 
                      defaultValue={profileData?.space?.hourly_rate || ''}
                      placeholder="$ per hour" 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Minimum Booking (hours)</label>
                    <input 
                      type="number" 
                      data-field="minimum_booking_hours"
                      className={styles.formInput} 
                      defaultValue={profileData?.space?.minimum_booking_hours || 1}
                      placeholder="Minimum hours" 
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Policies</h3>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Cancellation Policy</label>
                  <textarea 
                    className={styles.formTextarea} 
                    rows={3} 
                    defaultValue={profileData?.space?.cancellation_policy || ''}
                    placeholder="Describe your cancellation policy..."
                  ></textarea>
                </div>
              </div>

              {profileData?.space?.amenities && profileData.space.amenities.length > 0 && (
                <div className={styles.formSection}>
                  <h3 className={styles.formSectionTitle}>Amenities</h3>
                  <div className={styles.amenitiesList}>
                    {profileData.space.amenities.map((amenity: string, index: number) => (
                      <span key={index} className={styles.amenityTag}>{amenity}</span>
                    ))}
                  </div>
                </div>
              )}

              {profileData?.space?.availability && profileData.space.availability.length > 0 && (
                <div className={styles.formSection}>
                  <h3 className={styles.formSectionTitle}>Availability</h3>
                  <div className={styles.availabilityList}>
                    {profileData.space.availability.map((slot: any, index: number) => (
                      <div key={index} className={styles.availabilityItem}>
                        <strong>{slot.day_of_week}:</strong> {slot.start_time} - {slot.end_time}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {saveMessage && (
                <div className={`${styles.saveMessage} ${saveMessage.includes('Error') ? styles.saveMessageError : styles.saveMessageSuccess}`}>
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
                <button 
                  className={styles.cancelBtn}
                  onClick={() => {
                    setSaveMessage('');
                    fetchProfileData(); // Reload to reset form
                  }}
                >
                  Cancel
                </button>
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
                  <select className={styles.formSelect}>
                    <option value="">Select cancellation policy</option>
                    <option value="1">1 hour before</option>
                    <option value="24">24 hours before</option>
                    <option value="48">48 hours before</option>
                    <option value="72">72 hours before</option>
                    <option value="7">7 days before</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Refund Policy</label>
                  <select className={styles.formSelect}>
                    <option value="">Select refund policy</option>
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
                    <input type="checkbox" />
                    <span className={styles.checkboxText}>No smoking</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" />
                    <span className={styles.checkboxText}>No pets allowed</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" />
                    <span className={styles.checkboxText}>No outside food/drinks</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" />
                    <span className={styles.checkboxText}>Clean up after use</span>
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" />
                    <span className={styles.checkboxText}>Respect quiet hours</span>
                  </label>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Rental Terms</h3>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Minimum Rental Duration</label>
                  <select className={styles.formSelect}>
                    <option value="">Select minimum duration</option>
                    <option value="0.5">30 minutes</option>
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="4">4 hours</option>
                    <option value="8">8 hours</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Maximum Rental Duration</label>
                  <select className={styles.formSelect}>
                    <option value="">Select maximum duration</option>
                    <option value="4">4 hours</option>
                    <option value="8">8 hours</option>
                    <option value="12">12 hours</option>
                    <option value="24">24 hours</option>
                    <option value="unlimited">Unlimited</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Advance Booking Required</label>
                  <select className={styles.formSelect}>
                    <option value="">Select advance booking time</option>
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
                  <textarea className={styles.formTextarea} rows={3} placeholder="Provide entry instructions for renters..."></textarea>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Parking Information</label>
                  <textarea className={styles.formTextarea} rows={2} placeholder="Provide parking information..."></textarea>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Emergency Contact</label>
                  <input type="text" className={styles.formInput} placeholder="Enter emergency contact" />
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Check-in/Check-out</h3>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Check-in Instructions</label>
                  <textarea className={styles.formTextarea} rows={3} placeholder="Provide check-in instructions..."></textarea>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Check-out Instructions</label>
                  <textarea className={styles.formTextarea} rows={3} placeholder="Provide check-out instructions..."></textarea>
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
            <h2 className={styles.sectionTitle}>Profile & Settings</h2>
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
