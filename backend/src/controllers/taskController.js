const Task = require('../models/Task');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

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

    const populated = await task.populate('poster', 'name email avatar rating');

    res.status(201).json({
      status: 'success',
      data: { task: populated },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tasks/nearby
 * Distance + Nearby tasks (🔥 FIXED)
 */
exports.getNearbyTasks = async (req, res, next) => {
  try {
    const { longitude, latitude, radius = 10, page = 1, limit = 20 } = req.query;

    if (!longitude || !latitude) {
      return next(new ApiError(400, 'Longitude and latitude are required'));
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          distanceField: "distance",
          maxDistance: parseFloat(radius) * 1000,
          spherical: true,
          query: { status: "open" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "poster",
          foreignField: "_id",
          as: "poster",
        },
      },
      { $unwind: "$poster" },
      {
        $project: {
          title: 1,
          description: 1,
          budget: 1,
          category: 1,
          location: 1,
          distance: 1,
          createdAt: 1,
          "poster.name": 1,
          "poster.avatar": 1,
          "poster.rating": 1,
        },
      },
      { $skip: skip },
      { $limit: parseInt(limit) },
    ]);

    res.status(200).json({
      status: "success",
      results: tasks.length,
      data: { tasks },
    });

  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tasks/:id
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
 */
exports.getMyPostedTasks = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = { poster: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(filter)
      .populate('worker', 'name avatar rating')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: { tasks },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tasks/accepted
 */
exports.getMyAcceptedTasks = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = { worker: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(filter)
      .populate('poster', 'name avatar rating')
      .sort({ acceptedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: { tasks },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/tasks/:id/accept
 */
exports.acceptTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return next(new ApiError(404, 'Task not found'));

    if (task.poster.toString() === req.user._id.toString()) {
      return next(new ApiError(400, 'You cannot accept your own task'));
    }

    if (!task.canBeAccepted()) {
      return next(new ApiError(400, `Task cannot be accepted — status: ${task.status}`));
    }

    task.status = 'in_progress';
    task.worker = req.user._id;
    task.acceptedAt = new Date();

    await task.save();

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { tasksAccepted: 1 },
    });

    res.status(200).json({
      status: 'success',
      data: { task },
    });

  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/tasks/:id/complete
 */
exports.completeTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return next(new ApiError(404, 'Task not found'));

    if (!task.canBeCompleted(req.user._id)) {
      return next(new ApiError(400, 'Cannot complete task'));
    }

    task.status = 'completed';
    task.completedAt = new Date();

    await task.save();

    res.status(200).json({
      status: 'success',
      data: { task },
    });

  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/tasks/:id/cancel
 */
exports.cancelTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return next(new ApiError(404, 'Task not found'));

    if (task.poster.toString() !== req.user._id.toString()) {
      return next(new ApiError(403, 'Not allowed'));
    }

    task.status = 'cancelled';
    task.cancelledAt = new Date();

    await task.save();

    res.status(200).json({
      status: 'success',
      data: { task },
    });

  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/tasks/:id
 */
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return next(new ApiError(404, 'Task not found'));

    await task.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null,
    });

  } catch (err) {
    next(err);
  }
};