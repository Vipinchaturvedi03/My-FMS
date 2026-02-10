/**
 * Labor Routes - Mazdoor Management
 * FMS - Vipin Chaturvedi
 */

const express = require('express');
const database = require('../db');
const verifyUserToken = require('../middleware/auth');

const laborRouter = express.Router();
laborRouter.use(verifyUserToken);

// Naya labor entry add
laborRouter.post('/', async (request, response) => {
  try {
    const { name, days_worked, daily_wage, paid } = request.body;

    if (!name || days_worked == null || daily_wage == null) {
      return response.status(400).json({ message: 'Required fields missing' });
    }

    const totalAmount = Number(days_worked) * Number(daily_wage);
    const paidAmount = Number(paid || 0);
    const pendingAmount = totalAmount - paidAmount;

    const insertResult = await database.query(
      `INSERT INTO laborers (user_id, name, days_worked, daily_wage, total, paid, pending)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [request.user.id, name, days_worked, daily_wage, totalAmount, paidAmount, pendingAmount]
    );

    response.json(insertResult.rows[0]);
  } catch (error) {
    console.error('Labor add error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// Saare laborers fetch
laborRouter.get('/', async (request, response) => {
  try {
    const fetchResult = await database.query(
      'SELECT * FROM laborers WHERE user_id = $1 ORDER BY created_at DESC',
      [request.user.id]
    );

    response.json(fetchResult.rows);
  } catch (error) {
    console.error('Labor fetch error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// Labor entry delete
laborRouter.delete('/:id', async (request, response) => {
  try {
    await database.query(
      'DELETE FROM laborers WHERE id = $1 AND user_id = $2',
      [request.params.id, request.user.id]
    );

    response.json({ ok: true });
  } catch (error) {
    console.error('Labor delete error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// Pending wages total - dashboard ke liye
laborRouter.get('/summary/pending', async (request, response) => {
  try {
    const summaryResult = await database.query(
      'SELECT COALESCE(SUM(pending), 0) AS total_pending FROM laborers WHERE user_id = $1',
      [request.user.id]
    );

    response.json(summaryResult.rows[0]);
  } catch (error) {
    console.error('Pending summary error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

module.exports = laborRouter;
