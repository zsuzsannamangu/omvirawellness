'use client';

import React, { useRef } from 'react';
import styles from '@/styles/Home/RecommendedProviders.module.scss';
import { FaStar, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
  {
    id: 4,
    name: 'Maya Patel',
    specialty: 'Yoga Therapist',
    location: 'Seattle, WA',
    rating: 4.9,
    image: '/images/smile3.jpg',
  },
  {
    id: 5,
    name: 'Jordan Kim',
    specialty: 'Hair Stylist',
    location: 'Denver, CO',
    rating: 4.7,
    image: '/images/hairperson.jpg',
  },
  {
    id: 6,
    name: 'Isabella Torres',
    specialty: 'Massage Therapist',
    location: 'Miami, FL',
    rating: 4.8,
    image: '/images/massage.jpg',
  },
  {
    id: 7,
    name: 'Alex Thompson',
    specialty: 'Yoga Instructor',
    location: 'San Francisco, CA',
    rating: 4.9,
    image: '/images/yoga7.jpg',
  },
  {
    id: 8,
    name: 'Luna Rodriguez',
    specialty: 'Ayurvedic Practitioner',
    location: 'Phoenix, AZ',
    rating: 5.0,
    image: '/images/massagestones.jpg',
  },
  {
    id: 9,
    name: 'Ethan Davis',
    specialty: 'Barber',
    location: 'Chicago, IL',
    rating: 4.8,
    image: '/images/barber.jpg',
  },
];

const RecommendedProviders: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.recommendedSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Recommended Providers</h2>
          <p className={styles.subtitle}>Connect with top-rated wellness professionals in your area.</p>
        </div>
        
        <div className={styles.scrollWrapper}>
          <button className={styles.navButton} onClick={scrollLeft}>
            <FaChevronLeft />
          </button>
          
          <div className={styles.grid} ref={scrollContainerRef}>
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
            
            {/* See All Providers Card */}
            <div className={styles.seeAllCard}>
              <div className={styles.seeAllContent}>
                <FaSearch className={styles.seeAllIcon} />
                <h3>See all providers...</h3>
                <p>Explore hundreds more wellness professionals</p>
              </div>
            </div>
          </div>
          
          <button className={styles.navButton} onClick={scrollRight}>
            <FaChevronRight />
          </button>
        </div>
        
        <div className={styles.moreProvidersSection}>
          <button className={styles.exploreButton}>
            <FaSearch className={styles.exploreIcon} />
            See all providers...
          </button>
        </div>
      </div>
    </section>
  );
};

export default RecommendedProviders;
