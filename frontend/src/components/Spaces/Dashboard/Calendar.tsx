'use client';

import { FaCalendarAlt, FaClock, FaUser, FaDollarSign, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import styles from '@/styles/Spaces/Dashboard.module.scss';

interface CalendarProps {
  activeSubmenu: string;
}

export default function Calendar({ activeSubmenu }: CalendarProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'calendar':
        return (
          <div className={styles.dashboardSection}>
            <div className={styles.calendarContainer}>
              <div className={styles.calendarPlaceholder}>
                <div className={styles.calendarHeader}>
                  <h3>December 2024</h3>
                </div>
                <div className={styles.calendarGrid}>
                  <div className={styles.calendarDay}>Sun</div>
                  <div className={styles.calendarDay}>Mon</div>
                  <div className={styles.calendarDay}>Tue</div>
                  <div className={styles.calendarDay}>Wed</div>
                  <div className={styles.calendarDay}>Thu</div>
                  <div className={styles.calendarDay}>Fri</div>
                  <div className={styles.calendarDay}>Sat</div>
                  
                  <div className={styles.calendarDate}>1</div>
                  <div className={styles.calendarDate}>2</div>
                  <div className={styles.calendarDate}>3</div>
                  <div className={styles.calendarDate}>4</div>
                  <div className={styles.calendarDate}>5</div>
                  <div className={styles.calendarDate}>6</div>
                  <div className={styles.calendarDate}>7</div>
                  
                  <div className={styles.calendarDate}>8</div>
                  <div className={styles.calendarDate}>9</div>
                  <div className={styles.calendarDate}>10</div>
                  <div className={styles.calendarDate}>11</div>
                  <div className={styles.calendarDate}>12</div>
                  <div className={styles.calendarDate}>13</div>
                  <div className={styles.calendarDate}>14</div>
                  
                  <div className={styles.calendarDate}>15</div>
                  <div className={styles.calendarDate}>16</div>
                  <div className={styles.calendarDate}>17</div>
                  <div className={styles.calendarDate}>18</div>
                  <div className={styles.calendarDate}>19</div>
                  <div className={`${styles.calendarDate} ${styles.booked}`}>20</div>
                  <div className={styles.calendarDate}>21</div>
                  
                  <div className={styles.calendarDate}>22</div>
                  <div className={styles.calendarDate}>23</div>
                  <div className={styles.calendarDate}>24</div>
                  <div className={`${styles.calendarDate} ${styles.requested}`}>25</div>
                  <div className={styles.calendarDate}>26</div>
                  <div className={styles.calendarDate}>27</div>
                  <div className={`${styles.calendarDate} ${styles.booked}`}>28</div>
                  
                  <div className={styles.calendarDate}>29</div>
                  <div className={styles.calendarDate}>30</div>
                  <div className={styles.calendarDate}>31</div>
                  <div className={styles.calendarDate}></div>
                  <div className={styles.calendarDate}></div>
                  <div className={styles.calendarDate}></div>
                  <div className={styles.calendarDate}></div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Calendar View</h2>
            <div className={styles.placeholderText}>
              <p>View your space bookings and availability in calendar format.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.content}>
      {renderContent()}
    </div>
  );
}