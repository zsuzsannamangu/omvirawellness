// components/Footer.tsx
import styles from "../styles/Footer.module.scss";
import Image from "next/image";
import { FaInstagram, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.socialSection}>
          <div className={styles.socialIcons}>
            <a href="https://www.instagram.com/omvirawellness" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61577726068469" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <FaFacebook />
            </a>
          </div>
        </div>

        {/* Central Logo */}
        <div className={styles.logoSection}>
          <Image
            src="/Omvira_logo_circle.png"
            alt="Omvira Wellness Logo"
            width={180}
            height={180}
            className={styles.logo}
          />
        </div>

        {/* Contact Section */}
        <div className={styles.contactSection}>
          <h3 className={styles.contactTitle}>Location</h3>
          <div className={styles.locationInfo}>
            <p>Portland, OR 97086</p>
          </div>
        </div>



        <div className={styles.getInTouchSection}>
          <a
            href="mailto:hello@omvirawellness.com"
            className={styles.contactButton}
          >
            Contact Us
          </a>
        </div>


      </div>
      <div className={styles.copyright}>
        <p>© 2025 Omvira Wellness. All rights reserved.</p>
      </div>
    </footer>
  );
}