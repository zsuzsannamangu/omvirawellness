import React from 'react';
import styles from '@/styles/Home/HowItWorks.module.scss';
import { FaSearchLocation, FaCalendarCheck, FaSmile } from 'react-icons/fa';

const steps = [
  {
    icon: <FaSearchLocation />,
    title: '1. Discover Providers',
    description: 'Browse local, verified wellness professionals with availability, pricing, and reviews up front.',
  },
  {
    icon: <FaCalendarCheck />,
    title: '2. Book Instantly',
    description: 'Choose your time and location — whether at home, a retreat, or online. Book in seconds.',
  },
  {
    icon: <FaSmile />,
    title: '3. Relax & Recharge',
    description: 'Relax, restore, and grow with trusted care. Rate your experience to help others choose mindfully.',
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section className={styles.howSection}>
      <h2>How It Works</h2>
      <div className={styles.stepsContainer}>
        {steps.map((step, index) => (
          <div key={index} className={styles.step}>
            <div className={styles.icon}>{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
