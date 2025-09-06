'use client';

import styles from '@/styles/Providers/Dashboard.module.scss';

interface CalendarProps {
  activeSubmenu: string;
}

export default function Calendar({ activeSubmenu }: CalendarProps) {
  const renderContent = () => {
    switch (activeSubmenu) {
      case 'calendar':
        return (
          <div className={styles.calendarContent}>
            <h2 className={styles.sectionTitle}>Calendar View</h2>
            <div className={styles.calendarContainer}>
              <div className={styles.calendarHeader}>
                <button className={styles.calendarNavBtn}>←</button>
                <h3 className={styles.calendarMonth}>December 2024</h3>
                <button className={styles.calendarNavBtn}>→</button>
              </div>
              <div className={styles.calendarGrid}>
                <div className={styles.calendarDayHeader}>Sun</div>
                <div className={styles.calendarDayHeader}>Mon</div>
                <div className={styles.calendarDayHeader}>Tue</div>
                <div className={styles.calendarDayHeader}>Wed</div>
                <div className={styles.calendarDayHeader}>Thu</div>
                <div className={styles.calendarDayHeader}>Fri</div>
                <div className={styles.calendarDayHeader}>Sat</div>
                
                {/* Calendar days would be generated dynamically */}
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
              </div>
            </div>
          </div>
        );

      case 'availability':
        return (
          <div className={styles.availabilityContent}>
            <h2 className={styles.sectionTitle}>Availability Settings</h2>
            <div className={styles.availabilityForm}>
              <div className={styles.formSection}>
                <h3 className={styles.subsectionTitle}>Default Hours</h3>
                <div className={styles.hoursGrid}>
                  <div className={styles.hourRow}>
                    <span className={styles.dayName}>Monday</span>
                    <input type="time" className={styles.timeInput} defaultValue="09:00" />
                    <span className={styles.timeSeparator}>to</span>
                    <input type="time" className={styles.timeInput} defaultValue="17:00" />
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked />
                      Available
                    </label>
                  </div>
                  <div className={styles.hourRow}>
                    <span className={styles.dayName}>Tuesday</span>
                    <input type="time" className={styles.timeInput} defaultValue="09:00" />
                    <span className={styles.timeSeparator}>to</span>
                    <input type="time" className={styles.timeInput} defaultValue="17:00" />
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked />
                      Available
                    </label>
                  </div>
                  <div className={styles.hourRow}>
                    <span className={styles.dayName}>Wednesday</span>
                    <input type="time" className={styles.timeInput} defaultValue="09:00" />
                    <span className={styles.timeSeparator}>to</span>
                    <input type="time" className={styles.timeInput} defaultValue="17:00" />
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked />
                      Available
                    </label>
                  </div>
                  <div className={styles.hourRow}>
                    <span className={styles.dayName}>Thursday</span>
                    <input type="time" className={styles.timeInput} defaultValue="09:00" />
                    <span className={styles.timeSeparator}>to</span>
                    <input type="time" className={styles.timeInput} defaultValue="17:00" />
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked />
                      Available
                    </label>
                  </div>
                  <div className={styles.hourRow}>
                    <span className={styles.dayName}>Friday</span>
                    <input type="time" className={styles.timeInput} defaultValue="09:00" />
                    <span className={styles.timeSeparator}>to</span>
                    <input type="time" className={styles.timeInput} defaultValue="17:00" />
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked />
                      Available
                    </label>
                  </div>
                  <div className={styles.hourRow}>
                    <span className={styles.dayName}>Saturday</span>
                    <input type="time" className={styles.timeInput} defaultValue="10:00" />
                    <span className={styles.timeSeparator}>to</span>
                    <input type="time" className={styles.timeInput} defaultValue="15:00" />
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked />
                      Available
                    </label>
                  </div>
                  <div className={styles.hourRow}>
                    <span className={styles.dayName}>Sunday</span>
                    <input type="time" className={styles.timeInput} defaultValue="10:00" />
                    <span className={styles.timeSeparator}>to</span>
                    <input type="time" className={styles.timeInput} defaultValue="15:00" />
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" />
                      Available
                    </label>
                  </div>
                </div>
              </div>
              
              <div className={styles.availabilityActions}>
                <button className={styles.saveBtn}>Save Availability</button>
              </div>
            </div>
          </div>
        );

      case 'blocked':
        return (
          <div className={styles.blockedContent}>
            <h2 className={styles.sectionTitle}>Blocked Times</h2>
            <div className={styles.blockedList}>
              <div className={styles.blockedItem}>
                <div className={styles.blockedInfo}>
                  <h4 className={styles.blockedTitle}>Personal Time</h4>
                  <p className={styles.blockedDate}>Dec 20, 2024</p>
                  <p className={styles.blockedTime}>9:00 AM - 12:00 PM</p>
                </div>
                <button className={styles.removeBtn}>Remove</button>
              </div>
              
              <div className={styles.blockedItem}>
                <div className={styles.blockedInfo}>
                  <h4 className={styles.blockedTitle}>Holiday</h4>
                  <p className={styles.blockedDate}>Dec 25, 2024</p>
                  <p className={styles.blockedTime}>All Day</p>
                </div>
                <button className={styles.removeBtn}>Remove</button>
              </div>
            </div>
            
            <button className={styles.addBlockedBtn}>Add Blocked Time</button>
          </div>
        );

      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div className={styles.dashboardSection}>
      {renderContent()}
    </div>
  );
}
