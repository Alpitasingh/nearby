const mongoose = require('mongoose');

/**
 * GeoJSON point for task location.
 * MongoDB 2dsphere index enables $near / $geoWithin queries.
 */
const pointSchema = new mongoose.Schema({
  type:        { type: String, enum: ['Point'], required: true, default: 'Point' },
  coordinates: { type: [Number], required: true }, // [longitude, latitude]
});

const STATUSES = ['open', 'in_progress', 'completed', 'cancelled'];

const taskSchema = new mongoose.Schema(
  {
    // ── Core fields ──────────────────────────────────────
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: 5,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: 20,
      maxlength: 2000,
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [1, 'Budget must be at least 1'],
    },
    currency: {
      type: String,
      default: 'INR',
      uppercase: true,
      maxlength: 3,
    },

    // ── Location ─────────────────────────────────────────
    location: {
      type: pointSchema,
      required: [true, 'Location is required'],
      index: '2dsphere',
    },
    address: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    /**
     * Search radius in kilometres.
     * Only workers within this radius can see the task in geo queries.
     */
    radius: {
      type: Number,
      required: true,
      min: [0.1, 'Radius must be at least 0.1 km'],
      max: [50, 'Radius cannot exceed 50 km'],
      default: 5,
    },

    // ── Participants ──────────────────────────────────────
    poster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // ── Lifecycle ─────────────────────────────────────────
    status: {
      type: String,
      enum: STATUSES,
      default: 'open',
    },
    acceptedAt:   { type: Date, default: null },
    completedAt:  { type: Date, default: null },
    cancelledAt:  { type: Date, default: null },

    // ── Extra metadata ────────────────────────────────────
    category: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    tags: [{ type: String, trim: true, maxlength: 30 }],
    images: [{ type: String }], // URLs
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// ── Indexes ───────────────────────────────────────────────
taskSchema.index({ status: 1 });
taskSchema.index({ poster: 1 });
taskSchema.index({ worker: 1 });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ location: '2dsphere' }); // geo queries

// ── Virtual: duration in hours (in_progress tasks) ────────
taskSchema.virtual('durationHours').get(function () {
  if (!this.acceptedAt) return null;
  const end = this.completedAt || new Date();
  return ((end - this.acceptedAt) / 36e5).toFixed(1);
});

// ── Guard: only open tasks can be accepted ────────────────
taskSchema.methods.canBeAccepted = function () {
  return this.status === 'open';
};

taskSchema.methods.canBeCompleted = function (userId) {
  return (
    this.status === 'in_progress' &&
    this.poster.toString() === userId.toString()
  );
};

module.exports = mongoose.model('Task', taskSchema);