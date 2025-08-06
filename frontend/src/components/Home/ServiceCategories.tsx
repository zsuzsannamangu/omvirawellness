import React from 'react';
import styles from '@/styles/Home/ServiceCategories.module.scss';
import {
    FaSpa,
    FaDumbbell,
    FaUserNurse,
    FaHeartbeat,
    FaHandsHelping,
    FaLeaf,
    FaHandHoldingWater,
    FaCut,
    FaWind,
    FaHands,
    FaYinYang,
    FaStarAndCrescent,
  } from 'react-icons/fa';
  import { GiLotus, GiHeartInside } from 'react-icons/gi';
  import { MdSelfImprovement } from 'react-icons/md';

  const categories = [
    { label: 'Yoga', icon: <GiLotus /> },
    { label: 'Yoga Therapy', icon: <MdSelfImprovement /> },
    { label: 'Massage', icon: <FaHandsHelping /> },
    { label: 'Skincare', icon: <FaSpa /> },
    { label: 'Facials', icon: <FaHandHoldingWater /> },
    { label: 'Somatic Therapy', icon: <GiHeartInside /> },
    { label: 'Reiki', icon: <FaStarAndCrescent /> },
    { label: 'Energy Work', icon: <FaHeartbeat /> },
    { label: 'Ayurveda', icon: <FaLeaf /> },
    { label: 'Acupuncture', icon: <FaYinYang /> },
    { label: 'Personal Training', icon: <FaDumbbell /> },
    { label: 'Doula Care', icon: <FaUserNurse /> },
    { label: 'Hair Styling', icon: <FaCut /> },
    { label: 'Barber', icon: <FaCut /> },
    { label: 'Nail Technician', icon: <FaHands /> },
  ];

const ServiceCategories: React.FC = () => {
  return (
    <section className={styles.categoriesSection}>
      <div className={styles.scrollContainer}>
        {categories.map((category, idx) => (
          <button key={idx} className={styles.categoryPill}>
            <span className={styles.icon}>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ServiceCategories;
