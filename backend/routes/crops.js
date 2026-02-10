/**
 * Crops Routes - Fasal Management
 * FMS - Vipin Chaturvedi
 */

const express = require('express');
const database = require('../db');
const verifyUserToken = require('../middleware/auth');

const cropsRouter = express.Router();
cropsRouter.use(verifyUserToken);

// Plantings - GET list, POST add
cropsRouter.route('/plantings')
  .get(async (request, response) => {
    try {
      const fetchResult = await database.query(
        'SELECT * FROM crop_plantings WHERE user_id = $1 ORDER BY sown_date DESC',
        [request.user.id]
      );
      response.json(fetchResult.rows);
    } catch (error) {
      console.error('Plantings fetch error:', error);
      response.status(500).json({ message: 'Server error' });
    }
  })
  .post(async (request, response) => {
    try {
      const { crop_name, variety, sown_date, area_acres, expected_duration_days, notes } = request.body;

      if (!crop_name || !sown_date) {
        return response.status(400).json({ message: 'Crop name aur sown date required' });
      }

      const insertResult = await database.query(
        `INSERT INTO crop_plantings (user_id, crop_name, variety, sown_date, area_acres, expected_duration_days, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          request.user.id,
          crop_name,
          variety || null,
          sown_date,
          area_acres || 1,
          expected_duration_days || 120,
          notes || null
        ]
      );

      response.json(insertResult.rows[0]);
    } catch (error) {
      console.error('Planting add error:', error);
      response.status(500).json({ message: 'Server error' });
    }
  });

// Planting by ID - PATCH, DELETE
cropsRouter.patch('/plantings/:id', async (request, response) => {
  try {
    const { crop_name, variety, sown_date, area_acres, expected_duration_days, status, notes } = request.body;

    const updateResult = await database.query(
      `UPDATE crop_plantings SET
        crop_name = COALESCE($2, crop_name),
        variety = COALESCE($3, variety),
        sown_date = COALESCE($4, sown_date),
        area_acres = COALESCE($5, area_acres),
        expected_duration_days = COALESCE($6, expected_duration_days),
        status = COALESCE($7, status),
        notes = COALESCE($8, notes)
       WHERE id = $1 AND user_id = $9 RETURNING *`,
      [request.params.id, crop_name, variety, sown_date, area_acres, expected_duration_days, status, notes, request.user.id]
    );

    if (updateResult.rows.length === 0) {
      return response.status(404).json({ message: 'Not found' });
    }

    response.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Planting update error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

cropsRouter.delete('/plantings/:id', async (request, response) => {
  try {
    const deleteResult = await database.query(
      'DELETE FROM crop_plantings WHERE id = $1 AND user_id = $2 RETURNING id',
      [request.params.id, request.user.id]
    );

    if (deleteResult.rowCount === 0) {
      return response.status(404).json({ message: 'Not found' });
    }

    response.json({ ok: true });
  } catch (error) {
    console.error('Planting delete error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// Planting ke tasks fetch
cropsRouter.get('/plantings/:id/tasks', async (request, response) => {
  try {
    const tasksResult = await database.query(
      `SELECT t.* FROM crop_tasks t
       JOIN crop_plantings p ON t.planting_id = p.id
       WHERE p.id = $1 AND p.user_id = $2 ORDER BY t.scheduled_date`,
      [request.params.id, request.user.id]
    );

    response.json(tasksResult.rows);
  } catch (error) {
    console.error('Tasks fetch error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// Naya task add
cropsRouter.post('/plantings/:id/tasks', async (request, response) => {
  try {
    const { task_type, scheduled_date, notes } = request.body;

    if (!task_type || !scheduled_date) {
      return response.status(400).json({ message: 'Task type aur scheduled date required' });
    }

    const plantingCheck = await database.query(
      'SELECT id FROM crop_plantings WHERE id = $1 AND user_id = $2',
      [request.params.id, request.user.id]
    );

    if (plantingCheck.rows.length === 0) {
      return response.status(404).json({ message: 'Planting not found' });
    }

    const insertResult = await database.query(
      `INSERT INTO crop_tasks (planting_id, task_type, scheduled_date, notes)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [request.params.id, task_type, scheduled_date, notes || null]
    );

    response.json(insertResult.rows[0]);
  } catch (error) {
    console.error('Task add error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// Task complete mark karein
cropsRouter.patch('/tasks/:id', async (request, response) => {
  try {
    const { completed_date } = request.body;
    const completedOn = completed_date || new Date().toISOString().slice(0, 10);

    const updateResult = await database.query(
      `UPDATE crop_tasks SET completed_date = COALESCE($2, completed_date)
       WHERE id = $1 AND planting_id IN (SELECT id FROM crop_plantings WHERE user_id = $3)
       RETURNING *`,
      [request.params.id, completedOn, request.user.id]
    );

    if (updateResult.rows.length === 0) {
      return response.status(404).json({ message: 'Not found' });
    }

    response.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Task update error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// Dashboard summary
cropsRouter.get('/summary', async (request, response) => {
  try {
    const activeResult = await database.query(
      "SELECT COUNT(*) AS count FROM crop_plantings WHERE user_id = $1 AND status = 'active'",
      [request.user.id]
    );

    const upcomingResult = await database.query(
      `SELECT COUNT(*) AS count FROM crop_tasks t
       JOIN crop_plantings p ON t.planting_id = p.id
       WHERE p.user_id = $1 AND t.completed_date IS NULL AND t.scheduled_date >= CURRENT_DATE`,
      [request.user.id]
    );

    response.json({
      active_crops: parseInt(activeResult.rows[0].count, 10),
      upcoming_tasks: parseInt(upcomingResult.rows[0].count, 10)
    });
  } catch (error) {
    console.error('Summary error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

module.exports = cropsRouter;
