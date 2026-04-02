import React from 'react';
import styles from '@/styles/Home/HowItWorks.module.scss';
import Image from 'next/image';

type StepCopy = { title: string; description: string };

type Row = {
  image: string;
  imageAlt: string;
  reverse: boolean;
  steps: [StepCopy, StepCopy];
};

const rows: Row[] = [
  {
    image: '/images/screenshots/growyourpractice2.png',
    imageAlt: 'Scheduling and booking wellness services on a device',
    reverse: false,
    steps: [
      {
        title: 'Book in Minutes',
        description: 'Browse services, check availability, and schedule instantly.',
      },
      {
        title: 'Trusted Providers',
        description: 'Every provider is vetted for quality professionalism and alignment.',
      },
    ],
  },
  {
    image: '/images/screenshots/how-it-works-we-come-to-you.png',
    imageAlt: 'Wellness provider walking outdoors with a portable massage table ready for your location',
    reverse: true,
    steps: [
      {
        title: 'We Come to You',
        description: 'At home, outdoors or a shared space. Your choice.',
      },
      {
        title: 'Clear Pricing',
        description: 'Zero dollar membership fees. No surprises, just honest upfront rates.',
      },
    ],
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className={styles.howSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.kicker}>From search to session</span>
          <h2 className={styles.title}>How It Works</h2>
          <p className={styles.subtitle}>Simple. Seamless. Designed for real life.</p>
        </div>
        <div className={styles.stepsContainer}>
          {rows.map((row, rowIndex) => (
            <article
              key={row.image}
              className={`${styles.stepPanel} ${row.reverse ? styles.panelReverse : ''} ${rowIndex % 2 === 1 ? styles.panelTintB : styles.panelTintA}`}
            >
              <div className={styles.panelInner}>
                <span className={styles.panelWatermark} aria-hidden>
                  {String(rowIndex + 1).padStart(2, '0')}
                </span>
                <div className={styles.contentStack}>
                  {row.steps.map((step, i) => (
                    <div key={step.title} className={styles.stepBlock}>
                      {i > 0 && <div className={styles.stepDivider} aria-hidden />}
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  ))}
                </div>
                <figure className={styles.figure}>
                  <div className={styles.imageFrame}>
                    <Image
                      src={row.image}
                      alt={row.imageAlt}
                      width={360}
                      height={288}
                      className={row.reverse ? `${styles.image} ${styles.imageLandscape}` : styles.image}
                      sizes="(max-width: 768px) 72vw, 280px"
                    />
                  </div>
                </figure>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
