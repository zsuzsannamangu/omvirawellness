import React from 'react';
import styles from '@/styles/Home/Testimonials.module.scss';
import Image from 'next/image';

const testimonials = [
    {
        quote:
            "You described my frustration well. I don't love social media. I don't love marketing and I definitely don't love the low pay. I just love teaching",
        name: 'Carla Bunting',
        title: '200hr-EYT, Lake Oswego, Or',
    },
    {
        quote:
            "In Southeast Asia, getting a massage is as common as grabbing coffee—but booking one is surprisingly hard. Omvira would be a game-changer.",
        name: 'Kyle Gawley',
        title: 'CEO, usegravity.app',
    },
];

const Testimonials: React.FC = () => {
    return (
        <section className={styles.testimonialsSection}>
            <div className={styles.container}>
                {testimonials.map((t, index) => (
                    <div key={index} className={styles.testimonial}>
                        <blockquote className={styles.quote}>
                            "{t.quote}"
                        </blockquote>
                        <div className={styles.author}>
                            <p className={styles.name}>{t.name}, {t.title}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
