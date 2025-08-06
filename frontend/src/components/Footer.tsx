// components/Footer.tsx
import styles from "../styles/Footer.module.scss";
import Image from "next/image";
import { FaInstagram, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Newsletter Section */}
        <div className={styles.newsletterSection}>
          <h3 className={styles.newsletterTitle}>Newsletter</h3>
          <div className={styles.emailSignup}>
            <input 
              type="email" 
              placeholder="email address" 
              className={styles.emailInput}
            />
            <button className={styles.subscribeButton}>Subscribe</button>
          </div>
          {/* Social Icons */}
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
            src="/logoblack.png"
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



        {/* Get in Touch */}
        <div className={styles.getInTouchSection}>
          <h3 className={styles.getInTouchTitle}>Contact Us</h3>
          <p className={styles.email}>Hello@omvirawellness.com</p>
        </div>


      </div>
      <div className={styles.copyright}>
        <p>© 2025 Omvira Wellness. All rights reserved.</p>
      </div>
    </footer>
  );
}