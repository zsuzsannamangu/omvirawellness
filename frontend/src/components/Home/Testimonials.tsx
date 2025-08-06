import React from 'react';
import styles from '@/styles/Home/Testimonials.module.scss';
import Image from 'next/image';

const testimonials = [
  {
    quote:
      "You’ve described my frustration well. I don’t love social media, marketing or low pay. I just love teaching!",
    name: 'Carla Bunting',
    title: '200hr-EYT, Portland, OR',
    image: '/images/carla.png',
  },
  {
    quote:
      "In Southeast Asia, getting a massage is as common as grabbing a coffee, but booking one is surprisingly difficult. Language barriers, scattered systems, and the lack of at-home options make it frustrating for locals and travelers alike. An app like Omvira would be a game-changer here—connecting people to wellness providers easily while supporting freelancers who want to offer their services beyond shop walls.",
    name: 'Kyle Gawley',
    title: 'Founder & CEO, usegravity.app',
    image: '/images/kyle.png',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className={styles.testimonialsSection}>
      <h2>What People Are Saying</h2>
      <div className={styles.grid}>
        {testimonials.map((t, index) => (
          <div key={index} className={styles.card}>
            {t.image && (
              <Image
                src={t.image}
                alt={t.name}
                width={100}
                height={100}
                className={styles.avatar}
              />
            )}
            <blockquote>“{t.quote}”</blockquote>
            <p className={styles.name}>— {t.name}</p>
            <p className={styles.title}>{t.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
