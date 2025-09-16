'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { FaCalendarAlt } from 'react-icons/fa';
import styles from '@/styles/ProviderDetail.module.scss';

// Sample provider data
const getProviderData = (id: string) => {
  const providers: any = {
    '1': {
      id: 1,
      name: 'Sarah Chen',
      image: '/images/yoga4.jpg',
      location: 'Los Angeles',
      startingPrice: 85,
      services: ['Private Yoga', 'Yoga Therapy'],
      rating: 4.9,
      reviewCount: 127,
      bio: 'I\'ve been practicing yoga for over 15 years and teaching for 8 years. My approach combines traditional Hatha and Vinyasa styles with modern therapeutic techniques.',
      photos: [
        '/images/yoga4.jpg',
        '/images/yoga5.jpg',
        '/images/yoga6.jpg'
      ],
      serviceDetails: [
        {
          name: 'Private Yoga Session',
          duration: '60 min',
          price: 85,
          description: 'Personalized yoga session tailored to your needs and goals'
        },
        {
          name: 'Yoga Therapy',
          duration: '90 min',
          price: 120,
          description: 'Therapeutic yoga focused on healing and rehabilitation'
        }
      ],
      availability: {
        // December 2024 - Mix of available and unavailable dates
        '2024-12-20': ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'], // Available
        // '2024-12-21': unavailable (weekend)
        '2024-12-22': ['9:00 AM', '9:15 AM', '9:30 AM', '10:00 AM', '10:15 AM', '10:30 AM', '11:00 AM', '11:15 AM', '11:30 AM', '12:00 PM', '12:15 PM', '12:30 PM', '1:00 PM', '1:15 PM', '1:30 PM', '2:00 PM', '2:15 PM', '2:30 PM', '3:00 PM', '3:15 PM', '3:30 PM', '4:00 PM', '4:15 PM'], // Available
        '2024-12-23': ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'], // Available
        // '2024-12-24': unavailable (Christmas Eve)
        // '2024-12-25': unavailable (Christmas Day)
        '2024-12-26': ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'], // Available
        '2024-12-27': ['9:15 AM', '9:45 AM', '10:15 AM', '10:45 AM', '11:15 AM', '11:45 AM', '12:15 PM', '12:45 PM', '1:15 PM', '1:45 PM', '2:15 PM', '2:45 PM', '3:15 PM', '3:45 PM', '4:15 PM'], // Available
        // '2024-12-28': unavailable (weekend)
        '2024-12-29': ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'], // Available
        '2024-12-30': ['9:15 AM', '9:45 AM', '10:15 AM', '10:45 AM', '11:15 AM', '11:45 AM', '12:15 PM', '12:45 PM', '1:15 PM', '1:45 PM', '2:15 PM', '2:45 PM', '3:15 PM', '3:45 PM', '4:15 PM'], // Available
        // '2024-12-31': unavailable (New Year's Eve)
        // January 2025 - Mix of available and unavailable dates
        // '2025-01-01': unavailable (New Year's Day)
        '2025-01-02': ['9:15 AM', '9:45 AM', '10:15 AM', '10:45 AM', '11:15 AM', '11:45 AM', '12:15 PM', '12:45 PM', '1:15 PM', '1:45 PM', '2:15 PM', '2:45 PM', '3:15 PM', '3:45 PM', '4:15 PM'], // Available
        '2025-01-03': ['9:00 AM', '9:15 AM', '9:30 AM', '10:00 AM', '10:15 AM', '10:30 AM', '11:00 AM', '11:15 AM', '11:30 AM', '12:00 PM', '12:15 PM', '12:30 PM', '1:00 PM', '1:15 PM', '1:30 PM', '2:00 PM', '2:15 PM', '2:30 PM', '3:00 PM', '3:15 PM', '3:30 PM', '4:00 PM', '4:15 PM'], // Available
        // '2025-01-04': unavailable (weekend)
        // '2025-01-05': unavailable (weekend)
        '2025-01-06': ['9:00 AM', '9:15 AM', '9:30 AM', '9:45 AM', '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM', '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM', '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM', '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM', '2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM', '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM', '4:00 PM', '4:15 PM'], // Available
        '2025-01-07': ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'], // Available
        '2025-01-08': ['9:15 AM', '9:45 AM', '10:15 AM', '10:45 AM', '11:15 AM', '11:45 AM', '12:15 PM', '12:45 PM', '1:15 PM', '1:45 PM', '2:15 PM', '2:45 PM', '3:15 PM', '3:45 PM', '4:15 PM'], // Available
        '2025-01-09': ['9:00 AM', '9:15 AM', '9:30 AM', '10:00 AM', '10:15 AM', '10:30 AM', '11:00 AM', '11:15 AM', '11:30 AM', '12:00 PM', '12:15 PM', '12:30 PM', '1:00 PM', '1:15 PM', '1:30 PM', '2:00 PM', '2:15 PM', '2:30 PM', '3:00 PM', '3:15 PM', '3:30 PM', '4:00 PM', '4:15 PM'], // Available
        '2025-01-10': ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'], // Available
        // '2025-01-11': unavailable (weekend)
        // '2025-01-12': unavailable (weekend)
        '2025-01-13': ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'], // Available
        '2025-01-14': ['9:15 AM', '9:45 AM', '10:15 AM', '10:45 AM', '11:15 AM', '11:45 AM', '12:15 PM', '12:45 PM', '1:15 PM', '1:45 PM', '2:15 PM', '2:45 PM', '3:15 PM', '3:45 PM', '4:15 PM'], // Available
        '2025-01-15': ['9:00 AM', '9:15 AM', '9:30 AM', '10:00 AM', '10:15 AM', '10:30 AM', '11:00 AM', '11:15 AM', '11:30 AM', '12:00 PM', '12:15 PM', '12:30 PM', '1:00 PM', '1:15 PM', '1:30 PM', '2:00 PM', '2:15 PM', '2:30 PM', '3:00 PM', '3:15 PM', '3:30 PM', '4:00 PM', '4:15 PM'], // Available
        '2025-01-16': ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'], // Available
        '2025-01-17': ['9:15 AM', '9:45 AM', '10:15 AM', '10:45 AM', '11:15 AM', '11:45 AM', '12:15 PM', '12:45 PM', '1:15 PM', '1:45 PM', '2:15 PM', '2:45 PM', '3:15 PM', '3:45 PM', '4:15 PM'], // Available
        // '2025-01-18': unavailable (weekend)
        // '2025-01-19': unavailable (weekend)
        '2025-01-20': ['9:00 AM', '9:15 AM', '9:30 AM', '9:45 AM', '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM', '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM', '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM', '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM', '2:00 PM', '2:15 PM', '2:30 PM', '2:45 PM', '3:00 PM', '3:15 PM', '3:30 PM', '3:45 PM', '4:00 PM', '4:15 PM'], // Available
        '2025-01-21': ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'], // Available
        '2025-01-22': ['9:15 AM', '9:45 AM', '10:15 AM', '10:45 AM', '11:15 AM', '11:45 AM', '12:15 PM', '12:45 PM', '1:15 PM', '1:45 PM', '2:15 PM', '2:45 PM', '3:15 PM', '3:45 PM', '4:15 PM'], // Available
        '2025-01-23': ['9:00 AM', '9:15 AM', '9:30 AM', '10:00 AM', '10:15 AM', '10:30 AM', '11:00 AM', '11:15 AM', '11:30 AM', '12:00 PM', '12:15 PM', '12:30 PM', '1:00 PM', '1:15 PM', '1:30 PM', '2:00 PM', '2:15 PM', '2:30 PM', '3:00 PM', '3:15 PM', '3:30 PM', '4:00 PM', '4:15 PM'], // Available
        '2025-01-24': ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'], // Available
        // '2025-01-25': unavailable (weekend)
        // '2025-01-26': unavailable (weekend)
        '2025-01-27': ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'], // Available
        '2025-01-28': ['9:15 AM', '9:45 AM', '10:15 AM', '10:45 AM', '11:15 AM', '11:45 AM', '12:15 PM', '12:45 PM', '1:15 PM', '1:45 PM', '2:15 PM', '2:45 PM', '3:15 PM', '3:45 PM', '4:15 PM'], // Available
        '2025-01-29': ['9:00 AM', '9:15 AM', '9:30 AM', '10:00 AM', '10:15 AM', '10:30 AM', '11:00 AM', '11:15 AM', '11:30 AM', '12:00 PM', '12:15 PM', '12:30 PM', '1:00 PM', '1:15 PM', '1:30 PM', '2:00 PM', '2:15 PM', '2:30 PM', '3:00 PM', '3:15 PM', '3:30 PM', '4:00 PM', '4:15 PM'], // Available
        '2025-01-30': ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM'], // Available
        '2025-01-31': ['9:15 AM', '9:45 AM', '10:15 AM', '10:45 AM', '11:15 AM', '11:45 AM', '12:15 PM', '12:45 PM', '1:15 PM', '1:45 PM', '2:15 PM', '2:45 PM', '3:15 PM', '3:45 PM', '4:15 PM'] // Available
      },
      reviews: [
        {
          id: 1,
          name: 'Emily M.',
          rating: 5,
          comment: 'Sarah is an amazing yoga instructor. She helped me with my back pain and made me feel comfortable throughout the session. Highly recommended!',
          date: '2 weeks ago',
          recommends: true
        },
        {
          id: 2,
          name: 'Michael R.',
          rating: 5,
          comment: 'Professional, knowledgeable, and very patient. Sarah\'s therapeutic approach really helped me recover from my injury.',
          date: '1 month ago',
          recommends: true
        },
        {
          id: 3,
          name: 'Jessica L.',
          rating: 4,
          comment: 'Great session! Sarah is very attentive to form and safety. I felt much more flexible after just one session.',
          date: '1 month ago',
          recommends: true
        },
        {
          id: 4,
          name: 'Sarah Chen',
          rating: 5,
          comment: 'Love the personalized approach. Sarah really listens to your needs and adapts the session accordingly. My flexibility has improved so much!',
          date: '3 weeks ago',
          recommends: true
        },
        {
          id: 5,
          name: 'David K.',
          rating: 5,
          comment: 'Excellent quality instruction and very calming presence. Perfect for stress relief and building strength.',
          date: '1 week ago',
          recommends: true
        },
        {
          id: 6,
          name: 'Lisa P.',
          rating: 4,
          comment: 'Sarah\'s yoga therapy sessions are transformative. She really knows how to work with different body types and limitations.',
          date: '2 weeks ago',
          recommends: true
        },
        {
          id: 7,
          name: 'Mark T.',
          rating: 5,
          comment: 'Outstanding instructor! Sarah\'s attention to detail and ability to modify poses for my specific needs is incredible.',
          date: '4 days ago',
          recommends: true
        },
        {
          id: 8,
          name: 'Anna W.',
          rating: 5,
          comment: 'Sarah creates such a peaceful environment. Her guidance helped me find balance both physically and mentally.',
          date: '1 week ago',
          recommends: true
        }
      ]
    }
  };

  return providers[id] || providers['1'];
};

