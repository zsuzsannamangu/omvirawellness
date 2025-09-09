'use client';

import { FaGoogle, FaApple, FaCalendarAlt, FaSync, FaCheckCircle, FaClock, FaUser } from 'react-icons/fa';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface CalendarProps {
  activeSubmenu: string;
}

export default function Calendar({ activeSubmenu }: CalendarProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'overview':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Calendar Overview</h2>
            
            <div className={styles.calendarContainer}>
              <div className={styles.calendarHeader}>
                <h3 className={styles.calendarMonth}>December 2024</h3>
                <div className={styles.calendarNav}>
                  <button className={styles.calendarNavBtn}>‹</button>
                  <button className={styles.calendarNavBtn}>Today</button>
                  <button className={styles.calendarNavBtn}>›</button>
                </div>
              </div>

              <div className={styles.calendarGrid}>
                <div className={styles.calendarDayHeader}>Sun</div>
                <div className={styles.calendarDayHeader}>Mon</div>
                <div className={styles.calendarDayHeader}>Tue</div>
                <div className={styles.calendarDayHeader}>Wed</div>
                <div className={styles.calendarDayHeader}>Thu</div>
                <div className={styles.calendarDayHeader}>Fri</div>
                <div className={styles.calendarDayHeader}>Sat</div>

                <div className={styles.calendarDay}></div>
                <div className={styles.calendarDay}></div>
                <div className={styles.calendarDay}></div>
                <div className={styles.calendarDay}></div>
                <div className={styles.calendarDay}></div>
                <div className={styles.calendarDay}></div>
                <div className={styles.calendarDay}>1</div>

                <div className={styles.calendarDay}>2</div>
                <div className={styles.calendarDay}>3</div>
                <div className={styles.calendarDay}>4</div>
                <div className={styles.calendarDay}>5</div>
                <div className={styles.calendarDay}>6</div>
                <div className={styles.calendarDay}>7</div>
                <div className={styles.calendarDay}>8</div>

                <div className={styles.calendarDay}>9</div>
                <div className={styles.calendarDay}>10</div>
                <div className={styles.calendarDay}>11</div>
                <div className={styles.calendarDay}>12</div>
                <div className={styles.calendarDay}>13</div>
                <div className={styles.calendarDay}>14</div>
                <div className={styles.calendarDay}>15</div>

                <div className={styles.calendarDay}>16</div>
                <div className={styles.calendarDay}>17</div>
                <div className={styles.calendarDay}>18</div>
                <div className={styles.calendarDay}>19</div>
                <div className={styles.calendarDay}>20</div>
                <div className={styles.calendarDay}>21</div>
                <div className={styles.calendarDay}>22</div>

                <div className={styles.calendarDay}>23</div>
                <div className={styles.calendarDay}>24</div>
                <div className={styles.calendarDay}>25</div>
                <div className={styles.calendarDay}>26</div>
                <div className={styles.calendarDay}>27</div>
                <div className={styles.calendarDay}>28</div>
                <div className={styles.calendarDay}>29</div>

                <div className={styles.calendarDay}>30</div>
                <div className={styles.calendarDay}>31</div>
                <div className={styles.calendarDay}></div>
                <div className={styles.calendarDay}></div>
                <div className={styles.calendarDay}></div>
                <div className={styles.calendarDay}></div>
                <div className={styles.calendarDay}></div>
              </div>
            </div>

            <div className={styles.upcomingAppointments}>
              <h3 className={styles.upcomingTitle}>Today's Appointments</h3>
              <div className={styles.appointmentList}>
                <div className={styles.appointmentItem}>
                  <div className={styles.appointmentTime}>
                    <FaClock /> 2:00 PM - 3:00 PM
                  </div>
                  <div className={styles.appointmentDetails}>
                    <h4 className={styles.appointmentTitle}>Massage Therapy Session</h4>
                    <p className={styles.appointmentClient}>
                      <FaUser /> John Smith
                    </p>
                  </div>
                  <div className={styles.appointmentStatus}>
                    <span className={styles.statusConfirmed}>Confirmed</span>
                  </div>
                </div>

                <div className={styles.appointmentItem}>
                  <div className={styles.appointmentTime}>
                    <FaClock /> 4:00 PM - 5:00 PM
                  </div>
                  <div className={styles.appointmentDetails}>
                    <h4 className={styles.appointmentTitle}>Yoga Class</h4>
                    <p className={styles.appointmentClient}>
                      <FaUser /> Emma Wilson
                    </p>
                  </div>
                  <div className={styles.appointmentStatus}>
                    <span className={styles.statusConfirmed}>Confirmed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'sync':
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Sync with Google/Apple Calendar</h2>
            
            <div className={styles.syncSection}>
              <div className={styles.syncDescription}>
                <p>Connect your calendar to sync appointments and availability across all your devices.</p>
                <p>This will help you avoid double bookings and keep your schedule up to date.</p>
              </div>

              <div className={styles.syncOptions}>
                <div className={styles.syncCard}>
                  <div className={styles.syncIcon}>
                    <FaGoogle />
                  </div>
                  <h3 className={styles.syncTitle}>Google Calendar</h3>
                  <p className={styles.syncDescription}>Sync with your Google Calendar account</p>
                  <button className={styles.syncBtn}>
                    <FaSync /> Connect Google Calendar
                  </button>
                </div>

                <div className={styles.syncCard}>
                  <div className={styles.syncIcon}>
                    <FaApple />
                  </div>
                  <h3 className={styles.syncTitle}>Apple Calendar</h3>
                  <p className={styles.syncDescription}>Sync with your Apple Calendar account</p>
                  <button className={styles.syncBtn}>
                    <FaSync /> Connect Apple Calendar
                  </button>
                </div>
              </div>

              <div className={styles.syncStatus}>
                <h3 className={styles.syncStatusTitle}>Current Sync Status</h3>
                <div className={styles.syncStatusItem}>
                  <FaCheckCircle className={styles.statusIcon} />
                  <span>Google Calendar: Connected</span>
                  <button className={styles.disconnectBtn}>Disconnect</button>
                </div>
                <div className={styles.syncStatusItem}>
                  <div className={styles.statusIcon}>•</div>
                  <span>Apple Calendar: Not connected</span>
                </div>
              </div>

              <div className={styles.syncSettings}>
                <h3 className={styles.syncSettingsTitle}>Sync Settings</h3>
                <div className={styles.settingItem}>
                  <label className={styles.settingLabel}>
                    <input type="checkbox" defaultChecked />
                    Sync appointments automatically
                  </label>
                </div>
                <div className={styles.settingItem}>
                  <label className={styles.settingLabel}>
                    <input type="checkbox" defaultChecked />
                    Update availability in real-time
                  </label>
                </div>
                <div className={styles.settingItem}>
                  <label className={styles.settingLabel}>
                    <input type="checkbox" />
                    Sync only during business hours
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Calendar Overview</h2>
            <div className={styles.placeholderText}>
              <p>Select a calendar option from the submenu above.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.dashboardSection}>
      {renderContent()}
    </div>
  );
}
