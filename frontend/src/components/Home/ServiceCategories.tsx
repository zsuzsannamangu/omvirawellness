'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SERVICE_CATEGORIES } from '@/config/categories';
import styles from '@/styles/Home/ServiceCategories.module.scss';

// Map category IDs to icon paths (for homepage display)
const categoryIcons: { [key: string]: string } = {
  'private-yoga': '/images/icons/yoga.png',
  'yoga-therapy': '/images/icons/yoga.png',
  'somatic-practices': '/images/icons/yoga.png',
  'massage-therapy': '/images/icons/massage.png',
  meditation: '/images/icons/yoga.png',
  'reiki-energy-work': '/images/icons/aromatherapy.png',
  'sound-healing': '/images/icons/aromatherapy.png',
  'craniosacral-therapy': '/images/icons/massage.png',
  reflexology: '/images/icons/massage.png',
  'life-coaching': '/images/icons/training.png',
  'health-coaching': '/images/icons/training.png',
  breathwork: '/images/icons/yoga.png',
  'nutrition-counseling': '/images/icons/training.png',
  ayurveda: '/images/icons/hot-stones.png',
  herbalist: '/images/icons/medicine.png',
  'personal-training': '/images/icons/training.png',
  'doula-care': '/images/icons/baby.png',
  'skincare-esthetics': '/images/icons/skincare.png',
  'hair-styling': '/images/icons/hairdresser.png',
  'nail-care': '/images/icons/cosmetic.png',
  makeup: '/images/icons/mascara.png',
  'cacao-facilitation': '/images/icons/aromatherapy.png',
};

const categories = SERVICE_CATEGORIES.map((cat) => ({
  label: cat.displayName,
  icon: categoryIcons[cat.id] || '/images/icons/yoga.png',
  description: cat.description || '',
}));

const ServiceCategories: React.FC = () => {
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    router.push(`/search?service=${encodeURIComponent(category)}`);
  };

  return (
    <section id="services" className={styles.categoriesSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Popular Services</h2>
          <p className={styles.subtitle}>Browse trusted wellness providers in your area.</p>
        </div>

        <div className={styles.grid}>
          {categories.map((category, idx) => (
            <button
              key={idx}
              type="button"
              className={styles.categoryCard}
              onClick={() => handleCategoryClick(category.label)}
            >
              <div className={styles.titleRow}>
                <div className={styles.imageContainer}>
                  <Image
                    src={category.icon}
                    alt=""
                    width={28}
                    height={28}
                    className={styles.serviceIcon}
                    aria-hidden
                  />
                </div>
                <h3 className={styles.categoryTitle}>{category.label}</h3>
              </div>
              <p className={styles.description}>{category.description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
