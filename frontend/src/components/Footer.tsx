// components/Footer.tsx
import styles from "../styles/Footer.module.scss";
import Image from "next/image";
import logo from "../../public/logo.png";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <Image src={logo} alt="Omvira Wellness Logo" className={styles.logo} />
        </div>
        <div className={styles.infoSection}>
          <h2>Omvira Wellness</h2>
          <p>Portland, OR 97086</p>
          <p>www.omvirawellness.com</p>
          <p>Hello@omvirawellness.com</p>
        </div>
        <div className={styles.hoursSection}>
          <h3>Hours</h3>
          <p>Monday – Friday</p>
          <p>10am – 6pm</p>
        </div>
        <div className={styles.socialSection}>
          <h3>Follow</h3>
          <a href="https://www.facebook.com/profile.php?id=61577726068469" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://www.instagram.com/omvirawellness" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
    </footer>
  );
}
