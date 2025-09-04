'use client';

import { useState } from 'react';
import styles from '@/styles/Providers/SignupSteps.module.scss';

interface ServiceCategoryStepProps {
  onNext: (data: { serviceCategory: string }) => void;
  onBack: () => void;
  initialData: any;
}

const serviceCategories = [
  { id: 'massage', name: 'Massage Therapy', icon: '💆‍♀️' },
  { id: 'yoga', name: 'Yoga Instruction', icon: '🧘‍♀️' },
  { id: 'aesthetics', name: 'Aesthetics & Skincare', icon: '✨' },
  { id: 'reiki', name: 'Reiki & Energy Work', icon: '🔮' },
  { id: 'doulas', name: 'Doula Services', icon: '🤱' },
  { id: 'nutrition', name: 'Nutrition Counseling', icon: '🥗' }
];

const otherCategories = [
  'Physical Therapy',
  'Mental Health Counseling',
  'Life Coaching',
  'Fitness Training',
  'Meditation Instruction',
  'Sound Healing',
  'Craniosacral Therapy',
  'Reflexology'
];

export default function ServiceCategoryStep({ onNext, onBack, initialData }: ServiceCategoryStepProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialData.serviceCategory || '');

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategory) {
      onNext({ serviceCategory: selectedCategory });
    }
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>What's your wellness practice?</h1>
      <p className={styles.subtitle}>Select the category that best represents your services.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.categoryGrid}>
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`${styles.categoryCard} ${selectedCategory === category.id ? styles.selected : ''}`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <div className={styles.categoryIcon}>{category.icon}</div>
              <span className={styles.categoryName}>{category.name}</span>
            </button>
          ))}
        </div>

        <div className={styles.otherCategories}>
          <h3 className={styles.otherTitle}>Other categories</h3>
          <div className={styles.otherList}>
            {otherCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={`${styles.otherItem} ${selectedCategory === category ? styles.selected : ''}`}
                onClick={() => handleCategorySelect(category)}
              >
                <span>{category}</span>
                <span className={styles.arrow}>→</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button 
            type="submit" 
            className={styles.continueButton}
            disabled={!selectedCategory}
          >
            CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}
