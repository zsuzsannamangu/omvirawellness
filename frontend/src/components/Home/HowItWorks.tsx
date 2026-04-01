import React from 'react';
import styles from '@/styles/Home/HowItWorks.module.scss';
import Image from 'next/image';

const steps = [
  {
    title: 'Book in minutes',
    description: 'Browse services, check availability, and schedule in a few taps.',
    image: '/images/screenshots/growyourpractice2.png',
  },
  {
    title: 'We come to you',
    description:
      'Vetted providers at home, outdoors, or a shared space—upfront rates, no membership fees.',
    image: '/images/screenshots/massage1.png',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className={styles.howSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>How It Works</h2>
          <p className={styles.subtitle}>Simple. Seamless. Designed for real life.</p>
        </div>
        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div key={step.title} className={`${styles.step} ${index % 2 === 1 ? styles.reverse : ''}`}>
              <div className={styles.content}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              <div className={styles.imageContainer}>
                <Image
                  src={step.image}
                  alt={step.title}
                  width={500}
                  height={400}
                  className={styles.image}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
