import React from 'react';
import styles from '@/styles/Home/RecommendedProviders.module.scss';
import { FaStar } from 'react-icons/fa';

const mockProviders = [
  {
    id: 1,
    name: 'Samuel Green',
    specialty: 'Acupuncturist',
    location: 'Portland, OR',
    rating: 4.9,
    image: '/images/acupuncture.jpg',
  },
  {
    id: 2,
    name: 'Cara Rivera',
    specialty: 'Hair Stylist',
    location: 'Los Angeles, CA',
    rating: 4.8,
    image: '/images/wedding.jpg',
  },
  {
    id: 3,
    name: 'Ava Chen',
    specialty: 'Nail Technician',
    location: 'Austin, TX',
    rating: 5.0,
    image: '/images/beautician.jpg',
  },
];

const RecommendedProviders: React.FC = () => {
  return (
    <section className={styles.recommendedSection}>
      <h2>Recommended Providers</h2>
      <div className={styles.grid}>
        {mockProviders.map((provider) => (
          <div key={provider.id} className={styles.card}>
            <img src={provider.image} alt={provider.name} className={styles.image} />
            <div className={styles.info}>
              <h3>{provider.name}</h3>
              <p className={styles.specialty}>{provider.specialty}</p>
              <p className={styles.location}>{provider.location}</p>
              <div className={styles.rating}>
                <FaStar className={styles.starIcon} /> {provider.rating}
              </div>
              <button className={styles.bookButton}>Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedProviders;
