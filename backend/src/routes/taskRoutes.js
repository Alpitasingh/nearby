const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const {
  validate,
  createTaskRules,
  nearbyTasksRules,
  mongoIdRule,
} = require('../middleware/validate');

/**
 * 🔥 PUBLIC ROUTE (NO AUTH)
 */
router.get('/nearby', nearbyTasksRules, validate, taskController.getNearbyTasks);

/**
 * 🔐 ALL BELOW ROUTES REQUIRE AUTH
 */
router.use(protect);

/**
 * @route   GET /api/tasks/my
 */
router.get('/my', taskController.getMyPostedTasks);

/**
 * @route   GET /api/tasks/accepted
 */
router.get('/accepted', taskController.getMyAcceptedTasks);

/**
 * @route   POST /api/tasks
 */
router.post('/', createTaskRules, validate, taskController.createTask);

/**
 * @route   GET /api/tasks/:id
 */
router.get('/:id', [mongoIdRule('id'), validate], taskController.getTask);

/**
 * @route   PATCH /api/tasks/:id/accept
 */
router.patch('/:id/accept', [mongoIdRule('id'), validate], taskController.acceptTask);

/**
 * @route   PATCH /api/tasks/:id/complete
 */
router.patch('/:id/complete', [mongoIdRule('id'), validate], taskController.completeTask);

/**
 * @route   PATCH /api/tasks/:id/cancel
 */
router.patch('/:id/cancel', [mongoIdRule('id'), validate], taskController.cancelTask);

/**
 * @route   DELETE /api/tasks/:id
 */
router.delete('/:id', [mongoIdRule('id'), validate], taskController.deleteTask);

module.exports = router;