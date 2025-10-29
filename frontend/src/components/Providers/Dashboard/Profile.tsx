'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaClock, FaDollarSign, FaCheckCircle, FaStar, FaTimes, FaVideo, FaMapMarkerAlt, FaHome } from 'react-icons/fa';
import styles from '@/styles/Providers/Dashboard.module.scss';
import AvailabilityManager from './AvailabilityManager';

interface ProfileProps {
  activeSubmenu: string;
}

export default function Profile({ activeSubmenu }: ProfileProps) {
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<Array<{ name: string; email: string; role: string }>>([]);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherLanguage, setOtherLanguage] = useState('');
  const [showAddTeamMember, setShowAddTeamMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [travelFeeType, setTravelFeeType] = useState<'free' | 'fee'>('free');
  const [travelFee, setTravelFee] = useState('');
  const [services, setServices] = useState<Array<{ name: string; type: string; duration: string; price: string; description?: string; mobileService?: boolean; id?: number }>>([]);
  const [showAddService, setShowAddService] = useState(false);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(null);
  const [newService, setNewService] = useState({ name: '', type: '', duration: '60', price: '', description: '', mobileService: false });
  const [addOns, setAddOns] = useState<Array<{ id?: number; name: string; description: string; price: string }>>([]);
  const [showAddOnModal, setShowAddOnModal] = useState(false);
  const [editingAddOnIndex, setEditingAddOnIndex] = useState<number | null>(null);
  const [newAddOn, setNewAddOn] = useState({ name: '', description: '', price: '' });
  const [certifications, setCertifications] = useState<Array<{ id?: number; name: string; issuer: string; issueDate: string; expirationDate: string; licenseNumber?: string }>>([]);
  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [editingCertificationIndex, setEditingCertificationIndex] = useState<number | null>(null);
  const [newCertification, setNewCertification] = useState({ name: '', issuer: '', issueDate: '', expirationDate: '', licenseNumber: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) return;
      
      let parsed = JSON.parse(user);
      
      // Fetch fresh data from backend to ensure we have latest
      const response = await fetch(`http://localhost:4000/api/providers/${parsed.id}`);
      if (response.ok) {
        const providerData = await response.json();
        
        // Transform the provider data to match our user profile structure
        const updatedUser = {
          ...parsed,
          profile: {
            ...parsed.profile,
            business_name: providerData.business_name,
            contact_name: providerData.contact_name,
            phone_number: providerData.phone_number,
            business_type: providerData.business_type,
            bio: providerData.bio,
            specialties: providerData.specialties,
            credentials: typeof providerData.credentials === 'string' ? JSON.parse(providerData.credentials) : (providerData.credentials || []),
            years_experience: providerData.years_experience,
            address_line1: providerData.address_line1,
            city: providerData.city,
            state: providerData.state,
            zip_code: providerData.zip_code,
            country: providerData.country,
            work_location: typeof providerData.work_location === 'string' ? JSON.parse(providerData.work_location) : (providerData.work_location || []),
            services: typeof providerData.services === 'string' ? JSON.parse(providerData.services) : (providerData.services || []),
            add_ons: typeof providerData.add_ons === 'string' ? JSON.parse(providerData.add_ons) : (providerData.add_ons || providerData.addOns || []),
            certifications: typeof providerData.certifications === 'string' ? JSON.parse(providerData.certifications) : (providerData.certifications || []),
            travel_policy: providerData.travel_policy,
            travel_fee: providerData.travel_fee,
            max_distance: providerData.max_distance,
            team_members: typeof providerData.team_members === 'string' ? JSON.parse(providerData.team_members) : (providerData.team_members || []),
            profile_photo_url: providerData.profile_photo_url,
          }
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        parsed = updatedUser; // Update for state initialization below
      }
      
      // Initialize state from parsed data (either from API or localStorage)
      // Load languages from credentials if available
      if (parsed.profile?.credentials && Array.isArray(parsed.profile.credentials)) {
        setSelectedLanguages(parsed.profile.credentials);
      }
      
      // Load services if available
      if (parsed.profile?.services && Array.isArray(parsed.profile.services)) {
        setServices(parsed.profile.services);
      }
      
      // Load add-ons if available
      if (parsed.profile?.add_ons && Array.isArray(parsed.profile.add_ons)) {
        setAddOns(parsed.profile.add_ons);
      } else if (parsed.profile?.addOns && Array.isArray(parsed.profile.addOns)) {
        setAddOns(parsed.profile.addOns);
      }
      
      // Load certifications if available
      if (parsed.profile?.certifications && Array.isArray(parsed.profile.certifications)) {
        setCertifications(parsed.profile.certifications);
      }
      
      // Load team members if available
      if (parsed.profile?.team_members && Array.isArray(parsed.profile.team_members)) {
        setTeamMembers(parsed.profile.team_members);
      }
      
      // Load travel fee type
      if (parsed.profile?.travel_fee !== undefined && parsed.profile.travel_fee !== null && parseFloat(parsed.profile.travel_fee) > 0) {
        setTravelFeeType('fee');
        setTravelFee(parsed.profile.travel_fee.toString());
      }
      
      // Load selected wellness practices (stored as comma-separated string)
      if (parsed.profile?.business_type) {
        const arr = String(parsed.profile.business_type)
          .split(',')
          .map(s => s.trim().toLowerCase())
          .filter(Boolean);
        setSelectedPractices(arr);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to localStorage
      const user = localStorage.getItem('user');
      if (user) {
        const parsed = JSON.parse(user);
        setUserData(parsed);
        
        // Initialize state from localStorage
        if (parsed.profile?.credentials && Array.isArray(parsed.profile.credentials)) {
          setSelectedLanguages(parsed.profile.credentials);
        }
        if (parsed.profile?.services && Array.isArray(parsed.profile.services)) {
          setServices(parsed.profile.services);
        }
        if (parsed.profile?.team_members && Array.isArray(parsed.profile.team_members)) {
          setTeamMembers(parsed.profile.team_members);
        }
        if (parsed.profile?.travel_fee !== undefined && parsed.profile.travel_fee !== null && parseFloat(parsed.profile.travel_fee) > 0) {
          setTravelFeeType('fee');
          setTravelFee(parsed.profile.travel_fee.toString());
        }
        if (parsed.profile?.business_type) {
          const arr = String(parsed.profile.business_type)
            .split(',')
            .map((s: string) => s.trim().toLowerCase())
            .filter(Boolean);
          setSelectedPractices(arr);
        }
      }
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleSave = async () => {
    if (!userData) return;

    setIsSaving(true);
    setSaveMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Only collect fields that are visible on the current submenu
      const profileData: any = {};

      if (activeSubmenu === 'basic') {
        // Basic Information fields
        const businessNameEl = document.querySelector('[data-field="business_name"]') as HTMLInputElement;
        const contactNameEl = document.querySelector('[data-field="contact_name"]') as HTMLInputElement;
        const phoneNumberEl = document.querySelector('[data-field="phone_number"]') as HTMLInputElement;
        const addressLine1El = document.querySelector('[data-field="address_line1"]') as HTMLInputElement;
        const cityEl = document.querySelector('[data-field="city"]') as HTMLInputElement;
        const stateEl = document.querySelector('[data-field="state"]') as HTMLInputElement;
        const zipCodeEl = document.querySelector('[data-field="zip_code"]') as HTMLInputElement;
        const bioEl = document.querySelector('[data-field="bio"]') as HTMLTextAreaElement;
        const specialtiesEl = document.querySelector('[data-field="specialties"]') as HTMLTextAreaElement;
        const yearsExperienceEl = document.querySelector('[data-field="years_experience"]') as HTMLSelectElement;

        if (businessNameEl) profileData.business_name = businessNameEl.value;
        if (contactNameEl) profileData.contact_name = contactNameEl.value;
        if (phoneNumberEl) profileData.phone_number = phoneNumberEl.value;
        if (selectedPractices && selectedPractices.length > 0) {
          profileData.business_type = selectedPractices.join(',');
        }
        if (addressLine1El) profileData.address_line1 = addressLine1El.value;
        if (cityEl) profileData.city = cityEl.value;
        if (stateEl) profileData.state = stateEl.value;
        if (zipCodeEl) profileData.zip_code = zipCodeEl.value;
        if (bioEl) profileData.bio = bioEl.value;
        if (specialtiesEl) profileData.specialties = specialtiesEl.value;
        if (yearsExperienceEl && yearsExperienceEl.value) profileData.years_experience = yearsExperienceEl.value;
        
        // Always include languages and team members from state
        profileData.credentials = selectedLanguages;
        profileData.team_members = teamMembers;
      } else if (activeSubmenu === 'preferences') {
        // Preferences fields
        const travelPolicyEl = document.querySelector('[data-field="travel_policy"]') as HTMLTextAreaElement;
        const maxDistanceEl = document.querySelector('[data-field="max_distance"]') as HTMLSelectElement;

        // Collect work locations (checkboxes)
        const workLocationElements = document.querySelectorAll(`[data-field="work_location"]:checked`) as NodeListOf<HTMLInputElement>;
        const workLocation = Array.from(workLocationElements).map(el => el.value);

        if (travelPolicyEl !== null) profileData.travel_policy = travelPolicyEl.value;
        profileData.work_location = workLocation;
        profileData.travel_fee = travelFeeType === 'fee' && travelFee ? parseFloat(travelFee) : (travelFeeType === 'free' ? 0 : null);
        if (maxDistanceEl && maxDistanceEl.value) profileData.max_distance = parseInt(maxDistanceEl.value);
      } else if (activeSubmenu === 'services') {
        // Services fields
        profileData.services = services;
        profileData.add_ons = addOns;
      } else if (activeSubmenu === 'certifications') {
        // Certifications fields
        profileData.certifications = certifications;
      }
      
      console.log('Sending profile data to backend:', profileData);

      // Send to backend
      const response = await fetch('http://localhost:4000/api/auth/profile/provider', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      let result;
      try {
        result = await response.json();
      } catch (error) {
        const text = await response.text();
        console.error('Failed to parse JSON response:', text);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (!response.ok || !result.success) {
        console.error('Backend error response:', result);
        throw new Error(result.message || result.error || 'Failed to update profile');
      }

      console.log('Backend response:', result);
      
      if (result.profile) {
        // Parse JSONB fields if they're strings
        const updatedProfile = { ...result.profile };
        
        if (typeof updatedProfile.work_location === 'string') {
          try {
            updatedProfile.work_location = JSON.parse(updatedProfile.work_location);
          } catch (e) {
            updatedProfile.work_location = [];
          }
        }
        
        if (typeof updatedProfile.services === 'string') {
          try {
            updatedProfile.services = JSON.parse(updatedProfile.services);
          } catch (e) {
            updatedProfile.services = [];
          }
        }
        
        if (typeof updatedProfile.add_ons === 'string') {
          try {
            updatedProfile.add_ons = JSON.parse(updatedProfile.add_ons);
          } catch (e) {
            updatedProfile.add_ons = [];
          }
        }
        
        if (typeof updatedProfile.certifications === 'string') {
          try {
            updatedProfile.certifications = JSON.parse(updatedProfile.certifications);
          } catch (e) {
            updatedProfile.certifications = [];
          }
        }
        
        if (typeof updatedProfile.team_members === 'string') {
          try {
            updatedProfile.team_members = JSON.parse(updatedProfile.team_members);
          } catch (e) {
            updatedProfile.team_members = [];
          }
        }
        
        if (!Array.isArray(updatedProfile.credentials)) {
          updatedProfile.credentials = [];
        }

        const updatedUser = {
          ...userData,
          profile: {
            ...userData.profile,
            ...updatedProfile
          }
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        
        // Dispatch event to notify dashboard of profile update
        window.dispatchEvent(new Event('profileUpdated'));
        
        // Also update local state for services, add-ons, certifications, languages, team members
        if (updatedProfile.services) {
          setServices(updatedProfile.services);
        }
        if (updatedProfile.add_ons) {
          setAddOns(updatedProfile.add_ons);
        }
        if (updatedProfile.certifications) {
          setCertifications(updatedProfile.certifications);
        }
        if (updatedProfile.credentials) {
          setSelectedLanguages(updatedProfile.credentials);
        }
        if (updatedProfile.team_members) {
          setTeamMembers(updatedProfile.team_members);
        }
        if (updatedProfile.travel_fee !== undefined) {
          if (updatedProfile.travel_fee > 0) {
            setTravelFeeType('fee');
            setTravelFee(updatedProfile.travel_fee.toString());
          } else {
            setTravelFeeType('free');
            setTravelFee('');
          }
        }
        if (updatedProfile.business_type) {
          const arr = String(updatedProfile.business_type)
            .split(',')
            .map((s: string) => s.trim().toLowerCase())
            .filter(Boolean);
          setSelectedPractices(arr);
        }
      }
      
      // Reload fresh data from backend to ensure everything is synced
      await loadUserData();

      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setSaveMessage(`Error: ${error.message || 'Failed to update profile'}`);
      setTimeout(() => setSaveMessage(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    switch (activeSubmenu) {
      case 'services':
        return (
          <div className={styles.dashboardSection}>
              <div className={styles.servicesHeader}>
              <h2 className={styles.sectionTitle}>Services</h2>
                <button 
                  className={styles.addServiceBtn}
                onClick={() => setShowAddService(true)}
                >
                + Add Service
                </button>
              </div>

            {services.length > 0 && (
              <div className={styles.servicesList}>
                {services.map((service, index) => {
                  // Format duration for display
                  const formatDuration = (dur: string) => {
                    const minutes = parseInt(dur);
                    if (minutes === 30) return '30 min';
                    if (minutes === 45) return '45 min';
                    if (minutes === 60) return '1 hour';
                    if (minutes === 75) return '1.25 hours';
                    if (minutes === 90) return '1.5 hours';
                    if (minutes === 120) return '2 hours';
                    return `${minutes} min`;
                  };
                  
                  return (
                  <div key={index} className={styles.serviceCard}>
                    <div className={styles.serviceCardInfo}>
                      <h4 className={styles.serviceCardName}>{service.name}</h4>
                      <p className={styles.serviceCardDetails}>{service.type} • {formatDuration(service.duration)} • ${service.price}</p>
                      {service.description && (
                        <p className={styles.serviceCardDetails} style={{ marginTop: '4px', color: '#666', fontStyle: 'italic' }}>
                          {service.description}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                        className={styles.editServiceBtn}
                      onClick={() => {
                          setEditingServiceIndex(index);
                          setNewService({
                            name: service.name || '',
                            type: service.type || '',
                            duration: service.duration || '60',
                            price: service.price || '',
                            description: service.description || '',
                            mobileService: service.mobileService || false
                          });
                          setShowAddService(true);
                        }}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: '#6C4F70', 
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: '500'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.removeServiceBtn}
                        onClick={async () => {
                          const updatedServices = services.filter((_, i) => i !== index);
                          setServices(updatedServices);
                          
                          // Save to database immediately
                          setIsSaving(true);
                          
                          try {
                            const token = localStorage.getItem('token');
                            if (!token) {
                              throw new Error('No authentication token found');
                            }

                            const profileData: any = {
                              services: updatedServices
                            };

                            const response = await fetch('http://localhost:4000/api/auth/profile/provider', {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify(profileData)
                            });

                            let result;
                            try {
                              result = await response.json();
                            } catch (error) {
                              const text = await response.text();
                              console.error('Failed to parse JSON response:', text);
                              throw new Error(`Server error: ${response.status} ${response.statusText}`);
                            }

                            if (!response.ok || !result.success) {
                              console.error('Backend error response:', result);
                              throw new Error(result.message || result.error || 'Failed to update profile');
                            }

                            // Update localStorage
                            if (result.profile) {
                              const updatedProfile = { ...result.profile };
                              
                              if (typeof updatedProfile.services === 'string') {
                                try {
                                  updatedProfile.services = JSON.parse(updatedProfile.services);
                                } catch (e) {
                                  updatedProfile.services = [];
                                }
                              }

                              const updatedUser = {
                                ...userData,
                                profile: {
                                  ...userData.profile,
                                  services: updatedProfile.services
                                }
                              };
                              localStorage.setItem('user', JSON.stringify(updatedUser));
                              setUserData(updatedUser);
                              setServices(updatedProfile.services);
                              
                              window.dispatchEvent(new Event('profileUpdated'));
                            }
                          } catch (error: any) {
                            console.error('Error deleting service:', error);
                            // Revert state change on error
                            setServices(services);
                            alert(`Error: ${error.message || 'Failed to delete service'}`);
                          } finally {
                            setIsSaving(false);
                          }
                        }}
                      >
                        ×
                      </button>
                  </div>
                </div>
                  );
                })}
              </div>
            )}

            {showAddService && (
              <div className={styles.addServiceModal}>
                <h3 className={styles.modalTitle}>{editingServiceIndex !== null ? 'Edit Service' : 'Add New Service'}</h3>
                <div className={styles.modalForm}>
                  <div className={styles.modalFormGroup}>
                    <label className={styles.modalLabel}>SERVICE NAME</label>
                    <input
                      type="text"
                      className={styles.modalInput}
                      placeholder="e.g., Deep Tissue Massage"
                      maxLength={50}
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#999', textAlign: 'right' }}>{newService.name.length}/50</span>
                    </div>
                  <div className={styles.modalFormGroup}>
                    <label className={styles.modalLabel}>SERVICE TYPE</label>
                    <select
                      className={styles.modalInput}
                      value={newService.type}
                      onChange={(e) => setNewService({ ...newService, type: e.target.value })}
                    >
                      <option value="">Select type</option>
                      <option value="Massage Therapy">Massage Therapy</option>
                      <option value="Yoga Instruction">Yoga Instruction</option>
                      <option value="Aesthetics & Skincare">Aesthetics & Skincare</option>
                      <option value="Reiki & Energy Work">Reiki & Energy Work</option>
                      <option value="Nutrition Counseling">Nutrition Counseling</option>
                      <option value="Life Coaching">Life Coaching</option>
                      <option value="Meditation Instruction">Meditation Instruction</option>
                      <option value="Physical Therapy">Physical Therapy</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className={styles.modalFormGroup} style={{ flex: 1 }}>
                      <label className={styles.modalLabel}>DURATION</label>
                      <select
                        className={styles.modalInput}
                        value={newService.duration}
                        onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                      >
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">1 hour</option>
                        <option value="75">1.25 hours</option>
                        <option value="90">1.5 hours</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>
                    <div className={styles.modalFormGroup} style={{ flex: 1 }}>
                      <label className={styles.modalLabel}>PRICE</label>
                      <div className={styles.priceInput}>
                        <span className={styles.dollarSign}>$</span>
                        <input
                          type="text"
                          className={styles.formInput}
                          placeholder="0"
                          value={newService.price}
                          onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.modalFormGroup}>
                    <label className={styles.modalLabel}>DESCRIPTION</label>
                    <textarea
                      className={styles.modalInput}
                      placeholder="e.g., Personalized yoga session tailored to your needs and goals"
                      rows={3}
                      maxLength={200}
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#999', textAlign: 'right' }}>{newService.description.length}/200</span>
                  </div>
                  <div className={styles.modalFormGroup} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      id="mobileService"
                      checked={newService.mobileService}
                      onChange={(e) => setNewService({ ...newService, mobileService: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="mobileService" className={styles.modalLabel} style={{ margin: 0, cursor: 'pointer', fontWeight: 'normal' }}>
                      Mobile Service (I travel to clients)
                    </label>
                  </div>
                  <div className={styles.modalActions}>
                    <button 
                      type="button"
                      className={styles.modalCancelBtn}
                      onClick={() => {
                        setShowAddService(false);
                        setEditingServiceIndex(null);
                        setNewService({ name: '', type: '', duration: '60', price: '', description: '', mobileService: false });
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={styles.modalAddBtn}
                      disabled={!newService.name || !newService.type || !newService.price || isSaving}
                      onClick={async () => {
                        if (newService.name && newService.type && newService.price) {
                          // Calculate updated services array
                          let updatedServices;
                          if (editingServiceIndex !== null) {
                            // Update existing service
                            updatedServices = [...services];
                            updatedServices[editingServiceIndex] = { ...newService };
                          } else {
                            // Add new service
                            updatedServices = [...services, { ...newService, id: Date.now() }];
                          }
                          
                          // Save to database immediately
                          setIsSaving(true);
                          setSaveMessage('');
                          
                          try {
                            const token = localStorage.getItem('token');
                            if (!token) {
                              throw new Error('No authentication token found');
                            }

                            const profileData: any = {
                              services: updatedServices
                            };
                            
                            // Update local state
                            setServices(updatedServices);

                            const response = await fetch('http://localhost:4000/api/auth/profile/provider', {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify(profileData)
                            });

                            let result;
                            try {
                              result = await response.json();
                            } catch (error) {
                              const text = await response.text();
                              console.error('Failed to parse JSON response:', text);
                              throw new Error(`Server error: ${response.status} ${response.statusText}`);
                            }

                            if (!response.ok || !result.success) {
                              console.error('Backend error response:', result);
                              throw new Error(result.message || result.error || 'Failed to update profile');
                            }

                            // Update localStorage and reload data
                            if (result.profile) {
                              const updatedProfile = { ...result.profile };
                              
                              // Parse JSONB fields
                              if (typeof updatedProfile.services === 'string') {
                                try {
                                  updatedProfile.services = JSON.parse(updatedProfile.services);
                                } catch (e) {
                                  updatedProfile.services = [];
                                }
                              }

                              const updatedUser = {
                                ...userData,
                                profile: {
                                  ...userData.profile,
                                  services: updatedProfile.services
                                }
                              };
                              localStorage.setItem('user', JSON.stringify(updatedUser));
                              setUserData(updatedUser);
                              setServices(updatedProfile.services);
                              
                              // Dispatch event to notify dashboard
                              window.dispatchEvent(new Event('profileUpdated'));
                            }

                            setSaveMessage('Service saved successfully!');
                            setTimeout(() => setSaveMessage(''), 3000);
                            
                            // Close modal and reset form
                            setShowAddService(false);
                            setEditingServiceIndex(null);
                            setNewService({ name: '', type: '', duration: '60', price: '', description: '', mobileService: false });
                          } catch (error: any) {
                            console.error('Error saving service:', error);
                            setSaveMessage(`Error: ${error.message || 'Failed to save service'}`);
                            setTimeout(() => setSaveMessage(''), 5000);
                          } finally {
                            setIsSaving(false);
                          }
                        }
                      }}
                    >
                      {isSaving ? 'Saving...' : (editingServiceIndex !== null ? 'Save Changes' : 'Add Service')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add-ons Section */}
            <div style={{ marginTop: '100px' }}>
              <div className={styles.servicesHeader}>
                <h2 className={styles.sectionTitle}>Add-ons</h2>
                <button 
                  className={styles.addServiceBtn}
                  onClick={() => setShowAddOnModal(true)}
                >
                  + Add Add-on Service
                </button>
                    </div>
              
              <p style={{ 
                fontSize: '0.9rem', 
                color: '#666', 
                marginTop: '12px', 
                marginBottom: '20px',
                lineHeight: '1.5'
              }}>
                Offer optional add-on services. Examples include yoga mat rental, 
                equipment packages, extended session time (+15 min.), or consultation services...
              </p>

              {addOns.length > 0 && (
                <div className={styles.servicesList}>
                  {addOns.map((addOn, index) => {
                    return (
                      <div key={index} className={styles.serviceCard}>
                        <div className={styles.serviceCardInfo}>
                          <h4 className={styles.serviceCardName}>{addOn.name}</h4>
                          <p className={styles.serviceCardDetails}>
                            {addOn.description}
                          </p>
                          <p className={styles.serviceCardDetails} style={{ marginTop: '4px' }}>
                            ${addOn.price}
                          </p>
                  </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                            className={styles.editServiceBtn}
                      onClick={() => {
                              setEditingAddOnIndex(index);
                              setNewAddOn({
                                name: addOn.name || '',
                                description: addOn.description || '',
                                price: addOn.price || ''
                              });
                              setShowAddOnModal(true);
                            }}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: '#6C4F70', 
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontWeight: '500'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.removeServiceBtn}
                            onClick={async () => {
                              const updatedAddOns = addOns.filter((_, i) => i !== index);
                              setAddOns(updatedAddOns);
                              
                              // Save to database immediately
                              setIsSaving(true);
                              
                              try {
                                const token = localStorage.getItem('token');
                                if (!token) {
                                  throw new Error('No authentication token found');
                                }

                                const profileData: any = {
                                  add_ons: updatedAddOns
                                };

                                const response = await fetch('http://localhost:4000/api/auth/profile/provider', {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                  },
                                  body: JSON.stringify(profileData)
                                });

                                let result;
                                try {
                                  result = await response.json();
                                } catch (error) {
                                  const text = await response.text();
                                  console.error('Failed to parse JSON response:', text);
                                  throw new Error(`Server error: ${response.status} ${response.statusText}`);
                                }

                                if (!response.ok || !result.success) {
                                  console.error('Backend error response:', result);
                                  throw new Error(result.message || result.error || 'Failed to update profile');
                                }

                                // Update localStorage
                                if (result.profile) {
                                  const updatedProfile = { ...result.profile };
                                  
                                  if (typeof updatedProfile.add_ons === 'string') {
                                    try {
                                      updatedProfile.add_ons = JSON.parse(updatedProfile.add_ons);
                                    } catch (e) {
                                      updatedProfile.add_ons = [];
                                    }
                                  }

                                  const updatedUser = {
                                    ...userData,
                                    profile: {
                                      ...userData.profile,
                                      add_ons: updatedProfile.add_ons
                                    }
                                  };
                                  localStorage.setItem('user', JSON.stringify(updatedUser));
                                  setUserData(updatedUser);
                                  setAddOns(updatedProfile.add_ons);
                                  
                                  window.dispatchEvent(new Event('profileUpdated'));
                                }
                              } catch (error: any) {
                                console.error('Error deleting add-on:', error);
                                // Revert state change on error
                                setAddOns(addOns);
                                alert(`Error: ${error.message || 'Failed to delete add-on'}`);
                              } finally {
                                setIsSaving(false);
                              }
                            }}
                          >
                            ×
                          </button>
                  </div>
                </div>
                    );
                  })}
                </div>
              )}

              {showAddOnModal && (
                <div className={styles.addServiceModal}>
                  <h3 className={styles.modalTitle}>{editingAddOnIndex !== null ? 'Edit Add-on' : 'Add New Add-on'}</h3>
                  <div className={styles.modalForm}>
                    <div className={styles.modalFormGroup}>
                      <label className={styles.modalLabel}>ADD-ON NAME</label>
                      <input
                        type="text"
                        className={styles.modalInput}
                        placeholder="e.g., Yoga Mat Rental"
                        maxLength={50}
                        value={newAddOn.name}
                        onChange={(e) => setNewAddOn({ ...newAddOn, name: e.target.value })}
                      />
                      <span style={{ fontSize: '0.75rem', color: '#999', textAlign: 'right' }}>{newAddOn.name.length}/50</span>
                    </div>
                    
                    <div className={styles.modalFormGroup}>
                      <label className={styles.modalLabel}>DESCRIPTION</label>
                      <textarea
                        className={styles.modalInput}
                        placeholder="e.g., High-quality yoga mat provided for your session"
                        rows={3}
                        maxLength={200}
                        value={newAddOn.description}
                        onChange={(e) => setNewAddOn({ ...newAddOn, description: e.target.value })}
                      />
                      <span style={{ fontSize: '0.75rem', color: '#999', textAlign: 'right' }}>{newAddOn.description.length}/200</span>
                  </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div className={styles.modalFormGroup}>
                        <label className={styles.modalLabel}>PRICE</label>
                        <div className={styles.priceInput}>
                          <span className={styles.dollarSign}>$</span>
                          <input
                            type="text"
                            className={styles.formInput}
                            placeholder="0"
                            value={newAddOn.price}
                            onChange={(e) => setNewAddOn({ ...newAddOn, price: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.modalActions}>
                    <button 
                        type="button"
                        className={styles.modalCancelBtn}
                      onClick={() => {
                          setShowAddOnModal(false);
                          setEditingAddOnIndex(null);
                          setNewAddOn({ name: '', description: '', price: '' });
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className={styles.modalAddBtn}
                        disabled={!newAddOn.name || !newAddOn.description || !newAddOn.price || isSaving}
                        onClick={async () => {
                          if (newAddOn.name && newAddOn.description && newAddOn.price) {
                            // Calculate updated add-ons array
                            let updatedAddOns;
                            if (editingAddOnIndex !== null) {
                              // Update existing add-on
                              updatedAddOns = [...addOns];
                              updatedAddOns[editingAddOnIndex] = { ...newAddOn, id: addOns[editingAddOnIndex].id || Date.now() };
                            } else {
                              // Add new add-on
                              updatedAddOns = [...addOns, { ...newAddOn, id: Date.now() }];
                            }
                            
                            // Save to database immediately
                            setIsSaving(true);
                            setSaveMessage('');
                            
                            try {
                              const token = localStorage.getItem('token');
                              if (!token) {
                                throw new Error('No authentication token found');
                              }

                              const profileData: any = {
                                add_ons: updatedAddOns
                              };
                              
                              // Update local state
                              setAddOns(updatedAddOns);

                              const response = await fetch('http://localhost:4000/api/auth/profile/provider', {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify(profileData)
                              });

                              let result;
                              try {
                                result = await response.json();
                              } catch (error) {
                                const text = await response.text();
                                console.error('Failed to parse JSON response:', text);
                                throw new Error(`Server error: ${response.status} ${response.statusText}`);
                              }

                              if (!response.ok || !result.success) {
                                console.error('Backend error response:', result);
                                throw new Error(result.message || result.error || 'Failed to update profile');
                              }

                              // Update localStorage and reload data
                              if (result.profile) {
                                const updatedProfile = { ...result.profile };
                                
                                // Parse JSONB fields
                                if (typeof updatedProfile.add_ons === 'string') {
                                  try {
                                    updatedProfile.add_ons = JSON.parse(updatedProfile.add_ons);
                                  } catch (e) {
                                    updatedProfile.add_ons = [];
                                  }
                                }

                                const updatedUser = {
                                  ...userData,
                                  profile: {
                                    ...userData.profile,
                                    add_ons: updatedProfile.add_ons
                                  }
                                };
                                localStorage.setItem('user', JSON.stringify(updatedUser));
                                setUserData(updatedUser);
                                setAddOns(updatedProfile.add_ons);
                                
                                // Dispatch event to notify dashboard
                                window.dispatchEvent(new Event('profileUpdated'));
                              }

                              setSaveMessage('Add-on saved successfully!');
                              setTimeout(() => setSaveMessage(''), 3000);
                              
                              // Close modal and reset form
                              setShowAddOnModal(false);
                              setEditingAddOnIndex(null);
                              setNewAddOn({ name: '', description: '', price: '' });
                            } catch (error: any) {
                              console.error('Error saving add-on:', error);
                              setSaveMessage(`Error: ${error.message || 'Failed to save add-on'}`);
                              setTimeout(() => setSaveMessage(''), 5000);
                            } finally {
                              setIsSaving(false);
                            }
                          }
                        }}
                      >
                        {isSaving ? 'Saving...' : (editingAddOnIndex !== null ? 'Save Changes' : 'Add Add-on')}
                      </button>
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        );
      
      case 'availability':
        return <AvailabilityManager />;

      case 'basic':
        if (!userData) {
          return <div className={styles.dashboardSection}>Loading...</div>;
        }

        const profileBasic = userData.profile || {};
        const credentialsBasic = profileBasic.credentials || [];
        
        // Create a key based on profile data to force remount when data changes
        const profileKey = `${profileBasic.contact_name || ''}-${profileBasic.business_name || ''}-${profileBasic.phone_number || ''}`;
        
        // Convert years_experience from integer back to string format
        let yearsExp = '';
        if (profileBasic.years_experience) {
          const yearsNum = parseInt(profileBasic.years_experience);
          if (yearsNum <= 1) yearsExp = '0-1';
          else if (yearsNum <= 5) yearsExp = '2-5';
          else if (yearsNum <= 10) yearsExp = '6-10';
          else if (yearsNum <= 15) yearsExp = '11-15';
          else yearsExp = '16+';
        }

        // Available wellness practices with mapping
        const wellnessPracticeMap: { [key: string]: string } = {
          'massage': 'Massage Therapy',
          'yoga': 'Yoga Instruction',
          'aesthetics': 'Aesthetics & Skincare',
          'reiki': 'Reiki & Energy Work',
          'doulas': 'Doula Services',
          'nutrition': 'Nutrition Counseling'
        };
        
        const wellnessPractices = [
          'Massage Therapy',
          'Yoga Instruction',
          'Aesthetics & Skincare',
          'Reiki & Energy Work',
          'Doula Services',
          'Nutrition Counseling',
          'Physical Therapy',
          'Mental Health Counseling',
          'Life Coaching',
          'Fitness Training',
          'Meditation Instruction',
          'Sound Healing',
          'Craniosacral Therapy',
          'Reflexology'
        ];

        const commonLanguages = [
          'English',
          'Spanish',
          'French',
          'German',
          'Italian',
          'Portuguese',
          'Mandarin',
          'Japanese',
          'Korean',
          'Arabic'
        ];

        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>

            <div className={styles.bioContainer} key={profileKey}>
              <div className={styles.bioForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Business Name</label>
                    <input type="text" data-field="business_name" className={styles.formInput} defaultValue={profileBasic.business_name || ''} />
                    </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Your Name</label>
                    <input type="text" data-field="contact_name" className={styles.formInput} defaultValue={profileBasic.contact_name || ''} />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone Number</label>
                    <input type="text" data-field="phone_number" className={styles.formInput} defaultValue={profileBasic.phone_number || ''} />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Wellness Practice (Select all that apply)</label>
                  <div className={styles.practiceOptions}>
                    {wellnessPractices.map((practice) => {
                      // Map practice name to ID for comparison
                      const practiceMap: { [key: string]: string } = {
                        'Massage Therapy': 'massage',
                        'Yoga Instruction': 'yoga',
                        'Aesthetics & Skincare': 'aesthetics',
                        'Reiki & Energy Work': 'reiki',
                        'Doula Services': 'doulas',
                        'Nutrition Counseling': 'nutrition'
                      };
                      const practiceId = practiceMap[practice] || practice.toLowerCase();
                      // Determine initial selection from state; fallback to profile's stored string
                      const stored = (profileBasic.business_type || '')
                        .split(',')
                        .map((s: string) => s.trim().toLowerCase())
                        .filter(Boolean);
                      const currentSet = selectedPractices.length > 0 ? selectedPractices : stored;
                      const isSelected = currentSet.includes(practiceId);
                      
                      return (
                    <button 
                          key={practice}
                          type="button"
                          className={`${styles.practiceOption} ${isSelected ? styles.practiceSelected : ''}`}
                      onClick={() => {
                            setSelectedPractices(prev => {
                              const has = prev.includes(practiceId);
                              if (has) return prev.filter(p => p !== practiceId);
                              return [...prev, practiceId];
                            });
                          }}
                        >
                          {practice.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Address</label>
                  <input type="text" data-field="address_line1" className={styles.formInput} defaultValue={profileBasic.address_line1 || ''} placeholder="Street address" />
              </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>City</label>
                    <input type="text" data-field="city" className={styles.formInput} defaultValue={profileBasic.city || ''} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>State</label>
                    <input type="text" data-field="state" className={styles.formInput} defaultValue={profileBasic.state || ''} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Zip Code</label>
                    <input type="text" data-field="zip_code" className={styles.formInput} defaultValue={profileBasic.zip_code || ''} />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Bio</label>
                  <textarea
                    className={styles.formTextarea}
                    rows={6}
                    data-field="bio"
                    defaultValue={profileBasic.bio || ''}
                  ></textarea>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Specialties</label>
                  <textarea
                    className={styles.formTextarea}
                    rows={3}
                    data-field="specialties"
                    defaultValue={profileBasic.specialties || ''}
                    placeholder="Describe your specialties and techniques..."
                  ></textarea>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Years of Experience</label>
                    <select data-field="years_experience" className={styles.formSelect} defaultValue={yearsExp || ''}>
                      <option value="">Select experience level</option>
                      <option value="0-1">0-1 years</option>
                      <option value="2-5">2-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="11-15">11-15 years</option>
                      <option value="16+">16+ years</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Languages Spoken</label>
                  <div className={styles.languagesContainer}>
                    <div className={styles.languagesList}>
                      {(selectedLanguages.length > 0 || credentialsBasic.length > 0) ? (
                        (selectedLanguages.length > 0 ? selectedLanguages : credentialsBasic).map((lang: string, index: number) => (
                          <span key={index} className={styles.languageTag}>
                            <button
                              type="button"
                              className={styles.removeTag}
                              onClick={() => {
                                setSelectedLanguages(prev => prev.filter((_, i) => i !== index));
                              }}
                            >
                              ×
                            </button>
                            <span className={styles.languageName}>{lang}</span>
                          </span>
                        ))
                      ) : (
                        <span className={styles.noData}>No languages added yet</span>
                      )}
                    </div>
                    <div className={styles.languageSuggestions}>
                      {commonLanguages
                        .filter(l => !selectedLanguages.includes(l) && !credentialsBasic.includes(l))
                        .slice(0, 5)
                        .map(language => (
                          <button
                            key={language}
                            type="button"
                            className={styles.suggestionButton}
                            onClick={() => {
                              if (!selectedLanguages.includes(language)) {
                                setSelectedLanguages(prev => [...prev, language]);
                              }
                            }}
                          >
                            + {language}
                          </button>
                        ))}
                      <button
                        type="button"
                        className={styles.suggestionButton}
                        onClick={() => setShowOtherInput(true)}
                      >
                        + Other
                      </button>
                      {showOtherInput && (
                        <div className={styles.otherLanguageInput}>
                          <input
                            type="text"
                            value={otherLanguage}
                            onChange={(e) => setOtherLanguage(e.target.value)}
                            placeholder="Enter language name"
                            className={styles.formInput}
                            style={{ width: '200px', marginRight: '8px' }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (otherLanguage.trim()) {
                                setSelectedLanguages([...selectedLanguages, otherLanguage.trim()]);
                                setOtherLanguage('');
                                setShowOtherInput(false);
                              }
                            }}
                            className={styles.secondaryBtn}
                            style={{ marginRight: '8px' }}
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowOtherInput(false);
                              setOtherLanguage('');
                            }}
                            className={styles.secondaryBtn}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Team Members</label>
                  <div className={styles.teamMembersList}>
                    {teamMembers.length > 0 ? (
                      teamMembers.map((member, index) => (
                        <div key={index} className={styles.teamMemberCard}>
                          <div className={styles.teamMemberInfo}>
                            <h4 className={styles.memberName}>{member.name}</h4>
                            <p className={styles.memberDetails}>{member.email} • {member.role}</p>
                          </div>
                          <button
                            className={styles.removeMemberBtn}
                            onClick={() => setTeamMembers(teamMembers.filter((_, i) => i !== index))}
                          >
                            ×
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className={styles.noTeamMembers}>No team members added yet</div>
                    )}

                    {!showAddTeamMember && (
                      <button
                        type="button"
                        className={styles.addTeamMemberBtn}
                        onClick={() => setShowAddTeamMember(true)}
                      >
                        <span className={styles.addIcon}>+</span> Add Team Member
                      </button>
                    )}
                  </div>

                  {showAddTeamMember && (
                    <div className={styles.addTeamMemberModal}>
                      <h3 className={styles.modalTitle}>Add Team Member</h3>
                      <div className={styles.modalForm}>
                        <div className={styles.modalFormGroup}>
                          <label className={styles.modalLabel}>FULL NAME</label>
                          <input
                            type="text"
                            className={styles.modalInput}
                            placeholder="Enter full name"
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                          />
                        </div>
                        <div className={styles.modalFormGroup}>
                          <label className={styles.modalLabel}>EMAIL ADDRESS</label>
                          <input
                            type="email"
                            className={styles.modalInput}
                            placeholder="Enter email address"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                          />
                        </div>
                        <div className={styles.modalActions}>
                          <button
                            className={styles.modalCancelBtn}
                            onClick={() => {
                              setShowAddTeamMember(false);
                              setNewMemberName('');
                              setNewMemberEmail('');
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            className={styles.modalAddBtn}
                            onClick={() => {
                              if (newMemberName && newMemberEmail) {
                                setTeamMembers([...teamMembers, { name: newMemberName, email: newMemberEmail, role: 'Team Member' }]);
                                setShowAddTeamMember(false);
                                setNewMemberName('');
                                setNewMemberEmail('');
                              }
                            }}
                          >
                            Add Member
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
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
                <div className={styles.bioActions}>
                  <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'preferences':
        if (!userData) {
          return <div className={styles.dashboardSection}>Loading...</div>;
        }
        
        const profilePrefs = userData.profile || {};
        const workLocations = profilePrefs.work_location || [];
        
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Preferences</h2>

            <div className={styles.bioContainer}>
              <div className={styles.bioForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Where do you work? (Select all that apply)</label>
                  <div className={styles.workLocationGroup}>
                    <label className={styles.workLocationLabel}>
                      <input type="checkbox" data-field="work_location" value="at-my-place" defaultChecked={workLocations.includes('at-my-place')} />
                      <span>My Place</span>
                    </label>
                    <label className={styles.workLocationLabel}>
                      <input type="checkbox" data-field="work_location" value="at-client-location" defaultChecked={workLocations.includes('at-client-location')} />
                      <span>Clients Location</span>
                    </label>
                    <label className={styles.workLocationLabel}>
                      <input type="checkbox" data-field="work_location" value="online" defaultChecked={workLocations.includes('online')} />
                      <span>Online</span>
                    </label>
                    <label className={styles.workLocationLabel}>
                      <input type="checkbox" data-field="work_location" value="from-booked-studio" defaultChecked={workLocations.includes('from-booked-studio')} />
                      <span>Booked Studio</span>
                    </label>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>TRAVEL FEE</label>
                  <div className={styles.feeTypeContainer}>
                    <div className={styles.feeTypeTabs}>
                      <button
                        type="button"
                        className={`${styles.feeTypeTab} ${travelFeeType === 'free' ? styles.active : ''}`}
                        onClick={() => setTravelFeeType('free')}
                      >
                        <span className={styles.tabIcon}>✓</span>
                        Free Travel
                      </button>
                      <button
                        type="button"
                        className={`${styles.feeTypeTab} ${travelFeeType === 'fee' ? styles.active : ''}`}
                        onClick={() => setTravelFeeType('fee')}
                      >
                        <span className={styles.tabIcon}>$</span>
                        Travel Fee
                      </button>
                    </div>
                    {travelFeeType === 'fee' && (
                      <div style={{ marginTop: '2px', width: '50%' }}>
                        <div className={styles.priceInput}>
                          <span className={styles.dollarSign}>$</span>
                          <input
                            type="text"
                            className={styles.formInput}
                            placeholder="0.00"
                            value={travelFee}
                            onChange={(e) => setTravelFee(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>MAXIMUM TRAVEL DISTANCE</label>
                  <select data-field="max_distance" className={styles.formSelect} defaultValue={profilePrefs.max_distance || '15'} style={{ width: '50%' }}>
                    <option value="5">5 miles</option>
                    <option value="10">10 miles</option>
                    <option value="15">15 miles</option>
                    <option value="20">20 miles</option>
                    <option value="25">25 miles</option>
                    <option value="30">30 miles</option>
                    <option value="50">50 miles</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Additional Travel Policy</label>
                  <textarea
                    className={styles.formTextarea}
                    rows={3}
                    placeholder="Describe your travel policy..."
                    data-field="travel_policy"
                    defaultValue={profilePrefs.travel_policy || ''}
                  ></textarea>
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
                <div className={styles.bioActions}>
                  <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'bio':
        if (!userData) {
          return <div className={styles.dashboardSection}>Loading...</div>;
        }

        const profile = userData.profile || {};
        const credentials = profile.credentials || [];
        const yearsExperience = profile.years_experience || '';

        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Bio</h2>
            
            <div className={styles.bioContainer}>
              <div className={styles.bioForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Business Name</label>
                  <input type="text" className={styles.formInput} defaultValue={profile.business_name || ''} />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Your Name</label>
                  <input type="text" className={styles.formInput} defaultValue={profile.contact_name || ''} />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Phone Number</label>
                  <input type="text" className={styles.formInput} defaultValue={profile.phone_number || ''} />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Practice Type</label>
                  <input type="text" className={styles.formInput} defaultValue={profile.business_type || ''} />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Bio</label>
                  <textarea 
                    className={styles.formTextarea} 
                    rows={6}
                    defaultValue={profile.bio || ''}
                  ></textarea>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Years of Experience</label>
                  <select className={styles.formSelect} defaultValue="">
                    <option value="">Select experience level</option>
                    <option value="0-1">0-1 years</option>
                    <option value="2-5">2-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="11-15">11-15 years</option>
                    <option value="16+">16+ years</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Languages</label>
                  <div className={styles.specialtiesList}>
                    {credentials.length > 0 ? (
                      credentials.map((lang: string, index: number) => (
                        <span key={index} className={styles.specialtyTag}>{lang}</span>
                      ))
                    ) : (
                      <span className={styles.noData}>No languages added yet</span>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Address</label>
                  <input type="text" className={styles.formInput} defaultValue={`${profile.address_line1 || ''} ${profile.city || ''}, ${profile.state || ''} ${profile.zip_code || ''}`.trim()} />
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
            <div className={styles.servicesHeader}>
              <h2 className={styles.sectionTitle}>Certifications</h2>
              <button 
                className={styles.addServiceBtn}
                onClick={() => setShowCertificationModal(true)}
              >
                + Add Certification
              </button>
            </div>
            
            {certifications.length > 0 && (
              <div className={styles.servicesList}>
                {certifications.map((cert, index) => {
                  const formatDate = (dateString: string) => {
                    if (!dateString) return '';
                    const date = new Date(dateString);
                    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                  };
                  
                  return (
                    <div key={index} className={styles.serviceCard}>
                      <div className={styles.serviceCardInfo}>
                        <h4 className={styles.serviceCardName}>{cert.name}</h4>
                        <p className={styles.serviceCardDetails}>{cert.issuer}</p>
                        <p className={styles.serviceCardDetails} style={{ marginTop: '4px', color: '#666' }}>
                          {cert.issueDate && `Issued: ${formatDate(cert.issueDate)}`}
                          {cert.expirationDate && ` • Expires: ${formatDate(cert.expirationDate)}`}
                          {!cert.issueDate && !cert.expirationDate && 'No dates specified'}
                        </p>
                        {cert.licenseNumber && (
                          <p className={styles.serviceCardDetails} style={{ marginTop: '4px', color: '#666', fontStyle: 'italic' }}>
                            License Number: {cert.licenseNumber}
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button 
                          className={styles.editServiceBtn}
                          onClick={() => {
                            setEditingCertificationIndex(index);
                            setNewCertification({
                              name: cert.name || '',
                              issuer: cert.issuer || '',
                              issueDate: cert.issueDate || '',
                              expirationDate: cert.expirationDate || '',
                              licenseNumber: cert.licenseNumber || ''
                            });
                            setShowCertificationModal(true);
                          }}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: '#6C4F70', 
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontWeight: '500'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.removeServiceBtn}
                          onClick={async () => {
                            const updatedCerts = certifications.filter((_, i) => i !== index);
                            setCertifications(updatedCerts);
                            
                            // Save to database immediately
                            setIsSaving(true);
                            
                            try {
                              const token = localStorage.getItem('token');
                              if (!token) {
                                throw new Error('No authentication token found');
                              }

                              const profileData: any = {
                                certifications: updatedCerts
                              };

                              const response = await fetch('http://localhost:4000/api/auth/profile/provider', {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify(profileData)
                              });

                              let result;
                              try {
                                result = await response.json();
                              } catch (error) {
                                const text = await response.text();
                                console.error('Failed to parse JSON response:', text);
                                throw new Error(`Server error: ${response.status} ${response.statusText}`);
                              }

                              if (!response.ok || !result.success) {
                                console.error('Backend error response:', result);
                                throw new Error(result.message || result.error || 'Failed to update profile');
                              }

                              // Update localStorage
                              if (result.profile) {
                                const updatedProfile = { ...result.profile };
                                
                                if (typeof updatedProfile.certifications === 'string') {
                                  try {
                                    updatedProfile.certifications = JSON.parse(updatedProfile.certifications);
                                  } catch (e) {
                                    updatedProfile.certifications = [];
                                  }
                                }

                                const updatedUser = {
                                  ...userData,
                                  profile: {
                                    ...userData.profile,
                                    certifications: updatedProfile.certifications
                                  }
                                };
                                localStorage.setItem('user', JSON.stringify(updatedUser));
                                setUserData(updatedUser);
                                setCertifications(updatedProfile.certifications);
                                
                                window.dispatchEvent(new Event('profileUpdated'));
                              }
                            } catch (error: any) {
                              console.error('Error deleting certification:', error);
                              // Revert state change on error
                              setCertifications(certifications);
                              alert(`Error: ${error.message || 'Failed to delete certification'}`);
                            } finally {
                              setIsSaving(false);
                            }
                          }}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {showCertificationModal && (
              <div className={styles.addServiceModal}>
                <h3 className={styles.modalTitle}>{editingCertificationIndex !== null ? 'Edit Certification' : 'Add New Certification'}</h3>
                <div className={styles.modalForm}>
                  <div className={styles.modalFormGroup}>
                    <label className={styles.modalLabel}>CERTIFICATION NAME</label>
                    <input
                      type="text"
                      className={styles.modalInput}
                      placeholder="e.g., Licensed Massage Therapist"
                      maxLength={100}
                      value={newCertification.name}
                      onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#999', textAlign: 'right' }}>{newCertification.name.length}/100</span>
                  </div>
                  
                  <div className={styles.modalFormGroup}>
                    <label className={styles.modalLabel}>ISSUING ORGANIZATION</label>
                    <input
                      type="text"
                      className={styles.modalInput}
                      placeholder="e.g., California Massage Therapy Council"
                      maxLength={100}
                      value={newCertification.issuer}
                      onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#999', textAlign: 'right' }}>{newCertification.issuer.length}/100</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div className={styles.modalFormGroup} style={{ flex: 1 }}>
                      <label className={styles.modalLabel}>ISSUE DATE</label>
                      <input
                        type="date"
                        className={styles.modalInput}
                        value={newCertification.issueDate}
                        onChange={(e) => setNewCertification({ ...newCertification, issueDate: e.target.value })}
                      />
                    </div>
                    <div className={styles.modalFormGroup} style={{ flex: 1 }}>
                      <label className={styles.modalLabel}>EXPIRATION DATE (optional)</label>
                      <input
                        type="date"
                        className={styles.modalInput}
                        value={newCertification.expirationDate}
                        onChange={(e) => setNewCertification({ ...newCertification, expirationDate: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.modalFormGroup}>
                    <label className={styles.modalLabel}>LICENSE NUMBER (optional)</label>
                    <input
                      type="text"
                      className={styles.modalInput}
                      placeholder="e.g., MBT-12345"
                      maxLength={50}
                      value={newCertification.licenseNumber}
                      onChange={(e) => setNewCertification({ ...newCertification, licenseNumber: e.target.value })}
                    />
                  </div>
                  
                  <div className={styles.modalActions}>
                    <button 
                      type="button"
                      className={styles.modalCancelBtn}
                      onClick={() => {
                        setShowCertificationModal(false);
                        setEditingCertificationIndex(null);
                        setNewCertification({ name: '', issuer: '', issueDate: '', expirationDate: '', licenseNumber: '' });
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={styles.modalAddBtn}
                      disabled={!newCertification.name || !newCertification.issuer || isSaving}
                      onClick={async () => {
                        if (newCertification.name && newCertification.issuer) {
                          // Calculate updated certifications array
                          let updatedCertifications;
                          if (editingCertificationIndex !== null) {
                            // Update existing certification
                            updatedCertifications = [...certifications];
                            updatedCertifications[editingCertificationIndex] = { ...newCertification, id: certifications[editingCertificationIndex].id || Date.now() };
                          } else {
                            // Add new certification
                            updatedCertifications = [...certifications, { ...newCertification, id: Date.now() }];
                          }
                          
                          // Save to database immediately
                          setIsSaving(true);
                          setSaveMessage('');
                          
                          try {
                            const token = localStorage.getItem('token');
                            if (!token) {
                              throw new Error('No authentication token found');
                            }

                            const profileData: any = {
                              certifications: updatedCertifications
                            };
                            
                            // Update local state
                            setCertifications(updatedCertifications);

                            const response = await fetch('http://localhost:4000/api/auth/profile/provider', {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify(profileData)
                            });

                            let result;
                            try {
                              result = await response.json();
                            } catch (error) {
                              const text = await response.text();
                              console.error('Failed to parse JSON response:', text);
                              throw new Error(`Server error: ${response.status} ${response.statusText}`);
                            }

                            if (!response.ok || !result.success) {
                              console.error('Backend error response:', result);
                              throw new Error(result.message || result.error || 'Failed to update profile');
                            }

                            // Update localStorage and reload data
                            if (result.profile) {
                              const updatedProfile = { ...result.profile };
                              
                              // Parse JSONB fields
                              if (typeof updatedProfile.certifications === 'string') {
                                try {
                                  updatedProfile.certifications = JSON.parse(updatedProfile.certifications);
                                } catch (e) {
                                  updatedProfile.certifications = [];
                                }
                              }

                              const updatedUser = {
                                ...userData,
                                profile: {
                                  ...userData.profile,
                                  certifications: updatedProfile.certifications
                                }
                              };
                              localStorage.setItem('user', JSON.stringify(updatedUser));
                              setUserData(updatedUser);
                              setCertifications(updatedProfile.certifications);
                              
                              // Dispatch event to notify dashboard
                              window.dispatchEvent(new Event('profileUpdated'));
                            }

                            setSaveMessage('Certification saved successfully!');
                            setTimeout(() => setSaveMessage(''), 3000);
                            
                            // Close modal and reset form
                            setShowCertificationModal(false);
                            setEditingCertificationIndex(null);
                            setNewCertification({ name: '', issuer: '', issueDate: '', expirationDate: '', licenseNumber: '' });
                          } catch (error: any) {
                            console.error('Error saving certification:', error);
                            setSaveMessage(`Error: ${error.message || 'Failed to save certification'}`);
                            setTimeout(() => setSaveMessage(''), 5000);
                          } finally {
                            setIsSaving(false);
                          }
                        }
                      }}
                    >
                      {isSaving ? 'Saving...' : (editingCertificationIndex !== null ? 'Save Changes' : 'Add Certification')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Profile & Preferences</h2>
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
      {showAddServiceModal && (
        <AddServiceModal 
          onClose={() => {
            setShowAddServiceModal(false);
            setEditingService(null);
          }} 
          editingService={editingService}
        />
      )}
    </div>
  );
}

interface AddServiceModalProps {
  onClose: () => void;
  editingService?: any;
}

function AddServiceModal({ onClose, editingService }: AddServiceModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [serviceData, setServiceData] = useState({
    name: '',
    description: '',
    duration: 60,
    basePrice: '',
    locationOptions: {
      online: false,
      inPerson: false
    },
    addOns: [
      { id: 1, name: '', price: '' }
    ]
  });

  // Initialize form data when component mounts or editingService changes
  React.useEffect(() => {
    if (editingService) {
      setServiceData({
        name: editingService.name || '',
        description: editingService.description || '',
        duration: editingService.duration || 60,
        basePrice: editingService.basePrice || '',
        locationOptions: editingService.locationOptions || {
          online: false,
          inPerson: false
        },
        addOns: editingService.addOns?.length > 0 ? editingService.addOns : [
          { id: 1, name: '', price: '' }
        ]
      });
    }
    setIsLoading(false);
  }, [editingService]);

  const handleInputChange = (field: string, value: any) => {
    setServiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    setServiceData(prev => ({
      ...prev,
      locationOptions: {
        ...prev.locationOptions,
        [location]: checked
      }
    }));
  };

  const handleAddOnChange = (index: number, field: string, value: string) => {
    setServiceData(prev => ({
      ...prev,
      addOns: prev.addOns.map((addOn, i) => 
        i === index ? { ...addOn, [field]: value } : addOn
      )
    }));
  };

  const addNewAddOn = () => {
    setServiceData(prev => ({
      ...prev,
      addOns: [...prev.addOns, { id: prev.addOns.length + 1, name: '', price: '' }]
    }));
  };

  const removeAddOn = (index: number) => {
    setServiceData(prev => ({
      ...prev,
      addOns: prev.addOns.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Service data:', serviceData);
    onClose();
  };

  // Don't render until loading is complete
  if (isLoading) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.serviceForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Service Name *</label>
              <input
                type="text"
                value={serviceData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={styles.formInput}
                placeholder="e.g., Private Yoga Session"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Duration (minutes) *</label>
              <select
                value={serviceData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                className={styles.formSelect}
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={75}>75 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>120 minutes</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description *</label>
            <textarea
              value={serviceData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={styles.formTextarea}
              rows={3}
              placeholder="Describe your service in detail..."
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Base Price *</label>
            <div className={styles.priceInput}>
              <span className={styles.dollarSign}>$</span>
              <input
                type="number"
                value={serviceData.basePrice}
                onChange={(e) => handleInputChange('basePrice', e.target.value)}
                className={styles.formInput}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Location Options (Check all that apply) *</label>
            <div className={styles.locationOptions}>
              <label className={styles.locationOption}>
                <input
                  type="checkbox"
                  checked={serviceData.locationOptions.online}
                  onChange={(e) => handleLocationChange('online', e.target.checked)}
                />
                <span className={styles.locationIcon}><FaVideo /></span>
                <span className={styles.locationText}>Online</span>
              </label>
              
              <label className={styles.locationOption}>
                <input
                  type="checkbox"
                  checked={serviceData.locationOptions.inPerson}
                  onChange={(e) => handleLocationChange('inPerson', e.target.checked)}
                />
                <span className={styles.locationIcon}><FaMapMarkerAlt /></span>
                <span className={styles.locationText}>In-Person</span>
              </label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Add-ons</label>
            <div className={styles.addOnsList}>
              {serviceData.addOns.map((addOn, index) => (
                <div key={addOn.id} className={styles.addOnItem}>
                  <div className={styles.addOnInputs}>
                    <input
                      type="text"
                      value={addOn.name}
                      onChange={(e) => handleAddOnChange(index, 'name', e.target.value)}
                      className={styles.formInput}
                      placeholder="Add-on name"
                    />
                    <div className={styles.priceInput}>
                      <span className={styles.dollarSign}>$</span>
                      <input
                        type="number"
                        value={addOn.price}
                        onChange={(e) => handleAddOnChange(index, 'price', e.target.value)}
                        className={styles.formInput}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.removeAddOnBtn}
                    onClick={() => removeAddOn(index)}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className={styles.addAddOnBtn}
                onClick={addNewAddOn}
              >
                <FaPlus /> Add Another Add-on
              </button>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              {editingService ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

