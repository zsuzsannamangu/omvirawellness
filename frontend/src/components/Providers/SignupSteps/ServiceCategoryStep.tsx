'use client';

import { useState, useMemo } from 'react';
import {
  FaSpa,
  FaLeaf,
  FaMagic,
  FaGem,
  FaBaby,
  FaAppleAlt,
  FaChevronRight,
  FaCheck,
} from 'react-icons/fa';
import { SERVICE_CATEGORIES } from '@/config/categories';
import styles from '@/styles/Providers/SignupSteps.module.scss';

interface ServiceCategoryStepProps {
  onNext: (data: { serviceCategory: string }) => void;
  onBack: () => void;
  initialData: { serviceCategory?: string };
}

function parseInitialCategoryIds(raw: string | undefined): string[] {
  if (!raw || !String(raw).trim()) return [];
  return String(raw)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((token) => {
      const byId = SERVICE_CATEGORIES.find((c) => c.id === token);
      if (byId) return byId.id;
      const byDisplay = SERVICE_CATEGORIES.find(
        (c) => c.displayName === token || c.name === token
      );
      return byDisplay?.id || token;
    })
    .filter((id) => SERVICE_CATEGORIES.some((c) => c.id === id));
}

const categoryIcons: { [key: string]: React.ComponentType } = {
  'private-yoga': FaLeaf,
  'yoga-therapy': FaLeaf,
  'somatic-practices': FaLeaf,
  'massage-therapy': FaSpa,
  meditation: FaLeaf,
  'reiki-energy-work': FaGem,
  'sound-healing': FaGem,
  'craniosacral-therapy': FaSpa,
  reflexology: FaSpa,
  acupuncture: FaMagic,
  'life-coaching': FaAppleAlt,
  'health-coaching': FaAppleAlt,
  breathwork: FaLeaf,
  'nutrition-counseling': FaAppleAlt,
  ayurveda: FaMagic,
  herbalist: FaMagic,
  'personal-training': FaAppleAlt,
  'doula-care': FaBaby,
  'skincare-esthetics': FaMagic,
  'hair-styling': FaMagic,
  'nail-care': FaMagic,
  makeup: FaMagic,
  'cacao-facilitation': FaGem,
};

const serviceCategoriesFeatured = SERVICE_CATEGORIES.slice(0, 6).map((cat) => ({
  id: cat.id,
  name: cat.displayName,
  icon: categoryIcons[cat.id] || FaSpa,
}));

const serviceCategoriesOther = SERVICE_CATEGORIES.slice(6).map((cat) => ({
  id: cat.id,
  name: cat.displayName,
}));

export default function ServiceCategoryStep({ onNext, onBack, initialData }: ServiceCategoryStepProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    parseInitialCategoryIds(initialData?.serviceCategory)
  );

  const toggleId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length > 0) {
      onNext({ serviceCategory: selectedIds.join(',') });
    }
  };

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>What&apos;s your wellness practice?</h1>
      <p className={styles.subtitle}>
        Select all categories that represent your services. You can choose more than one.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.categoryGrid}>
          {serviceCategoriesFeatured.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedSet.has(category.id);
            return (
              <button
                key={category.id}
                type="button"
                className={`${styles.categoryCard} ${isSelected ? styles.selected : ''}`}
                onClick={() => toggleId(category.id)}
                aria-pressed={isSelected}
              >
                {isSelected && (
                  <span className={styles.categorySelectedBadge} aria-hidden>
                    <FaCheck />
                  </span>
                )}
                <div className={styles.categoryIcon}>
                  <Icon />
                </div>
                <span className={styles.categoryName}>{category.name}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.otherCategories}>
          <h3 className={styles.otherTitle}>Other categories</h3>
          <div className={styles.otherList}>
            {serviceCategoriesOther.map((category) => {
              const isSelected = selectedSet.has(category.id);
              return (
                <button
                  key={category.id}
                  type="button"
                  className={`${styles.otherItem} ${isSelected ? styles.selected : ''}`}
                  onClick={() => toggleId(category.id)}
                  aria-pressed={isSelected}
                >
                  <span>{category.name}</span>
                  <span className={styles.otherItemRight}>
                    {isSelected ? (
                      <FaCheck className={styles.otherItemCheck} aria-hidden />
                    ) : (
                      <FaChevronRight className={styles.arrow} />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button type="submit" className={styles.continueButton} disabled={selectedIds.length === 0}>
            CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}
