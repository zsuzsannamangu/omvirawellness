import React from 'react';
import styles from '@/styles/Home/HowItWorks.module.scss';
import Image from 'next/image';

const steps = [
  {
    title: 'Browse verified providers with real-time availability and transparent pricing',
    description: 'Discover local wellness professionals who are vetted, trusted, and ready to serve you with upfront pricing and instant availability.',
    image: '/images/laptop.jpg',
  },
  {
    title: 'Book on-demand or in advance for wellness services near you',
    description: 'Schedule your wellness session exactly when you need it - whether it\'s a last-minute massage or a planned yoga retreat.',
    image: '/images/computer2.jpg',
  },
  {
    title: 'Curate your own experience — solo or with friends, for daily care or special events',
    description: 'Customize your wellness journey whether you\'re treating yourself, planning a group session, or organizing a special celebration.',
    image: '/images/spa.jpg',
  },
  {
    title: 'Wellness that travels — to your home, retreat, hotel, or workplace',
    description: 'Enjoy professional wellness services wherever you are most comfortable, bringing the spa experience directly to you.',
    image: '/images/girl-hair.jpg',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className={styles.howSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>How It Works</h2>
          <p className={styles.subtitle}>Simple steps to wellness at your fingertips.</p>
        </div>
        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div key={index} className={`${styles.step} ${index % 2 === 1 ? styles.reverse : ''}`}>
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
