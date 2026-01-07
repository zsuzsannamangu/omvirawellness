'use client';

import { useState } from 'react';
import { 
  FaSpa, 
  FaLeaf, 
  FaMagic, 
  FaGem, 
  FaBaby, 
  FaAppleAlt,
  FaChevronRight 
} from 'react-icons/fa';
import { SERVICE_CATEGORIES } from '@/config/categories';
import styles from '@/styles/Providers/SignupSteps.module.scss';

interface ServiceCategoryStepProps {
  onNext: (data: { serviceCategory: string }) => void;
  onBack: () => void;
  initialData: any;
}

// Map category IDs to icons for main categories
const categoryIcons: { [key: string]: any } = {
  'private-yoga': FaLeaf,
  'yoga-therapy': FaLeaf,
  'somatic-practices': FaLeaf,
  'massage-therapy': FaSpa,
  'meditation': FaLeaf,
  'reiki-energy-work': FaGem,
  'sound-healing': FaGem,
  'craniosacral-therapy': FaSpa,
  'reflexology': FaSpa,
  'life-coaching': FaAppleAlt,
  'health-coaching': FaAppleAlt,
  'breathwork': FaLeaf,
  'nutrition-counseling': FaAppleAlt,
  'ayurveda': FaMagic,
  'herbalist': FaMagic,
  'personal-training': FaAppleAlt,
  'doula-care': FaBaby,
  'skincare-esthetics': FaMagic,
  'hair-styling': FaMagic,
  'nail-care': FaMagic,
  'makeup': FaMagic,
  'cacao-facilitation': FaGem
};

// Main featured categories (first 6)
const serviceCategories = SERVICE_CATEGORIES.slice(0, 6).map(cat => ({
  id: cat.id,
  name: cat.displayName,
  icon: categoryIcons[cat.id] || FaSpa
}));

// Other categories (remaining)
const otherCategories = SERVICE_CATEGORIES.slice(6).map(cat => cat.displayName);

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
              className={`${styles.categoryCard} ${selectedCategory === category.id || selectedCategory === category.name ? styles.selected : ''}`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <div className={styles.categoryIcon}>
                {category.icon && <category.icon />}
              </div>
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
                <FaChevronRight className={styles.arrow} />
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
