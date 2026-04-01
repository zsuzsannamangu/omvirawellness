'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SERVICE_CATEGORIES } from '@/config/categories';
import styles from '@/styles/Home/ServiceCategories.module.scss';

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
        </div>

        <div className={styles.grid}>
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={styles.categoryCard}
              onClick={() => handleCategoryClick(cat.displayName)}
            >
              <span className={styles.accentLine} aria-hidden />
              <span className={styles.labelWash} aria-hidden />
              <span className={styles.categoryTitle}>{cat.displayName}</span>
              <span className={styles.arrow} aria-hidden>
                →
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
