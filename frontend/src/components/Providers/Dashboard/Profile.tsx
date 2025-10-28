'use client';

import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaClock, FaDollarSign, FaUpload, FaFileAlt, FaCheckCircle, FaStar, FaTimes, FaVideo, FaMapMarkerAlt, FaHome } from 'react-icons/fa';
import styles from '@/styles/Providers/Dashboard.module.scss';
import AvailabilityManager from './AvailabilityManager';

interface ProfileProps {
  activeSubmenu: string;
}

export default function Profile({ activeSubmenu }: ProfileProps) {
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  const renderContent = () => {
    switch (activeSubmenu) {
      case 'services':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Service Menu</h2>
            
            <div className={styles.servicesContainer}>
              <div className={styles.servicesHeader}>
                <h3 className={styles.servicesSubtitle}>Your Services</h3>
                <button 
                  className={styles.addServiceBtn}
                  onClick={() => setShowAddServiceModal(true)}
                >
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
                    <button 
                      className={styles.editBtn}
                      onClick={() => {
                        setEditingService({
                          id: '1',
                          name: 'Massage Therapy',
                          description: 'Deep tissue and Swedish massage therapy sessions',
                          duration: 60,
                          basePrice: '120',
                          locationOptions: {
                            online: false,
                            inPerson: true
                          },
                          addOns: [
                            { id: 1, name: 'Hot Stone Therapy', price: '25' },
                            { id: 2, name: 'Aromatherapy', price: '15' }
                          ]
                        });
                        setShowAddServiceModal(true);
                      }}
                    ><FaEdit /></button>
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
                    <button 
                      className={styles.editBtn}
                      onClick={() => {
                        setEditingService({
                          id: '2',
                          name: 'Yoga Class',
                          description: 'Hatha and Vinyasa yoga classes for all levels',
                          duration: 45,
                          basePrice: '80',
                          locationOptions: {
                            online: true,
                            inPerson: true
                          },
                          addOns: [
                            { id: 1, name: 'Extended Session', price: '20' }
                          ]
                        });
                        setShowAddServiceModal(true);
                      }}
                    ><FaEdit /></button>
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
                    <button 
                      className={styles.editBtn}
                      onClick={() => {
                        setEditingService({
                          id: '3',
                          name: 'Meditation Session',
                          description: 'Guided meditation and mindfulness sessions',
                          duration: 30,
                          basePrice: '60',
                          locationOptions: {
                            online: true,
                            inPerson: false
                          },
                          addOns: []
                        });
                        setShowAddServiceModal(true);
                      }}
                    ><FaEdit /></button>
                    <button className={styles.deleteBtn}><FaTrash /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'availability':
        return <AvailabilityManager />;
      
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
