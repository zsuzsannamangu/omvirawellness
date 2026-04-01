import React from 'react';
import Image from 'next/image';
import styles from '@/styles/Home/WellnessNotOneSize.module.scss';

const SECTION_BG = '/images/screenshots/arrival.png';

const WellnessNotOneSize: React.FC = () => {
  return (
    <section
      id="wellness-not-one-size"
      className={styles.section}
      aria-labelledby="wellness-not-one-size-heading"
    >
      <div className={styles.bgWrap}>
        <Image
          src={SECTION_BG}
          alt=""
          fill
          className={styles.bgImage}
          sizes="100vw"
          priority={false}
        />
        <div className={styles.bgOverlay} aria-hidden />
      </div>
      <div className={styles.inner}>
        <h2 id="wellness-not-one-size-heading" className={styles.heading}>
          Wellness isn&apos;t one size fits all
        </h2>
        <p className={styles.body}>
          Omvira was built for real life, busy schedules, evolving needs, scaled events, or something
          more personalized. Omvira is for people who want access to high quality care without
          navigating complicated systems, crowded environments, or disconnected platforms to bring wellness into your everyday life.
        </p>
      </div>
    </section>
  );
};

export default WellnessNotOneSize;
