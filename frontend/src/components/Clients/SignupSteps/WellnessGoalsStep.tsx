'use client';

import { useState } from 'react';
import styles from '@/styles/Clients/SignupSteps.module.scss';

interface WellnessGoalsStepProps {
  onNext: (data: { wellnessGoals: any }) => void;
  onBack: () => void;
  initialData: any;
}

const wellnessGoals = [
  { id: 'stress-relief', name: 'Stress Relief', description: 'Reduce stress and anxiety' },
  { id: 'pain-management', name: 'Pain Management', description: 'Manage chronic or acute pain' },
  { id: 'flexibility', name: 'Flexibility', description: 'Improve mobility and flexibility' },
  { id: 'strength', name: 'Strength Building', description: 'Build physical strength' },
  { id: 'mental-health', name: 'Mental Health', description: 'Support mental wellbeing' },
  { id: 'recovery', name: 'Recovery', description: 'Recover from injury or surgery' },
  { id: 'prevention', name: 'Prevention', description: 'Prevent future health issues' },
  { id: 'relaxation', name: 'Relaxation', description: 'General relaxation and self-care' },
  { id: 'sleep', name: 'Better Sleep', description: 'Improve sleep quality' },
  { id: 'energy', name: 'Energy Boost', description: 'Increase energy levels' }
];

export default function WellnessGoalsStep({ onNext, onBack, initialData }: WellnessGoalsStepProps) {
  const [selectedGoals, setSelectedGoals] = useState(initialData.wellnessGoals?.selectedGoals || []);
  const [otherGoal, setOtherGoal] = useState(initialData.wellnessGoals?.otherGoal || '');

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
        onNext({
      wellnessGoals: {
        selectedGoals,
        otherGoal
      }
    });
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>What are your wellness goals?</h1>
      <p className={styles.subtitle}>Select all that apply to help us match you with the right providers.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.goalsGrid}>
          {wellnessGoals.map((goal) => (
            <label key={goal.id} className={styles.goalItem}>
              <input
                type="checkbox"
                checked={selectedGoals.includes(goal.id)}
                onChange={() => handleGoalToggle(goal.id)}
                className={styles.goalCheckbox}
              />
              <div className={styles.goalContent}>
                <span className={styles.goalName}>{goal.name}</span>
                <span className={styles.goalDescription}>{goal.description}</span>
              </div>
            </label>
          ))}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>OTHER GOALS (Optional)</label>
          <textarea
            value={otherGoal}
            onChange={(e) => setOtherGoal(e.target.value)}
            className={styles.textArea}
            placeholder="Tell us about any other wellness goals you have..."
            rows={3}
          />
        </div>

        
        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button 
            type="submit" 
            className={styles.continueButton}
            disabled={false}
          >
            CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}
