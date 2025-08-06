import React from 'react';
import styles from '@/styles/Home/Hero.module.scss';

const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <h1 className={styles.title}>Hello, Wellness Has Arrived.</h1>
        <p className={styles.subtitle}>
        A platform that connects you to independent wellness, beauty, and fitness professionals - anytime, anywhere.  
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
