/**
 * Reports Routes - CSV/PDF Export
 * FMS - Vipin Chaturvedi
 */

const express = require('express');
const database = require('../db');
const verifyUserToken = require('../middleware/auth');
const PDFDocument = require('pdfkit');

const reportsRouter = express.Router();
reportsRouter.use(verifyUserToken);

// Category-wise expenses - JSON
reportsRouter.get('/expenses-by-category', async (request, response) => {
  try {
    const queryResult = await database.query(
      `SELECT category, COALESCE(SUM(total), 0) AS total
       FROM expenses WHERE user_id = $1 GROUP BY category ORDER BY category`,
      [request.user.id]
    );

    response.json(queryResult.rows);
  } catch (error) {
    console.error('Reports fetch error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// Pending labor list - JSON
reportsRouter.get('/pending-labor', async (request, response) => {
  try {
    const queryResult = await database.query(
      `SELECT name, days_worked, daily_wage, total, paid, pending
       FROM laborers WHERE user_id = $1 ORDER BY name`,
      [request.user.id]
    );

    response.json(queryResult.rows);
  } catch (error) {
    console.error('Labor report error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// Current stock - JSON
reportsRouter.get('/current-stock', async (request, response) => {
  try {
    const queryResult = await database.query(
      `SELECT name, unit, threshold, current_qty,
              (current_qty < threshold) AS below_threshold
       FROM stock_items WHERE user_id = $1 ORDER BY name`,
      [request.user.id]
    );

    response.json(queryResult.rows);
  } catch (error) {
    console.error('Stock report error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// CSV export - expenses by category
reportsRouter.get('/export/csv', async (request, response) => {
  try {
    const queryResult = await database.query(
      `SELECT category, COALESCE(SUM(total), 0) AS total
       FROM expenses WHERE user_id = $1 GROUP BY category ORDER BY category`,
      [request.user.id]
    );

    const csvHeader = 'Category,Total\n';
    const csvRows = queryResult.rows.map(row => `${row.category},${row.total}`).join('\n');
    const csvContent = csvHeader + csvRows + '\n';

    response.setHeader('Content-Type', 'text/csv');
    response.setHeader('Content-Disposition', 'attachment; filename=fms_expenses.csv');
    response.send(csvContent);
  } catch (error) {
    console.error('CSV export error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// PDF export - pending labor
reportsRouter.get('/export/pdf', async (request, response) => {
  try {
    const laborResult = await database.query(
      `SELECT name, days_worked, daily_wage, total, paid, pending
       FROM laborers WHERE user_id = $1 ORDER BY name`,
      [request.user.id]
    );

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', 'inline; filename=fms_pending_labor.pdf');

    const pdfDoc = new PDFDocument({ margin: 40 });
    pdfDoc.fontSize(18).text('FMS - Pending Labor Payments', { align: 'center' });
    pdfDoc.moveDown();
    pdfDoc.fontSize(12);

    laborResult.rows.forEach(laborEntry => {
      pdfDoc.text(
        `${laborEntry.name} | Days: ${laborEntry.days_worked} | Wage: ${laborEntry.daily_wage} | Total: ${laborEntry.total} | Paid: ${laborEntry.paid} | Pending: ${laborEntry.pending}`
      );
    });

    pdfDoc.end();
    pdfDoc.pipe(response);
  } catch (error) {
    console.error('PDF export error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

module.exports = reportsRouter;
