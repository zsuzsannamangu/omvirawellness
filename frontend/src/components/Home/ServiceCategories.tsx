'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '@/styles/Home/ServiceCategories.module.scss';
import {
    FaChevronLeft,
    FaChevronRight,
} from 'react-icons/fa';

const categories = [
    {
        label: 'Private Yoga',
        icon: '/images/icons/yoga.png',
        description: 'Personalized one-on-one yoga sessions tailored to your unique needs, goals, and schedule in the comfort of your own space'
    },
    {
        label: 'Yoga Therapy',
        icon: '/images/icons/yogatherapy.png',
        description: 'Empowering individuals to progress toward improved health through the application of the teachings and practices of Yoga'
    },
    {
        label: 'Massage',
        icon: '/images/icons/massage.png',
        description: 'Therapeutic bodywork designed to relieve tension, reduce stress, and promote healing through various massage techniques and pressure points'
    },
    {
        label: 'Skincare',
        icon: '/images/icons/skincare.png',
        description: 'Professional facial treatments and skincare services to cleanse, nourish, and rejuvenate your skin with personalized care plans'
    },
    {
        label: 'Reiki',
        icon: '/images/icons/aromatherapy.png',
        description: 'Japanese energy healing technique that promotes relaxation, reduces stress, and encourages emotional and physical healing through gentle touch'
    },
    {
        label: 'Energy Work',
        icon: '/images/icons/power.png',
        description: 'Holistic healing practices that work with your body\'s energy systems to restore balance, clear blockages, and enhance overall well-being'
    },
    {
        label: 'Ayurveda',
        icon: '/images/icons/hot-stones.png',
        description: 'Ancient Indian system of medicine focusing on natural healing through personalized diet, lifestyle, herbal remedies, and therapeutic treatments'
    },
    {
        label: 'Acupuncture',
        icon: '/images/icons/medicine.png',
        description: 'Traditional Chinese medicine practice using fine needles to stimulate specific points on the body to promote healing and pain relief'
    },
    {
        label: 'Personal Training',
        icon: '/images/icons/training.png',
        description: 'One-on-one fitness coaching with customized workout plans, proper form instruction, and motivation to help you achieve your health goals'
    },
    {
        label: 'Doula Care',
        icon: '/images/icons/baby.png',
        description: 'Compassionate birth and postpartum support providing emotional, physical, and informational assistance during pregnancy, labor, and beyond'
    },
    {
        label: 'Hair Styling',
        icon: '/images/icons/hairdresser.png',
        description: 'Professional hair services including cuts, styling, coloring, and treatments performed by skilled stylists in your preferred location'
    },
    {
        label: 'Nail Care',
        icon: '/images/icons/cosmetic.png',
        description: 'Expert nail care services including manicures, pedicures, nail art, and treatments to keep your nails healthy and beautifully styled'
    },
    {
        label: 'Makeup',
        icon: '/images/icons/mascara.png',
        description: 'A professional applying makeup for various occasions, ranging from everyday looks to special events.'
    },
];

const ServiceCategories: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

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

    const handleCategoryClick = (category: string) => {
        router.push(`/search?service=${encodeURIComponent(category)}`);
    };

    return (
        <section id="services" className={styles.categoriesSection}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Choose your service</h2>
                    <p className={styles.subtitle}>Browse trusted wellness providers in your area.</p>
                </div>

                <div className={styles.scrollWrapper}>
                    <button className={styles.navButton} onClick={scrollLeft}>
                        <FaChevronLeft />
                    </button>

                    <div className={styles.scrollContainer} ref={scrollContainerRef}>
                        {categories.map((category, idx) => (
                            <div 
                                key={idx} 
                                className={styles.categoryCard}
                                onClick={() => handleCategoryClick(category.label)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className={styles.titleRow}>
                                    <div className={styles.imageContainer}>
                                        <Image
                                            src={category.icon}
                                            alt={category.label}
                                            width={28}
                                            height={28}
                                            className={styles.serviceIcon}
                                        />
                                    </div>
                                    <h3 className={styles.categoryTitle}>{category.label}</h3>
                                </div>
                                <p className={styles.description}>{category.description}</p>
                            </div>
                        ))}
                    </div>

                    <button className={styles.navButton} onClick={scrollRight}>
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ServiceCategories;
