'use client';

import React from 'react';
import Image from 'next/image';
import styles from '@/styles/PhotoGallery.module.scss';

interface PhotoGalleryProps {
  images: string[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ images }) => {
  return (
    <section className={styles.photoGallery}>
      <div className={styles.galleryGrid}>
        {images.map((src, index) => (
          <div key={index} className={styles.galleryItem}>
            <Image
              src={src}
              alt={`Gallery image ${index + 1}`}
              width={300}
              height={400}
              className={styles.galleryImage}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotoGallery;

