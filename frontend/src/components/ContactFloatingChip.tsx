import React from 'react';
import { FaEnvelope } from 'react-icons/fa';
import styles from '@/styles/ContactFloatingChip.module.scss';

const ContactFloatingChip: React.FC = () => {
  return (
    <a
      href="mailto:hello@omvirawellness.com"
      className={styles.chip}
      aria-label="Contact us — email hello@omvirawellness.com"
    >
      <FaEnvelope className={styles.icon} aria-hidden />
      <span className={styles.label}>Contact us</span>
    </a>
  );
};

export default ContactFloatingChip;
