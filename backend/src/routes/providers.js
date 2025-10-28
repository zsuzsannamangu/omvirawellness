const { Router } = require('express');
const pool = require('../db');

const router = Router();

// GET all providers
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM providers');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
