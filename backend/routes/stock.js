/**
 * Stock Routes - Inventory Management
 * FMS - Vipin Chaturvedi
 */

const express = require('express');
const database = require('../db');
const verifyUserToken = require('../middleware/auth');

const stockRouter = express.Router();
stockRouter.use(verifyUserToken);

// Naya stock item add
stockRouter.post('/items', async (request, response) => {
  try {
    const { name, unit, threshold, opening_qty } = request.body;

    if (!name) {
      return response.status(400).json({ message: 'Item name required' });
    }

    const insertResult = await database.query(
      `INSERT INTO stock_items (user_id, name, unit, threshold, current_qty)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [request.user.id, name, unit || null, threshold || 0, opening_qty || 0]
    );

    response.json(insertResult.rows[0]);
  } catch (error) {
    console.error('Stock item add error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// Saare stock items fetch - below_threshold bhi
stockRouter.get('/items', async (request, response) => {
  try {
    const fetchResult = await database.query(
      `SELECT *, (current_qty < threshold) AS below_threshold
       FROM stock_items WHERE user_id = $1 ORDER BY name`,
      [request.user.id]
    );

    response.json(fetchResult.rows);
  } catch (error) {
    console.error('Stock fetch error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// Stock in/out transaction
stockRouter.post('/tx', async (request, response) => {
  const client = await database.pool.connect();

  try {
    const { item_id, type, quantity, note } = request.body;

    if (!item_id || !type || !quantity) {
      return response.status(400).json({ message: 'Required fields missing' });
    }

    await client.query('BEGIN');

    const itemCheck = await client.query(
      'SELECT id, current_qty FROM stock_items WHERE id = $1 AND user_id = $2 FOR UPDATE',
      [item_id, request.user.id]
    );

    if (itemCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return response.status(404).json({ message: 'Item not found' });
    }

    const qtyValue = Number(quantity);
    const currentQty = itemCheck.rows[0].current_qty;
    const updatedQty = type === 'in' ? currentQty + qtyValue : currentQty - qtyValue;

    if (updatedQty < 0) {
      await client.query('ROLLBACK');
      return response.status(400).json({ message: 'Stock insufficient' });
    }

    await client.query(
      `INSERT INTO stock_transactions (user_id, item_id, type, quantity, note)
       VALUES ($1, $2, $3, $4, $5)`,
      [request.user.id, item_id, type, qtyValue, note || null]
    );

    const updateResult = await client.query(
      'UPDATE stock_items SET current_qty = $1 WHERE id = $2 RETURNING *',
      [updatedQty, item_id]
    );

    await client.query('COMMIT');
    response.json(updateResult.rows[0]);
  } catch (error) {
    try { await client?.query('ROLLBACK'); } catch (_) {}
    console.error('Stock tx error:', error);
    response.status(500).json({ message: 'Server error' });
  } finally {
    client?.release();
  }
});

// Item-wise transactions fetch
stockRouter.get('/tx/:itemId', async (request, response) => {
  try {
    const txResult = await database.query(
      `SELECT * FROM stock_transactions
       WHERE user_id = $1 AND item_id = $2 ORDER BY created_at DESC`,
      [request.user.id, request.params.itemId]
    );

    response.json(txResult.rows);
  } catch (error) {
    console.error('Tx fetch error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

module.exports = stockRouter;
