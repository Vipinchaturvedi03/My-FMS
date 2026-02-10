/**
 * Authentication Routes - Register & Login
 * FMS - Vipin Chaturvedi
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('../db');

const authRouter = express.Router();

// Naya user register karein
authRouter.post('/register', async (request, response) => {
  try {
    const { name, age, gender, address, mobile, password } = request.body;

    if (!name || !mobile || !password) {
      return response.status(400).json({ message: 'Name, mobile aur password required' });
    }

    const existingUser = await database.query(
      'SELECT id FROM users WHERE mobile = $1',
      [mobile]
    );

    if (existingUser.rows.length > 0) {
      return response.status(409).json({ message: 'Ye mobile pehle se registered hai' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await database.query(
      `INSERT INTO users (name, age, gender, address, mobile, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, mobile`,
      [name, age || null, gender || null, address || null, mobile, hashedPassword]
    );

    const newUser = insertResult.rows[0];
    const jwtToken = jwt.sign(
      { id: newUser.id, mobile: newUser.mobile, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    response.json({ token: jwtToken, user: newUser });
  } catch (error) {
    console.error('Register error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

// User login karein
authRouter.post('/login', async (request, response) => {
  try {
    const { mobile, password } = request.body;

    const userResult = await database.query(
      'SELECT id, name, mobile, password_hash FROM users WHERE mobile = $1',
      [mobile]
    );

    if (userResult.rows.length === 0) {
      return response.status(401).json({ message: 'Invalid credentials' });
    }

    const userRecord = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, userRecord.password_hash);

    if (!passwordMatch) {
      return response.status(401).json({ message: 'Invalid credentials' });
    }

    const jwtToken = jwt.sign(
      { id: userRecord.id, mobile: userRecord.mobile, name: userRecord.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    response.json({
      token: jwtToken,
      user: { id: userRecord.id, name: userRecord.name, mobile: userRecord.mobile }
    });
  } catch (error) {
    console.error('Login error:', error);
    response.status(500).json({ message: 'Server error' });
  }
});

module.exports = authRouter;
