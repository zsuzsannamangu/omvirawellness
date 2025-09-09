'use client';

import styles from '@/styles/Clients/Dashboard.module.scss';

interface CalendarProps {
  activeSubmenu: string;
}

export default function Calendar({ activeSubmenu }: CalendarProps) {
  const renderContent = () => {
    // Calendar only has one view, so we don't need to check activeSubmenu
    return (
      <div className={styles.calendarContent}>
        <h2 className={styles.sectionTitle}>Personal Calendar</h2>
        <div className={styles.calendarContainer}>
          <div className={styles.calendarHeader}>
            <button className={styles.calendarNav}>‹</button>
            <h3 className={styles.calendarMonth}>December 2024</h3>
            <button className={styles.calendarNav}>›</button>
          </div>
          
          <div className={styles.calendarGrid}>
            <div className={styles.calendarWeekdays}>
              <div className={styles.weekday}>Sun</div>
              <div className={styles.weekday}>Mon</div>
              <div className={styles.weekday}>Tue</div>
              <div className={styles.weekday}>Wed</div>
              <div className={styles.weekday}>Thu</div>
              <div className={styles.weekday}>Fri</div>
              <div className={styles.weekday}>Sat</div>
            </div>
            
            <div className={styles.calendarDays}>
              <div className={styles.calendarDay}>1</div>
              <div className={styles.calendarDay}>2</div>
              <div className={styles.calendarDay}>3</div>
              <div className={styles.calendarDay}>4</div>
              <div className={`${styles.calendarDay} ${styles.hasAppointment}`}>
                5
                <div className={styles.appointmentDot}></div>
              </div>
              <div className={styles.calendarDay}>6</div>
              <div className={styles.calendarDay}>7</div>
              <div className={`${styles.calendarDay} ${styles.hasAppointment}`}>
                8
                <div className={styles.appointmentDot}></div>
              </div>
              <div className={styles.calendarDay}>9</div>
              <div className={`${styles.calendarDay} ${styles.hasAppointment}`}>
                10
                <div className={styles.appointmentDot}></div>
              </div>
              <div className={styles.calendarDay}>11</div>
              <div className={styles.calendarDay}>12</div>
              <div className={styles.calendarDay}>13</div>
              <div className={styles.calendarDay}>14</div>
              <div className={`${styles.calendarDay} ${styles.hasAppointment}`}>
                15
                <div className={styles.appointmentDot}></div>
              </div>
              <div className={styles.calendarDay}>16</div>
              <div className={styles.calendarDay}>17</div>
              <div className={`${styles.calendarDay} ${styles.hasAppointment}`}>
                18
                <div className={styles.appointmentDot}></div>
              </div>
              <div className={styles.calendarDay}>19</div>
              <div className={styles.calendarDay}>20</div>
              <div className={styles.calendarDay}>21</div>
              <div className={`${styles.calendarDay} ${styles.hasAppointment}`}>
                22
                <div className={styles.appointmentDot}></div>
              </div>
              <div className={styles.calendarDay}>23</div>
              <div className={styles.calendarDay}>24</div>
              <div className={styles.calendarDay}>25</div>
              <div className={styles.calendarDay}>26</div>
              <div className={styles.calendarDay}>27</div>
              <div className={styles.calendarDay}>28</div>
              <div className={styles.calendarDay}>29</div>
              <div className={styles.calendarDay}>30</div>
              <div className={styles.calendarDay}>31</div>
            </div>
          </div>
        </div>
        
        <div className={styles.upcomingAppointments}>
          <h3 className={styles.upcomingTitle}>Upcoming This Week</h3>
          <div className={styles.appointmentList}>
            <div className={styles.appointmentItem}>
              <div className={styles.appointmentDate}>
                <span className={styles.appointmentDay}>15</span>
                <span className={styles.appointmentMonth}>Dec</span>
              </div>
              <div className={styles.appointmentDetails}>
                <h4 className={styles.appointmentTitle}>Massage Therapy</h4>
                <p className={styles.appointmentProvider}>with Sarah Johnson</p>
                <p className={styles.appointmentTime}>2:00 PM - 3:00 PM</p>
              </div>
            </div>
            
            <div className={styles.appointmentItem}>
              <div className={styles.appointmentDate}>
                <span className={styles.appointmentDay}>18</span>
                <span className={styles.appointmentMonth}>Dec</span>
              </div>
              <div className={styles.appointmentDetails}>
                <h4 className={styles.appointmentTitle}>Yoga Class</h4>
                <p className={styles.appointmentProvider}>with Mike Chen</p>
                <p className={styles.appointmentTime}>10:00 AM - 11:00 AM</p>
              </div>
            </div>
            
            <div className={styles.appointmentItem}>
              <div className={styles.appointmentDate}>
                <span className={styles.appointmentDay}>22</span>
                <span className={styles.appointmentMonth}>Dec</span>
              </div>
              <div className={styles.appointmentDetails}>
                <h4 className={styles.appointmentTitle}>Meditation Session</h4>
                <p className={styles.appointmentProvider}>with Lisa Wang</p>
                <p className={styles.appointmentTime}>7:00 PM - 8:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboardSection}>
      {renderContent()}
    </div>
  );
}
