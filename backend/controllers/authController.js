const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');
const logger = require('../utils/logger');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const register = async (req, res) => {
  try {
    console.log('Registration request:', req.body);
    
    const { error } = registerSchema.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email } = req.body;
    console.log('Checking existing user for email:', email);
    
    const existingUser = await User.findByEmail(email);
    
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ error: 'User already exists' });
    }

    console.log('Creating new user');
    const user = await User.create(req.body);
    logger.info(`New user registered: ${email}`);
    
    res.status(201).json({ 
      message: 'User registered successfully', 
      user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name }
    });
  } catch (error) {
    console.error('Registration error details:', error);
    logger.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    
    if (!user || !(await User.validatePassword(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.info(`User logged in: ${email}`);
    
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { register, login };