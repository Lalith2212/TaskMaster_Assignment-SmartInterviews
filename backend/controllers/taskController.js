const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sortBy, order, page = 1, limit = 10 } = req.query;

    // Build filter query
    const filter = { user: req.user._id };

    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Build sort query
    const sortOptions = {};
    const validSortFields = ['createdAt', 'dueDate', 'priority', 'title'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sortOptions[sortField] = order === 'asc' ? 1 : -1;

    // Priority sort helper
    if (sortField === 'priority') {
      // Use aggregation for custom priority ordering
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      const tasks = await Task.find(filter).lean();
      tasks.sort((a, b) => {
        const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
        return order === 'asc' ? diff : -diff;
      });

      const total = tasks.length;
      const startIndex = (Number(page) - 1) * Number(limit);
      const paginatedTasks = tasks.slice(startIndex, startIndex + Number(limit));

      return res.json({
        success: true,
        data: paginatedTasks,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit))
        }
      });
    }

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort(sortOptions)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .lean();

    res.json({
      success: true,
      data: tasks,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      user: req.user._id
    });

    res.status(201).json({ success: true, message: 'Task created!', data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    let task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    const { title, description, status, priority, dueDate } = req.body;

    task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate },
      { new: true, runValidators: true }
    );

    res.json({ success: true, message: 'Task updated!', data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    await task.deleteOne();

    res.json({ success: true, message: 'Task deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
