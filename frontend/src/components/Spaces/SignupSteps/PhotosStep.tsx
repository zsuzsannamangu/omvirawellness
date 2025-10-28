'use client';

import { useState } from 'react';
import styles from '@/styles/Spaces/SignupSteps.module.scss';

interface PhotosStepProps {
  onNext: (data: { photos: string[] }) => void;
  onBack: () => void;
  initialData: any;
}

export default function PhotosStep({ onNext, onBack, initialData }: PhotosStepProps) {
  const [photos, setPhotos] = useState(initialData.photos || []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // In a real app, you would upload these files to a server
    // For now, we'll just add placeholder URLs
    const newPhotos = files.map(file => URL.createObjectURL(file));
    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ photos });
  };

  return (
    <div className={styles.stepContent}>
      <h1 className={styles.title}>Add photos of your space</h1>
      <p className={styles.subtitle}>High-quality photos help guests see what to expect.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.photoUploadArea}>
          <input
            type="file"
            id="photo-upload"
            multiple
            accept="image/*"
            onChange={handlePhotoUpload}
            className={styles.photoInput}
          />
          <label htmlFor="photo-upload" className={styles.photoUploadButton}>
            <span className={styles.uploadIcon}>📷</span>
            <span className={styles.uploadText}>Upload Photos</span>
            <span className={styles.uploadSubtext}>Click to select multiple images</span>
          </label>
        </div>

        {photos.length > 0 && (
          <div className={styles.photosGrid}>
            {photos.map((photo, index) => (
              <div key={index} className={styles.photoItem}>
                <img src={photo} alt={`Space photo ${index + 1}`} className={styles.photoImage} />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                  className={styles.removePhotoButton}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.photoNote}>
          <p className={styles.noteText}>
            💡 Add at least 3-5 photos showing different angles of your space. 
            Good lighting and clean spaces attract more bookings.
          </p>
        </div>
        
        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button type="submit" className={styles.continueButton}>
            CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}