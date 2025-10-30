'use client';

import React from 'react';
import Link from 'next/link';
import { FaTimes } from 'react-icons/fa';
import styles from '@/styles/FavoriteAuthModal.module.scss';

interface FavoriteAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FavoriteAuthModal({ isOpen, onClose }: FavoriteAuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
        <div className={styles.modalBody}>
          <h2 className={styles.modalTitle}>Sign In to Save Favorites</h2>
          <p className={styles.modalText}>
            Create an account or sign in to save your favorite providers and easily access them later.
          </p>
          <div className={styles.modalActions}>
            <Link href="/signup" className={styles.primaryButton}>
              Register Now
            </Link>
            <Link href="/login" className={styles.secondaryButton}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

