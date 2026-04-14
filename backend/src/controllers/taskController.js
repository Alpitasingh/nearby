const Task = require('../models/Task');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

// ── Helpers ───────────────────────────────────────────────

const buildGeoQuery = (longitude, latitude, radiusKm) => ({
  location: {
    $near: {
      $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
      $maxDistance: parseFloat(radiusKm) * 1000, // metres
    },
  },
});

// ── Controllers ───────────────────────────────────────────

/**
 * POST /api/tasks
 * Create a new task.
 */
exports.createTask = async (req, res, next) => {
  try {
    const {
      title, description, budget, currency,
      longitude, latitude, address, radius,
      category, tags, images,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      budget,
      currency,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      address,
      radius: radius || 5,
      category,
      tags,
      images,
      poster: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { tasksPosted: 1 } });
    logger.info(`Task created [${task._id}] by user [${req.user._id}]`);

    const populated = await task.populate('poster', 'name email avatar rating');
    res.status(201).json({ status: 'success', data: { task: populated } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tasks/nearby?longitude=&latitude=&radius=&page=&limit=
 * Return open tasks within the given radius (geospatial query).
 */
exports.getNearbyTasks = async (req, res, next) => {
  try {
    const { longitude, latitude, radius = 10, page = 1, limit = 20 } = req.query;

    const geoFilter = buildGeoQuery(longitude, latitude, radius);
    const filter = { ...geoFilter, status: 'open' };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('poster', 'name avatar rating')
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: { tasks },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tasks/:id
 * Get a single task by ID.
 */
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('poster', 'name email avatar rating bio')
      .populate('worker', 'name avatar rating');

    if (!task) return next(new ApiError(404, 'Task not found'));

    res.status(200).json({ status: 'success', data: { task } });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tasks/my
 * Tasks posted by the authenticated user.
 */
exports.getMyPostedTasks = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = { poster: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('worker', 'name avatar rating')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      total,
      data: { tasks },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tasks/accepted
 * Tasks accepted by the authenticated user (worker view).
 */
exports.getMyAcceptedTasks = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = { worker: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('poster', 'name avatar rating')
        .sort({ acceptedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      total,
      data: { tasks },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/tasks/:id/accept
 * Worker accepts an open task.
 */
exports.acceptTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return next(new ApiError(404, 'Task not found'));

    // Cannot accept your own task
    if (task.poster.toString() === req.user._id.toString()) {
      return next(new ApiError(400, 'You cannot accept your own task'));
    }

    if (!task.canBeAccepted()) {
      return next(
        new ApiError(400, `Task cannot be accepted — current status: ${task.status}`)
      );
    }

    task.status     = 'in_progress';
    task.worker     = req.user._id;
    task.acceptedAt = new Date();
    await task.save();

    await User.findByIdAndUpdate(req.user._id, { $inc: { tasksAccepted: 1 } });
    logger.info(`Task [${task._id}] accepted by user [${req.user._id}]`);

    const populated = await task.populate([
      { path: 'poster', select: 'name avatar rating' },
      { path: 'worker', select: 'name avatar rating' },
    ]);

    res.status(200).json({ status: 'success', data: { task: populated } });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/tasks/:id/complete
 * Poster marks an in-progress task as completed.
 */
exports.completeTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return next(new ApiError(404, 'Task not found'));

    if (!task.canBeCompleted(req.user._id)) {
      return next(
        new ApiError(
          400,
          task.poster.toString() !== req.user._id.toString()
            ? 'Only the task poster can mark it as completed'
            : `Task cannot be completed — current status: ${task.status}`
        )
      );
    }

    task.status      = 'completed';
    task.completedAt = new Date();
    await task.save();

    logger.info(`Task [${task._id}] marked completed by poster [${req.user._id}]`);

    res.status(200).json({ status: 'success', data: { task } });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/tasks/:id/cancel
 * Poster cancels an open task.
 */
exports.cancelTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return next(new ApiError(404, 'Task not found'));

    if (task.poster.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, 'Only the task poster can cancel it'));
    }

    if (!['open', 'in_progress'].includes(task.status)) {
      return next(new ApiError(400, `Cannot cancel a task with status: ${task.status}`));
    }

    task.status      = 'cancelled';
    task.cancelledAt = new Date();
    await task.save();

    logger.info(`Task [${task._id}] cancelled by poster [${req.user._id}]`);
    res.status(200).json({ status: 'success', data: { task } });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/tasks/:id
 * Poster deletes an open task (hard delete).
 */
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return next(new ApiError(404, 'Task not found'));

    if (task.poster.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, 'Only the task poster can delete it'));
    }

    if (task.status !== 'open') {
      return next(new ApiError(400, 'Only open tasks can be deleted'));
    }

    await task.deleteOne();
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    next(err);
  }
};