/**
 * Expenses Routes - Kharcha Management
 * FMS - Vipin Chaturvedi
 */

const express = require('express');
const database = require('../db');
const verifyUserToken = require('../middleware/auth');

const expenseRouter = express.Router();
expenseRouter.use(verifyUserToken);

// Naya expense add
expenseRouter.post('/', async (request, response) => {
  try {
    const { category, item_name, quantity, unit, rate } = request.body;

    if (!category || !item_name || quantity == null || rate == null) {
      return response.status(400).json({ message: 'Required fields missing' });
    }

    const amountTotal = Number(quantity) * Number(rate);

    const insertResult = await database.query(
      `INSERT INTO expenses (user_id, category, item_name, quantity, unit, rate, total)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [request.user.id, category, item_name, quantity, unit || null, rate, amountTotal]
    );

    response.json(insertResult.rows[0]);
  } catch (error) {
    console.error('Expense add error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// Saare expenses fetch
expenseRouter.get('/', async (request, response) => {
  try {
    const fetchResult = await database.query(
      'SELECT * FROM expenses WHERE user_id = $1 ORDER BY created_at DESC',
      [request.user.id]
    );

    response.json(fetchResult.rows);
  } catch (error) {
    console.error('Expense fetch error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// Expense delete
expenseRouter.delete('/:id', async (request, response) => {
  try {
    await database.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2',
      [request.params.id, request.user.id]
    );

    response.json({ ok: true });
  } catch (error) {
    console.error('Expense delete error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// Category-wise summary - dashboard ke liye
expenseRouter.get('/summary/by-category', async (request, response) => {
  try {
    const summaryResult = await database.query(
      `SELECT category, COALESCE(SUM(total), 0) AS total
       FROM expenses WHERE user_id = $1 GROUP BY category ORDER BY category`,
      [request.user.id]
    );

    response.json(summaryResult.rows);
  } catch (error) {
    console.error('Summary fetch error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

module.exports = expenseRouter;
