'use client';

import { useState } from 'react';
import styles from '@/styles/Providers/SignupSteps.module.scss';

interface ServicesStepProps {
  onNext: (data: { services: any[] }) => void;
  onBack: () => void;
  initialData: any;
}

const serviceTypes = [
  'Massage Therapy',
  'Yoga Instruction',
  'Aesthetics & Skincare',
  'Reiki & Energy Work',
  'Nutrition Counseling',
  'Life Coaching',
  'Meditation Instruction',
  'Physical Therapy'
];

const durationOptions = [
  { value: '30', label: '30 min' },
  { value: '45', label: '45 min' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' }
];

export default function ServicesStep({ onNext, onBack, initialData }: ServicesStepProps) {
  const [services, setServices] = useState(initialData.services || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    type: '',
    duration: '60',
    price: '',
    priceType: 'fixed',
    mobileService: false
  });

  const handleAddService = () => {
    if (newService.name && newService.type && newService.price) {
      setServices([...services, { ...newService, id: Date.now() }]);
      setNewService({
        name: '',
        type: '',
        duration: '60',
        price: '',
        priceType: 'fixed',
        mobileService: false
      });
      setShowAddForm(false);
    }
  };

  const handleRemoveService = (id: number) => {
    setServices(services.filter((service: any) => service.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (services.length > 0) {
      onNext({ services });
    }
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>What services do you offer?</h1>
      <p className={styles.subtitle}>Add the wellness services you provide to help clients find you.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Current Services List */}
        <div className={styles.servicesList}>
          {services.map((service: any) => (
            <div key={service.id} className={styles.serviceItem}>
              <div className={styles.serviceInfo}>
                <h4 className={styles.serviceName}>{service.name}</h4>
                <p className={styles.serviceDetails}>
                  {service.type} • {service.duration} • ${service.price} {service.priceType}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveService(service.id)}
                className={styles.removeButton}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Add Service Form */}
        {showAddForm ? (
          <div className={styles.addServiceForm}>
            <h3 className={styles.addServiceTitle}>Add New Service</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>SERVICE NAME</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  className={styles.textInput}
                  placeholder="e.g., Deep Tissue Massage"
                  maxLength={50}
                />
                <span className={styles.charCount}>{newService.name.length}/50</span>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>SERVICE TYPE</label>
                <select
                  value={newService.type}
                  onChange={(e) => setNewService({...newService, type: e.target.value})}
                  className={styles.selectInput}
                >
                  <option value="">Select type</option>
                  {serviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>DURATION</label>
                <select
                  value={newService.duration}
                  onChange={(e) => setNewService({...newService, duration: e.target.value})}
                  className={styles.selectInput}
                >
                  {durationOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>PRICE</label>
                <div className={styles.priceInput}>
                  <span className={styles.dollarSign}>$</span>
                  <input
                    type="number"
                    value={newService.price}
                    onChange={(e) => setNewService({...newService, price: e.target.value})}
                    className={styles.textInput}
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>PRICE TYPE</label>
                <select
                  value={newService.priceType}
                  onChange={(e) => setNewService({...newService, priceType: e.target.value})}
                  className={styles.selectInput}
                >
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Per Hour</option>
                  <option value="session">Per Session</option>
                </select>
              </div>
            </div>

            <div className={styles.mobileServiceToggle}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={newService.mobileService}
                  onChange={(e) => setNewService({...newService, mobileService: e.target.checked})}
                  className={styles.dayCheckbox}
                />
                Mobile Service (I travel to clients)
              </label>
            </div>

            <div className={styles.addServiceButtons}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddService}
                className={styles.addButton}
                disabled={!newService.name || !newService.type || !newService.price}
              >
                Add Service
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className={styles.addServiceButton}
          >
            <span className={styles.plusIcon}>+</span>
            Add Service
          </button>
        )}
        
        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button 
            type="submit" 
            className={styles.continueButton}
            disabled={services.length === 0}
          >
            CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}
