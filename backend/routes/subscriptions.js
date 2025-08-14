const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription
} = require('../controllers/subscriptionController');

const router = express.Router();

router.use(authenticateToken);

router.get('/', getAllSubscriptions);
router.get('/:id', getSubscriptionById);
router.post('/', createSubscription);
router.put('/:id', updateSubscription);
router.delete('/:id', deleteSubscription);

module.exports = router;