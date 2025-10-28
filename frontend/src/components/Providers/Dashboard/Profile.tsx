'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaClock, FaDollarSign, FaUpload, FaFileAlt, FaCheckCircle, FaStar, FaTimes, FaVideo, FaMapMarkerAlt, FaHome } from 'react-icons/fa';
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
  const [services, setServices] = useState<Array<{ name: string; type: string; duration: string; price: string; priceType: string }>>([]);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ name: '', type: '', duration: '60', price: '', priceType: 'fixed' });

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      setUserData(parsed);
      
      // Load languages from credentials if available
      if (parsed.profile?.credentials && Array.isArray(parsed.profile.credentials)) {
        setSelectedLanguages(parsed.profile.credentials);
      }
      
      // Load services if available
      if (parsed.profile?.services && Array.isArray(parsed.profile.services)) {
        setServices(parsed.profile.services);
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
    }
  }, []);

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
                {services.map((service, index) => (
                  <div key={index} className={styles.serviceCard}>
                    <div className={styles.serviceCardInfo}>
                      <h4 className={styles.serviceCardName}>{service.name}</h4>
                      <p className={styles.serviceCardDetails}>{service.type} • {service.duration} • ${service.price} {service.priceType}</p>
                    </div>
                    <button
                      className={styles.removeServiceBtn}
                      onClick={() => setServices(services.filter((_, i) => i !== index))}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showAddService && (
              <div className={styles.addServiceModal}>
                <h3 className={styles.modalTitle}>Add New Service</h3>
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
                        <option value="90">1.5 hours</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>
                    <div className={styles.modalFormGroup} style={{ flex: 1 }}>
                      <label className={styles.modalLabel}>PRICE</label>
                      <input
                        type="text"
                        className={styles.modalInput}
                        placeholder="$0"
                        value={newService.price}
                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className={styles.modalFormGroup}>
                    <label className={styles.modalLabel}>PRICE TYPE</label>
                    <select
                      className={styles.modalInput}
                      value={newService.priceType}
                      onChange={(e) => setNewService({ ...newService, priceType: e.target.value })}
                    >
                      <option value="fixed">Fixed Price</option>
                      <option value="hourly">Per Hour</option>
                      <option value="session">Per Session</option>
                    </select>
                  </div>
                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.modalCancelBtn}
                      onClick={() => {
                        setShowAddService(false);
                        setNewService({ name: '', type: '', duration: '60', price: '', priceType: 'fixed' });
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={styles.modalAddBtn}
                      disabled={!newService.name || !newService.type || !newService.price}
                      onClick={() => {
                        if (newService.name && newService.type && newService.price) {
                          setServices([...services, { ...newService }]);
                          setShowAddService(false);
                          setNewService({ name: '', type: '', duration: '60', price: '', priceType: 'fixed' });
                        }
                      }}
                    >
                      Add Service
                    </button>
                  </div>
                </div>
              </div>
            )}
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

            <div className={styles.bioContainer}>
              <div className={styles.bioForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Business Name</label>
                    <input type="text" className={styles.formInput} defaultValue={profileBasic.business_name || ''} />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Your Name</label>
                    <input type="text" className={styles.formInput} defaultValue={profileBasic.contact_name || ''} />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone Number</label>
                    <input type="text" className={styles.formInput} defaultValue={profileBasic.phone_number || ''} />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Wellness Practice (Select all that apply)</label>
                  <div className={styles.practiceOptions}>
                    {wellnessPractices.map((practice) => {
                      // Check if this practice matches the stored business_type
                      const businessType = profileBasic.business_type?.toLowerCase() || '';
                      const mappedName = wellnessPracticeMap[businessType];
                      const isSelected = mappedName === practice || businessType === practice.toLowerCase();
                      
                      return (
                        <button
                          key={practice}
                          type="button"
                          className={`${styles.practiceOption} ${isSelected ? styles.practiceSelected : ''}`}
                        >
                          {practice.toUpperCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Address</label>
                  <input type="text" className={styles.formInput} defaultValue={profileBasic.address_line1 || ''} placeholder="Street address" />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>City</label>
                    <input type="text" className={styles.formInput} defaultValue={profileBasic.city || ''} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>State</label>
                    <input type="text" className={styles.formInput} defaultValue={profileBasic.state || ''} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Zip Code</label>
                    <input type="text" className={styles.formInput} defaultValue={profileBasic.zip_code || ''} />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Bio</label>
                  <textarea
                    className={styles.formTextarea}
                    rows={6}
                    defaultValue={profileBasic.bio || ''}
                  ></textarea>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Specialties</label>
                  <textarea
                    className={styles.formTextarea}
                    rows={3}
                    defaultValue={profileBasic.specialties || ''}
                    placeholder="Describe your specialties and techniques..."
                  ></textarea>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Years of Experience</label>
                    <select className={styles.formSelect} defaultValue={yearsExp || ''}>
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

                <div className={styles.bioActions}>
                  <button className={styles.saveBtn}>Save Changes</button>
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
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked={workLocations.includes('at-my-place')} /> My Place
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked={workLocations.includes('at-client-location')} /> Clients Location
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked={workLocations.includes('online')} /> Online
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked={workLocations.includes('from-booked-studio')} /> Booked Studio
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
                        <input
                          type="text"
                          className={styles.formInput}
                          placeholder="$0.00"
                          value={travelFee}
                          onChange={(e) => setTravelFee(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>MAXIMUM TRAVEL DISTANCE</label>
                  <select className={styles.formSelect} defaultValue={profilePrefs.max_distance || '15'} style={{ width: '50%' }}>
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
                    defaultValue={profilePrefs.travel_policy || ''}
                  ></textarea>
                </div>

                <div className={styles.bioActions}>
                  <button className={styles.saveBtn}>Save Preferences</button>
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

