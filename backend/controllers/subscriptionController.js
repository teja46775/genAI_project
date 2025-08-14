const Joi = require('joi');
const Subscription = require('../models/Subscription');
const logger = require('../utils/logger');

const subscriptionSchema = Joi.object({
  userId: Joi.number().integer().required(),
  planName: Joi.string().required(),
  planType: Joi.string().valid('basic', 'premium', 'enterprise').required(),
  price: Joi.number().positive().required(),
  status: Joi.string().valid('active', 'inactive', 'cancelled').required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required()
});

const getAllSubscriptions = async (req, res) => {
  try {
    const { status, planType } = req.query;
    const filters = {};
    
    if (status) filters.status = status;
    if (planType) filters.planType = planType;

    const subscriptions = await Subscription.findAll(filters);
    res.json(subscriptions);
  } catch (error) {
    logger.error('Get subscriptions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);
    
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    res.json(subscription);
  } catch (error) {
    logger.error('Get subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createSubscription = async (req, res) => {
  try {
    console.log('Create subscription request:', req.body);
    
    const { error } = subscriptionSchema.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const subscription = await Subscription.create(req.body);
    logger.info(`New subscription created: ${subscription.id}`);
    
    res.status(201).json(subscription);
  } catch (error) {
    console.error('Create subscription error:', error);
    logger.error('Create subscription error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const updateSchema = subscriptionSchema.fork(['userId'], (schema) => schema.optional());
    
    const { error } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const subscription = await Subscription.update(id, req.body);
    
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    logger.info(`Subscription updated: ${id}`);
    res.json(subscription);
  } catch (error) {
    logger.error('Update subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.delete(id);
    
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    
    logger.info(`Subscription deleted: ${id}`);
    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    logger.error('Delete subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription
};