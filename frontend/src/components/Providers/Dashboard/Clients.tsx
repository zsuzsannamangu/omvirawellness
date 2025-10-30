'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FaEnvelope, FaCalendarAlt, FaStickyNote, FaTimes } from 'react-icons/fa';
import styles from '@/styles/Providers/Dashboard.module.scss';

interface ClientsProps {
  activeSubmenu: string;
}

interface Client {
  client_profile_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  pronoun: string;
  date_of_birth: string;
  wellness_goals: string;
  city: string;
  state: string;
}

interface ClientNote {
  note: string;
  created_at: string;
  updated_at: string;
}

export default function Clients({ activeSubmenu }: ClientsProps) {
  const params = useParams();
  const userId = params.userId as string;
  
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<{ [clientId: string]: ClientNote }>({});
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId) {
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:4000/api/providers/${userId}/clients`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setClients(data);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !userId) return;

        const response = await fetch(`http://localhost:4000/api/providers/${userId}/clients/notes`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setNotes(data.notes || {});
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    if (userId && activeSubmenu === 'directory') {
      fetchClients();
      fetchNotes();
    }
    
    if (userId && activeSubmenu === 'notes') {
      fetchNotes();
      fetchClients(); // Need clients to display names
    }
  }, [userId, activeSubmenu]);

  const formatDateOfBirth = (dob: string | null) => {
    if (!dob) return 'N/A';
    try {
      const date = new Date(dob);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
      });
    } catch (e) {
      return dob;
    }
  };

  const formatWellnessGoals = (goals: string | null) => {
    if (!goals) return 'N/A';
    try {
      // If it's a JSON string, parse it
      if (typeof goals === 'string' && goals.startsWith('[')) {
        const parsed = JSON.parse(goals);
        if (Array.isArray(parsed)) {
          return parsed.join(', ');
        }
      }
      // If it's already an array
      if (Array.isArray(goals)) {
        return goals.join(', ');
      }
      return goals;
    } catch (e) {
      return goals;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleMessage = (e: React.MouseEvent, client: Client) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement message functionality
    console.log('Message client:', client);
  };

  const handleAddAppointment = (e: React.MouseEvent, client: Client) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement add appointment functionality
    console.log('Add appointment for client:', client);
  };

  const handleAddNote = (e: React.MouseEvent, client: Client) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedClient(client);
    // Load existing note if any
    const existingNote = notes[client.client_profile_id];
    setNoteText(existingNote?.note || '');
    setShowNoteModal(true);
  };

  const handleSaveNote = async () => {
    if (!selectedClient || !noteText.trim()) return;
    
    setSavingNote(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(
        `http://localhost:4000/api/providers/${userId}/clients/${selectedClient.client_profile_id}/notes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ note: noteText })
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || {});
        setShowNoteModal(false);
        setSelectedClient(null);
        setNoteText('');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to save note: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  const handleCloseModal = () => {
    setShowNoteModal(false);
    setSelectedClient(null);
    setNoteText('');
  };

  const renderContent = () => {
    switch (activeSubmenu) {
      case 'directory':
        if (loading) {
          return (
            <div className={styles.clientsContent}>
              <h2 className={styles.sectionTitle}>Clients</h2>
              <div className={styles.placeholderText}>
                <p>Loading clients...</p>
              </div>
            </div>
          );
        }

        if (clients.length === 0) {
          return (
            <div className={styles.clientsContent}>
              <h2 className={styles.sectionTitle}>Clients</h2>
              <div className={styles.placeholderText}>
                <p>No clients yet.</p>
              </div>
            </div>
          );
        }

        return (
          <div className={styles.clientsContent}>
            <h2 className={styles.sectionTitle}>Clients</h2>
            <div className={styles.bookingsTableWrapper}>
              <table className={styles.bookingsTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Pronoun</th>
                    <th>DOB</th>
                    <th>Goals</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client, index) => (
                    <tr key={client.client_profile_id}>
                      <td>{index + 1}</td>
                      <td>{client.first_name} {client.last_name}</td>
                      <td>{client.phone_number || 'N/A'}</td>
                      <td>{client.email}</td>
                      <td>{client.pronoun || 'N/A'}</td>
                      <td>{formatDateOfBirth(client.date_of_birth)}</td>
                      <td>{formatWellnessGoals(client.wellness_goals)}</td>
                      <td>
                        {client.city && client.state 
                          ? `${client.city}, ${client.state}`
                          : client.city || client.state || 'N/A'}
                      </td>
                      <td>
                        <div className={styles.clientActions}>
                          <button 
                            type="button"
                            className={`${styles.actionButton} ${styles.messageButton}`}
                            onClick={(e) => handleMessage(e, client)}
                          >
                            <FaEnvelope />
                          </button>
                          <button 
                            type="button"
                            className={`${styles.actionButton} ${styles.appointmentButton}`}
                            onClick={(e) => handleAddAppointment(e, client)}
                          >
                            <FaCalendarAlt />
                          </button>
                          <button 
                            type="button"
                            className={`${styles.actionButton} ${styles.noteButton}`}
                            onClick={(e) => handleAddNote(e, client)}
                          >
                            <FaStickyNote />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Note Modal */}
            {showNoteModal && selectedClient && (
              <div className={styles.modalOverlay} onClick={handleCloseModal}>
                <div className={styles.noteModal} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalHeader}>
                    <h3>Add Note for {selectedClient.first_name} {selectedClient.last_name}</h3>
                    <button 
                      type="button"
                      className={styles.closeButton}
                      onClick={handleCloseModal}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className={styles.modalBody}>
                    <textarea
                      className={styles.noteTextarea}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Your note..."
                      rows={12}
                    />
                  </div>
                  <div className={styles.modalFooter}>
                    <button 
                      type="button"
                      className={styles.cancelBtn}
                      onClick={handleCloseModal}
                      disabled={savingNote}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      className={styles.saveBtn}
                      onClick={handleSaveNote}
                      disabled={savingNote || !noteText.trim()}
                    >
                      {savingNote ? 'Saving...' : 'Save Note'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'notes':
        const clientsWithNotes = clients.filter(client => 
          notes[client.client_profile_id]
        );

        if (loading) {
          return (
            <div className={styles.notesContent}>
              <h2 className={styles.sectionTitle}>Notes & Preferences</h2>
              <div className={styles.placeholderText}>
                <p>Loading notes...</p>
              </div>
            </div>
          );
        }

        if (clientsWithNotes.length === 0) {
          return (
            <div className={styles.notesContent}>
              <h2 className={styles.sectionTitle}>Notes & Preferences</h2>
              <div className={styles.placeholderText}>
                <p>No notes or preferences saved yet.</p>
              </div>
            </div>
          );
        }

        return (
          <div className={styles.notesContent}>
            <h2 className={styles.sectionTitle}>Notes & Preferences</h2>
            <div className={styles.notesList}>
              {clientsWithNotes.map((client) => {
                const note = notes[client.client_profile_id];
                return (
                  <div key={client.client_profile_id} className={styles.noteCard}>
                    <div className={styles.noteHeader}>
                      <h3>{client.first_name} {client.last_name}</h3>
                      <span className={styles.noteDate}>
                        {note.updated_at ? formatDate(note.updated_at) : formatDate(note.created_at)}
                      </span>
                    </div>
                    <div className={styles.noteContent}>
                      <p>{note.note}</p>
                    </div>
                    <button
                      type="button"
                      className={styles.editNoteBtn}
                      onClick={(e) => handleAddNote(e, client)}
                    >
                      <FaStickyNote /> Edit Note
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Add Note Modal */}
            {showNoteModal && selectedClient && (
              <div className={styles.modalOverlay} onClick={handleCloseModal}>
                <div className={styles.noteModal} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalHeader}>
                    <h3>Add Note for {selectedClient.first_name} {selectedClient.last_name}</h3>
                    <button 
                      type="button"
                      className={styles.closeButton}
                      onClick={handleCloseModal}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className={styles.modalBody}>
                    <textarea
                      className={styles.noteTextarea}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Your note..."
                      rows={12}
                    />
                  </div>
                  <div className={styles.modalFooter}>
                    <button 
                      type="button"
                      className={styles.cancelBtn}
                      onClick={handleCloseModal}
                      disabled={savingNote}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      className={styles.saveBtn}
                      onClick={handleSaveNote}
                      disabled={savingNote || !noteText.trim()}
                    >
                      {savingNote ? 'Saving...' : 'Save Note'}
                    </button>
                  </div>
                </div>
              </div>
            )}
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
