const { Router } = require('express');
const pool = require('../db');

const router = Router();

// GET all bookings
router.get('/', async (req: any, res: any) => {
  try {
    const result = await pool.query('SELECT * FROM bookings ORDER BY appointment_time ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).send('Server error');
  }
});

// POST a new booking
router.post('/', async (req: any, res: any) => {
  const { provider_id, client_name, client_email, appointment_time, service, notes } = req.body;

  if (!provider_id || !client_name || !client_email || !appointment_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO bookings 
      (provider_id, client_name, client_email, appointment_time, service, notes) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [provider_id, client_name, client_email, appointment_time, service, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
