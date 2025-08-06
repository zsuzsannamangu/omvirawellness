import React from 'react';
import styles from '@/styles/Home/Hero.module.scss';

const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <h1 className={styles.title}>Be bold</h1>
        <p className={styles.subtitle}>
          Discover and book yoga & wellness professionals near you
        </p>
        <input
          type="text"
          placeholder="Search services or providers"
          className={styles.searchInput}
        />
      </div>
    </section>
  );
};

export default Hero;
