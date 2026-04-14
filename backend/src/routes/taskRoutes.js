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

// All task routes require authentication
router.use(protect);

/**
 * @route   GET  /api/tasks/nearby
 * @desc    Get open tasks near a geo coordinate
 * @access  Protected
 * @query   longitude, latitude, radius (km), page, limit
 */
router.get('/nearby', nearbyTasksRules, validate, taskController.getNearbyTasks);

/**
 * @route   GET /api/tasks/my
 * @desc    Get tasks posted by the current user
 * @access  Protected
 */
router.get('/my', taskController.getMyPostedTasks);

/**
 * @route   GET /api/tasks/accepted
 * @desc    Get tasks accepted by the current user (worker)
 * @access  Protected
 */
router.get('/accepted', taskController.getMyAcceptedTasks);

/**
 * @route   POST /api/tasks
 * @desc    Post a new task
 * @access  Protected
 */
router.post('/', createTaskRules, validate, taskController.createTask);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID
 * @access  Protected
 */
router.get('/:id', [mongoIdRule('id'), validate], taskController.getTask);

/**
 * @route   PATCH /api/tasks/:id/accept
 * @desc    Worker accepts an open task
 * @access  Protected
 */
router.patch('/:id/accept', [mongoIdRule('id'), validate], taskController.acceptTask);

/**
 * @route   PATCH /api/tasks/:id/complete
 * @desc    Poster marks task as completed
 * @access  Protected (poster only)
 */
router.patch('/:id/complete', [mongoIdRule('id'), validate], taskController.completeTask);

/**
 * @route   PATCH /api/tasks/:id/cancel
 * @desc    Poster cancels a task
 * @access  Protected (poster only)
 */
router.patch('/:id/cancel', [mongoIdRule('id'), validate], taskController.cancelTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Poster deletes an open task
 * @access  Protected (poster only)
 */
router.delete('/:id', [mongoIdRule('id'), validate], taskController.deleteTask);

module.exports = router;