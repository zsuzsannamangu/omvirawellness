'use client';

import { useState } from 'react';
import styles from '@/styles/Providers/SignupSteps.module.scss';

interface StaffMembersStepProps {
  onNext: (data: { staffMembers: any[] }) => void;
  onBack: () => void;
  initialData: any;
}

export default function StaffMembersStep({ onNext, onBack, initialData }: StaffMembersStepProps) {
  const [staffMembers, setStaffMembers] = useState(initialData.staffMembers || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'staff',
    phone: ''
  });

  const handleAddMember = () => {
    if (newMember.name && newMember.email) {
      setStaffMembers([...staffMembers, { ...newMember, id: Date.now() }]);
      setNewMember({
        name: '',
        email: '',
        role: 'staff',
        phone: ''
      });
      setShowAddForm(false);
    }
  };

  const handleRemoveMember = (id: number) => {
    setStaffMembers(staffMembers.filter(member => member.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ staffMembers });
  };

  return (
    <div className={styles.stepContainer}>
      <h1 className={styles.title}>Do you have team members?</h1>
      <p className={styles.subtitle}>Add your wellness team members. You can complete their profiles and assign services later.</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Current User (Owner) */}
        <div className={styles.ownerSection}>
          <div className={styles.ownerCard}>
            <div className={styles.ownerInfo}>
              <h4 className={styles.ownerName}>You (Owner)</h4>
              <p className={styles.ownerRole}>Practice Owner</p>
            </div>
            <div className={styles.ownerBadge}>
              <span className={styles.badgeText}>Primary Account</span>
            </div>
          </div>
        </div>

        {/* Staff Members List */}
        <div className={styles.staffList}>
          {staffMembers.map((member: any) => (
            <div key={member.id} className={styles.staffItem}>
              <div className={styles.staffInfo}>
                <h4 className={styles.staffName}>{member.name}</h4>
                <p className={styles.staffDetails}>
                  {member.email} • {member.role === 'staff' ? 'Team Member' : 'Manager'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveMember(member.id)}
                className={styles.removeButton}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Add Staff Form */}
        {showAddForm ? (
          <div className={styles.addStaffForm}>
            <h3 className={styles.addStaffTitle}>Add Team Member</h3>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>FULL NAME</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className={styles.textInput}
                  placeholder="Enter full name"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  className={styles.textInput}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className={styles.addStaffButtons}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddMember}
                className={styles.addButton}
                disabled={!newMember.name || !newMember.email}
              >
                Add Member
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className={styles.addStaffButton}
          >
            <span className={styles.plusIcon}>+</span>
            Add Team Member
          </button>
        )}

        <div className={styles.staffNote}>
          <p className={styles.noteText}>
            💡 <strong>Note:</strong> Team members will receive an invitation to join your practice. You can manage their permissions and services in your provider dashboard.
          </p>
        </div>
        
        <div className={styles.buttonContainer}>
          <button type="button" onClick={onBack} className={styles.backButton}>
            Back
          </button>
          <button type="submit" className={styles.continueButton}>
            CONTINUE
          </button>
        </div>
      </form>
    </div>
  );
}
