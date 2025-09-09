'use client';

import { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaImages, FaWifi, FaParking, FaCoffee, FaShower, FaTv, FaUtensils, FaSnowflake, FaSwimmingPool, FaDumbbell, FaMusic, FaWheelchair, FaLightbulb, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import styles from '@/styles/Spaces/Dashboard.module.scss';

interface ManageListingProps {
  listingId: string;
  onBack: () => void;
  isNewListing?: boolean;
}

export default function ManageListing({ listingId, onBack, isNewListing = false }: ManageListingProps) {
  const [showEarnings, setShowEarnings] = useState(false);
  
  // Initialize form data based on whether it's a new listing or editing existing
  const getInitialFormData = () => {
    if (isNewListing) {
      return {
        // Basic Info
        name: '',
        description: '',
        category: '',
        
        // Pricing
        hourlyRate: 0,
        dailyRate: 0,
        weeklyRate: 0,
        monthlyRate: 0,
        cleaningFee: 0,
        securityDeposit: 0,
        
        // Location
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        
        // Capacity & Features
        maxCapacity: 0,
        squareFootage: 0,
        
        // Availability
        isActive: true,
        advanceBookingDays: 30,
        minimumBookingHours: 1,
        maximumBookingHours: 8,
        instantBooking: false,
        
        // Amenities
        amenities: {
          wifi: false,
          parking: false,
          coffee: false,
          shower: false,
          tv: false,
          kitchen: false,
          airConditioning: false,
          heating: false,
          soundSystem: false,
          projector: false,
          whiteboard: false,
          mirrors: false,
          props: false,
          storage: false,
          outdoorSpace: false,
          pool: false,
          gym: false,
          music: false,
          wheelchairAccessible: false
        },
        
        // Rules & Policies
        houseRules: [],
        cancellationPolicy: 'moderate',
        
        // Images
        images: []
      };
    } else {
      // Existing listing data
      return {
        // Basic Info
        name: 'Modern Wellness Studio',
        description: 'A beautiful, modern wellness studio perfect for yoga, meditation, and wellness workshops. Features natural lighting, hardwood floors, and peaceful ambiance.',
        category: 'Wellness Studio',
        
        // Pricing
        hourlyRate: 75,
        dailyRate: 500,
        weeklyRate: 3000,
        monthlyRate: 10000,
        cleaningFee: 25,
        securityDeposit: 200,
        
        // Location
        address: '123 Wellness Way',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        country: 'United States',
        
        // Capacity & Features
        maxCapacity: 20,
        squareFootage: 1200,
        
        // Availability
        isActive: true,
        instantBooking: true,
        advanceBookingDays: 30,
        minimumBookingHours: 2,
        maximumBookingHours: 8,
        
        // Amenities
        amenities: {
          wifi: true,
          parking: true,
          coffee: false,
          shower: false,
          tv: false,
          kitchen: false,
          airConditioning: true,
          heating: true,
          soundSystem: true,
          projector: false,
          whiteboard: true,
          mirrors: true,
          props: true,
          storage: true,
          outdoorSpace: false,
          pool: false,
          gym: false,
          music: true,
          wheelchairAccessible: true
        },
        
        // Rules & Policies
        houseRules: [
          'No smoking or vaping',
          'No pets allowed',
          'Shoes off in the studio',
          'Respect the peaceful environment',
          'Clean up after use'
        ],
        cancellationPolicy: 'moderate', // flexible, moderate, strict
        
        // Images
        images: [
          { id: 1, url: '/api/placeholder/400/300', alt: 'Main studio view' },
          { id: 2, url: '/api/placeholder/400/300', alt: 'Entrance area' },
          { id: 3, url: '/api/placeholder/400/300', alt: 'Storage area' }
        ]
      };
    }
  };

  const [formData, setFormData] = useState(getInitialFormData());

  const [activeTab, setActiveTab] = useState('basic');
  const [newRule, setNewRule] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate estimated earnings
  const calculateEstimatedEarnings = () => {
    const itemPrice = formData.hourlyRate || 0;
    const platformFee = Math.round(itemPrice * 0.12 * 100) / 100; // 12% platform fee
    const estimatedEarnings = itemPrice - platformFee;
    return {
      itemPrice,
      platformFee,
      estimatedEarnings
    };
  };

  const earnings = calculateEstimatedEarnings();

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: checked
      }
    }));
  };

  const addHouseRule = () => {
    if (newRule.trim()) {
      setFormData(prev => ({
        ...prev,
        houseRules: [...prev.houseRules, newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const removeHouseRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      houseRules: prev.houseRules.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    console.log('Saving listing data:', formData);
    // Here you would typically save to your backend
    alert('Listing updated successfully!');
  };

  const amenityOptions = [
    { key: 'wifi', label: 'WiFi', icon: FaWifi },
    { key: 'parking', label: 'Parking', icon: FaParking },
    { key: 'kitchen', label: 'Kitchen', icon: FaUtensils },
    { key: 'bathroom', label: 'Bathroom', icon: FaShower },
    { key: 'airConditioning', label: 'Air Conditioning', icon: FaSnowflake },
    { key: 'heating', label: 'Heating', icon: FaSnowflake },
    { key: 'soundSystem', label: 'Sound System', icon: FaMusic },
    { key: 'projector', label: 'Projector', icon: FaTv },
    { key: 'whiteboard', label: 'Whiteboard', icon: FaTv },
    { key: 'mirrors', label: 'Mirrors', icon: FaTv },
    { key: 'props', label: 'Yoga Props', icon: FaDumbbell },
    { key: 'storage', label: 'Storage', icon: FaCoffee },
    { key: 'outdoorSpace', label: 'Outdoor Space', icon: FaCoffee },
    { key: 'pool', label: 'Pool', icon: FaSwimmingPool },
    { key: 'gym', label: 'Gym Equipment', icon: FaDumbbell },
    { key: 'wheelchairAccessible', label: 'Wheelchair Accessible', icon: FaWheelchair }
  ];

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'location', label: 'Location' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'policies', label: 'Policies' },
    { id: 'photos', label: 'Photos' }
  ];

  return (
    <div className={styles.manageListingContainer}>
      <div className={styles.manageListingHeader}>
        <button onClick={onBack} className={styles.backButton}>
          ← Back to Listings
        </button>
        <h1 className={styles.manageListingTitle}>
          {isNewListing ? 'Add New Listing' : 'Manage Listing'}
        </h1>
        {!isNewListing && (
          <div className={styles.listingStatus}>
            <span className={`${styles.statusBadge} ${formData.isActive ? styles.active : styles.inactive}`}>
              {formData.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        )}
      </div>

      <div className={styles.manageListingContent}>
        <div className={styles.tabNavigation}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'basic' && (
            <div className={styles.basicInfoSection}>
              <h2 className={styles.sectionTitle}>Basic Information</h2>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Space Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={styles.textInput}
                    placeholder="Enter space name"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="Wellness Studio">Wellness Studio</option>
                    <option value="Conference Room">Conference Room</option>
                    <option value="Event Space">Event Space</option>
                    <option value="Co-working Space">Co-working Space</option>
                    <option value="Fitness Studio">Fitness Studio</option>
                    <option value="Meeting Room">Meeting Room</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={styles.textareaInput}
                  rows={4}
                  placeholder="Describe your space..."
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Maximum Capacity</label>
                  <input
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => handleInputChange('maxCapacity', parseInt(e.target.value))}
                    className={styles.numberInput}
                    min="1"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Square Footage</label>
                  <input
                    type="number"
                    value={formData.squareFootage}
                    onChange={(e) => handleInputChange('squareFootage', parseInt(e.target.value))}
                    className={styles.numberInput}
                    min="1"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>Space is active and available for booking</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className={styles.pricingSection}>
              <h2 className={styles.sectionTitle}>Pricing & Rates</h2>
              
              <div className={styles.pricingRow}>
                <div className={styles.pricingItem}>
                  <label className={styles.pricingLabel}>Hourly Rate</label>
                  <input
                    type="text"
                    value={`$ ${formData.hourlyRate || ''}`}
                    onChange={(e) => {
                      const value = e.target.value.replace('$ ', '');
                      handleInputChange('hourlyRate', parseInt(value) || 0);
                    }}
                    className={styles.priceField}
                    placeholder="$ 0.00"
                  />
                </div>

                <div className={styles.pricingItem}>
                  <label className={styles.pricingLabel}>Daily Rate</label>
                  <input
                    type="text"
                    value={`$ ${formData.dailyRate || ''}`}
                    onChange={(e) => {
                      const value = e.target.value.replace('$ ', '');
                      handleInputChange('dailyRate', parseInt(value) || 0);
                    }}
                    className={styles.priceField}
                    placeholder="$ 0.00"
                  />
                </div>

                <div className={styles.pricingItem}>
                  <label className={styles.pricingLabel}>Weekly Rate</label>
                  <input
                    type="text"
                    value={`$ ${formData.weeklyRate || ''}`}
                    onChange={(e) => {
                      const value = e.target.value.replace('$ ', '');
                      handleInputChange('weeklyRate', parseInt(value) || 0);
                    }}
                    className={styles.priceField}
                    placeholder="$ 0.00"
                  />
                </div>

                <div className={styles.pricingItem}>
                  <label className={styles.pricingLabel}>Monthly Rate</label>
                  <input
                    type="text"
                    value={`$ ${formData.monthlyRate || ''}`}
                    onChange={(e) => {
                      const value = e.target.value.replace('$ ', '');
                      handleInputChange('monthlyRate', parseInt(value) || 0);
                    }}
                    className={styles.priceField}
                    placeholder="$ 0.00"
                  />
                </div>
              </div>

              <div className={styles.additionalFees}>
                <h3 className={styles.additionalFeesTitle}>Additional Fees</h3>
                <div className={styles.feesRow}>
                  <div className={styles.feeItem}>
                    <label className={styles.feeLabel}>Cleaning Fee</label>
                    <input
                      type="text"
                      value={`$ ${formData.cleaningFee || ''}`}
                      onChange={(e) => {
                        const value = e.target.value.replace('$ ', '');
                        handleInputChange('cleaningFee', parseInt(value) || 0);
                      }}
                      className={styles.feeField}
                      placeholder="$ 0.00"
                    />
                  </div>
                  <div className={styles.feeItem}>
                    <label className={styles.feeLabel}>Security Deposit</label>
                    <input
                      type="text"
                      value={`$ ${formData.securityDeposit || ''}`}
                      onChange={(e) => {
                        const value = e.target.value.replace('$ ', '');
                        handleInputChange('securityDeposit', parseInt(value) || 0);
                      }}
                      className={styles.feeField}
                      placeholder="$ 0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Estimated Earnings Section */}
              <div className={styles.estimatedEarnings}>
                <button 
                  className={styles.earningsHeader}
                  onClick={() => setShowEarnings(!showEarnings)}
                >
                  <div className={styles.earningsHeaderLeft}>
                    <FaLightbulb className={styles.earningsIcon} />
                    <span className={styles.earningsText}>
                      Estimated earnings: ${earnings.estimatedEarnings.toFixed(2)}
                    </span>
                  </div>
                  {showEarnings ? (
                    <FaChevronUp className={styles.earningsChevron} />
                  ) : (
                    <FaChevronDown className={styles.earningsChevron} />
                  )}
                </button>

                {showEarnings && (
                  <div className={styles.earningsDetails}>
                    <div className={styles.earningsRow}>
                      <span className={styles.earningsLabel}>Item price</span>
                      <span className={styles.earningsValue}>${earnings.itemPrice}</span>
                    </div>
                    <div className={styles.earningsRow}>
                      <span className={styles.earningsLabel}>Platform fees</span>
                      <span className={styles.earningsValue}>-${earnings.platformFee.toFixed(2)}</span>
                    </div>
                    <div className={styles.earningsRow}>
                      <span className={styles.earningsLabel}>Estimated earnings</span>
                      <span className={styles.earningsTotal}>${earnings.estimatedEarnings.toFixed(2)}</span>
                    </div>
                    <div className={styles.earningsNote}>
                      <p>
                        This optional tool is for space owners who want pricing guidance—it won't impact your listing in any way. 
                        For a more detailed version, try our{' '}
                        <a href="#" className={styles.earningsLink}>pricing worksheet</a>.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className={styles.locationSection}>
              <h2 className={styles.sectionTitle}>Location Details</h2>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Street Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={styles.textInput}
                  placeholder="Enter street address"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={styles.textInput}
                    placeholder="Enter city"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={styles.textInput}
                    placeholder="Enter state"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>ZIP Code</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className={styles.textInput}
                    placeholder="Enter ZIP code"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className={styles.textInput}
                    placeholder="Enter country"
                  />
                </div>
              </div>

              <div className={styles.mapPlaceholder}>
                <FaMapMarkerAlt className={styles.mapIcon} />
                <p className={styles.mapText}>Map will be displayed here</p>
              </div>
            </div>
          )}

          {activeTab === 'amenities' && (
            <div className={styles.amenitiesSection}>
              <h2 className={styles.sectionTitle}>Amenities & Features</h2>
              <p className={styles.sectionDescription}>Select all amenities available in your space</p>
              
              <div className={styles.amenitiesGrid}>
                {amenityOptions.map(amenity => {
                  const IconComponent = amenity.icon;
                  return (
                    <label key={amenity.key} className={styles.amenityItem}>
                      <input
                        type="checkbox"
                        checked={formData.amenities[amenity.key as keyof typeof formData.amenities]}
                        onChange={(e) => handleAmenityChange(amenity.key, e.target.checked)}
                        className={styles.amenityCheckbox}
                      />
                      <div className={styles.amenityContent}>
                        <IconComponent className={styles.amenityIcon} />
                        <span className={styles.amenityLabel}>{amenity.label}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'policies' && (
            <div className={styles.policiesSection}>
              <h2 className={styles.sectionTitle}>Policies & Rules</h2>
              
              <div className={styles.policyGroup}>
                <h3 className={styles.subsectionTitle}>House Rules</h3>
                <div className={styles.houseRulesList}>
                  {formData.houseRules.map((rule, index) => (
                    <div key={index} className={styles.houseRuleItem}>
                      <span className={styles.ruleText}>{rule}</span>
                      <button
                        type="button"
                        onClick={() => removeHouseRule(index)}
                        className={styles.removeRuleButton}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className={styles.addRuleForm}>
                  <input
                    type="text"
                    value={newRule}
                    onChange={(e) => setNewRule(e.target.value)}
                    className={styles.ruleInput}
                    placeholder="Add a new house rule..."
                    onKeyPress={(e) => e.key === 'Enter' && addHouseRule()}
                  />
                  <button
                    type="button"
                    onClick={addHouseRule}
                    className={styles.addRuleButton}
                    disabled={!newRule.trim()}
                  >
                    Add Rule
                  </button>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cancellation Policy</label>
                  <select
                    value={formData.cancellationPolicy}
                    onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="flexible">Flexible - Full refund 1 day before</option>
                    <option value="moderate">Moderate - Full refund 5 days before</option>
                    <option value="strict">Strict - 50% refund 7 days before</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Advance Booking (Days)</label>
                  <input
                    type="number"
                    value={formData.advanceBookingDays}
                    onChange={(e) => handleInputChange('advanceBookingDays', parseInt(e.target.value))}
                    className={styles.numberInput}
                    min="1"
                    max="365"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Minimum Booking Hours</label>
                  <input
                    type="number"
                    value={formData.minimumBookingHours}
                    onChange={(e) => handleInputChange('minimumBookingHours', parseInt(e.target.value))}
                    className={styles.numberInput}
                    min="1"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Maximum Booking Hours</label>
                  <input
                    type="number"
                    value={formData.maximumBookingHours}
                    onChange={(e) => handleInputChange('maximumBookingHours', parseInt(e.target.value))}
                    className={styles.numberInput}
                    min="1"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.instantBooking}
                    onChange={(e) => handleInputChange('instantBooking', e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkboxText}>Enable instant booking</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className={styles.photosSection}>
              <h2 className={styles.sectionTitle}>Photos</h2>
              <p className={styles.sectionDescription}>Upload photos of your space to attract more bookings</p>
              
              <div className={styles.photosGrid}>
                {formData.images.map((image, index) => (
                  <div key={image.id} className={styles.photoItem}>
                    <img src={image.url} alt={image.alt} className={styles.photoImage} />
                    <div className={styles.photoOverlay}>
                      <button className={styles.photoButton}>Edit</button>
                      <button className={styles.photoButton}>Delete</button>
                    </div>
                  </div>
                ))}
                <div className={styles.addPhotoButton}>
                  <FaImages className={styles.addPhotoIcon} />
                  <span className={styles.addPhotoText}>Add Photo</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.manageListingActions}>
          <button onClick={onBack} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            {isNewListing ? 'Create Listing' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