export default function ProviderDetailPage() {
  const params = useParams();
  const [provider, setProvider] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // Closed by default, opens when clicked
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 11, 1)); // December 2024

  useEffect(() => {
    if (params?.id) {
      const providerData = getProviderData(params.id as string);
      setProvider(providerData);
      if (providerData?.serviceDetails?.length > 0) {
        setSelectedService(providerData.serviceDetails[0]);
      }
    }
  }, [params?.id]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const calendarWidget = document.querySelector(`.${styles.calendarWidget}`);
      const dateInput = document.querySelector(`.${styles.dateInput}`);
      const calendarButton = document.querySelector(`.${styles.calendarButton}`);

      if (
        isCalendarOpen &&
        calendarWidget &&
        !calendarWidget.contains(target) &&
        !dateInput?.contains(target) &&
        !calendarButton?.contains(target)
      ) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  if (!provider) {
    return (
      <div className={styles.loading}>
        <div>Loading...</div>
      </div>
    );
  }

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % provider.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + provider.photos.length) % provider.photos.length);
  };

  const reviewsPerPage = 4;
  const totalReviewPages = Math.ceil(provider?.reviews?.length / reviewsPerPage) || 1;
  const currentReviews = provider?.reviews?.slice(
    (currentReviewPage - 1) * reviewsPerPage,
    currentReviewPage * reviewsPerPage
  ) || [];

  const goToReviewPage = (page: number) => {
    setCurrentReviewPage(page);
  };

  const nextReviewPage = () => {
    if (currentReviewPage < totalReviewPages) {
      setCurrentReviewPage(currentReviewPage + 1);
    }
  };

  const prevReviewPage = () => {
    if (currentReviewPage > 1) {
      setCurrentReviewPage(currentReviewPage - 1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDate || !provider?.availability) return [];
    return provider.availability[selectedDate] || [];
  };

  const handleDateChange = (dateString: string) => {
    setSelectedDate(dateString);
    setSelectedSlot(''); // Reset selected time when date changes
  };

  const getAvailableDates = () => {
    if (!provider?.availability) return [];
    return Object.keys(provider.availability).sort();
  };


  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const isDateInCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isDateAvailable = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return provider?.availability && provider.availability[dateString];
  };

  const isDateSelected = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return selectedDate === dateString;
  };

  const handleDateSelect = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    if (isDateAvailable(date)) {
      setSelectedDate(dateString);
      setSelectedSlot('');
      setIsCalendarOpen(false);
    }
  };

  const formatSelectedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.providerDetailPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/search" className={styles.backButton}>
            ← Back to Search
          </Link>
          <Link href="/" className={styles.logo}>
            Omvira Wellness
          </Link>
          <button className={styles.shareButton}>
            Share
          </button>
        </div>
      </header>

      <div className={styles.mainContent}>
        {/* Photo Gallery */}
        <div className={styles.photoSection}>
          <div className={styles.photoGallery}>
            <button className={styles.photoNav} onClick={prevPhoto}>
              ‹
            </button>
            <Image
              src={provider.photos[currentPhotoIndex]}
              alt={provider.name}
              width={800}
              height={450}
              className={styles.mainPhoto}
            />
            <button className={styles.photoNav} onClick={nextPhoto}>
              ›
            </button>
          </div>
          <div className={styles.photoThumbnails}>
            {provider.photos.map((photo: string, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentPhotoIndex(index)}
                className={`${styles.thumbnail} ${index === currentPhotoIndex ? styles.active : ''}`}
              >
                <Image
                  src={photo}
                  alt={`${provider.name} photo ${index + 1}`}
                  width={80}
                  height={60}
                  className={styles.thumbnailImage}
                />
              </button>
            ))}
          </div>
        </div>
        <div className={styles.providerMainSection}>
          <h1 className={styles.providerName}>{provider.name}</h1>
          <div className={styles.rating}>
            <span className={styles.stars}>★★★★★</span>
            <span className={styles.ratingText}>{provider.rating} ({provider.reviewCount} reviews)</span>
          </div>
          <p className={styles.providerTitle}>{provider.services.join(' • ')}</p>
          <p className={styles.providerLocation}>{provider.location}</p>
        </div>

        {/* Provider Info */}
        <div className={styles.providerInfo}>
          {/* Bio */}
          <div className={styles.bioSection}>
            <h2>About {provider.name}</h2>
            <p className={styles.bio}>{provider.bio}</p>
          </div>

          {/* Services */}
          <div className={styles.servicesSection}>
            <h2>Services</h2>
            <div className={styles.servicesList}>
              {provider.serviceDetails.map((service: any, index: number) => (
                <div
                  key={index}
                  onClick={() => setSelectedService(service)}
                  className={`${styles.serviceItem} ${selectedService?.name === service.name ? styles.selected : ''}`}
                >
                  <div className={styles.serviceInfo}>
                    <h3>{service.name}</h3>
                    <p className={styles.serviceDescription}>{service.description}</p>
                    <div className={styles.serviceMeta}>
                      <span className={styles.duration}>{service.duration}</span>
                      <span className={styles.price}>${service.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className={styles.availabilitySection}>
            <h2>Availability</h2>

            {/* Date Selection */}
            <div className={styles.dateSelection}>
              <label className={styles.dateLabel}>Date</label>
              <div className={styles.dateInputContainer}>
                <input
                  type="text"
                  value={selectedDate ? formatSelectedDate(selectedDate) : ''}
                  onClick={toggleCalendar}
                  readOnly
                  className={styles.dateInput}
                  placeholder="Select a date"
                />
                <button
                  className={styles.calendarButton}
                  onClick={toggleCalendar}
                >
                  <FaCalendarAlt />
                </button>
              </div>

              {/* Calendar Widget */}
              {isCalendarOpen && (
                <div className={styles.calendarWidget}>
                  <div className={styles.calendarHeader}>
                    <button
                      className={styles.calendarNavButton}
                      onClick={() => navigateMonth('prev')}
                    >
                      ‹
                    </button>
                    <h3 className={styles.calendarMonth}>
                      {currentMonth.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </h3>
                    <button
                      className={styles.calendarNavButton}
                      onClick={() => navigateMonth('next')}
                    >
                      ›
                    </button>
                  </div>

                  <div className={styles.calendarLegend}>
                    <div className={styles.legendItem}>
                      <div className={styles.legendDot} style={{ backgroundColor: '#10b981' }}></div>
                      <span>Available</span>
                    </div>
                    <div className={styles.legendItem}>
                      <div className={styles.legendDot} style={{ backgroundColor: '#9ca3af' }}></div>
                      <span>Unavailable</span>
                    </div>
                  </div>

                  <div className={styles.calendarGrid}>
                    <div className={styles.calendarWeekdays}>
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} className={styles.weekday}>{day}</div>
                      ))}
                    </div>
                    <div className={styles.calendarDays}>
                      {getCalendarDays().map((date, index) => (
                        <button
                          key={index}
                          onClick={() => handleDateSelect(date)}
                          className={`${styles.calendarDay} ${!isDateInCurrentMonth(date) ? styles.otherMonth : ''
                            } ${isDateAvailable(date) ? styles.available : styles.unavailable
                            } ${isDateSelected(date) ? styles.selected : ''
                            }`}
                          disabled={!isDateAvailable(date)}
                        >
                          {date.getDate()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className={styles.timeSelection}>
                <div className={styles.timeHeader}>
                  <h3>Time (PDT)</h3>
                </div>
                <div className={styles.timeSlotsGrid}>
                  {getAvailableTimeSlots().map((slot: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSlot(slot)}
                      className={`${styles.timeSlot} ${selectedSlot === slot ? styles.selected : ''}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className={styles.reviewsSection}>
            <h2>Reviews</h2>

            {/* Overall Rating Summary */}
            <div className={styles.overallRating}>
              <div className={styles.ratingSummary}>
                <div className={styles.ratingDisplay}>
                  <span className={styles.starIcon}>★</span>
                  <span className={styles.ratingNumber}>{provider.rating}</span>
                  <span className={styles.ratingOutOf}>out of 5</span>
                  <span className={styles.reviewCount}>({provider.reviewCount} reviews)</span>
                </div>
                <p className={styles.verifiedText}>All reviews are from verified clients</p>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className={styles.reviewsList}>
              {currentReviews.map((review: any) => (
                <div key={review.id} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <div className={styles.reviewRating}>
                      <div className={styles.stars}>
                        {'★'.repeat(review.rating)}
                      </div>
                      <span className={styles.ratingNumber}>{review.rating}</span>
                      <span className={styles.itemTag}>This service</span>
                      {review.recommends && (
                        <div className={styles.recommends}>
                          <span className={styles.checkmark}>✓</span>
                          <span>Recommends</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.reviewerInfo}>
                      <div className={styles.avatar}>
                        {review.name.charAt(0)}
                      </div>
                      <div className={styles.reviewerDetails}>
                        <span className={styles.reviewerName}>{review.name}</span>
                        <span className={styles.reviewDate}>{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className={styles.reviewComment}>{review.comment}</p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalReviewPages > 1 && (
              <div className={styles.reviewPagination}>
                <button
                  className={styles.paginationButton}
                  onClick={prevReviewPage}
                  disabled={currentReviewPage === 1}
                >
                  ‹
                </button>
                {Array.from({ length: totalReviewPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`${styles.paginationPage} ${currentReviewPage === page ? styles.active : ''}`}
                    onClick={() => goToReviewPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className={styles.paginationButton}
                  onClick={nextReviewPage}
                  disabled={currentReviewPage === totalReviewPages}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className={styles.bookingSidebar}>
          <div className={styles.bookingCard}>
            <div className={styles.priceInfo}>
              <span className={styles.priceLabel}>From</span>
              <span className={styles.priceAmount}>${selectedService?.price || provider.startingPrice}</span>
            </div>

            {selectedService && (
              <div className={styles.selectedService}>
                <h3>{selectedService.name}</h3>
                <p>{selectedService.duration}</p>
              </div>
            )}

            {selectedDate && selectedSlot && (
              <div className={styles.selectedTime}>
                <h4>Selected Appointment</h4>
                <p className={styles.selectedDate}>{formatDate(selectedDate)}</p>
                <p className={styles.selectedTimeSlot}>{selectedSlot}</p>
              </div>
            )}

             <Link
               href={`/search/${params?.id}/book?service=${selectedService?.name}&date=${selectedDate}&time=${selectedSlot}`}
               className={`${styles.bookButton} ${(!selectedService || !selectedDate || !selectedSlot) ? styles.disabled : ''}`}
               style={{ textDecoration: 'none', display: 'block' }}
             >
               Book Now
             </Link>

            <div className={styles.bookingInfo}>
              <p>• Free cancellation up to 24 hours before</p>
              <p>• Secure payment processing</p>
              <p>• Confirmation sent via email</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}