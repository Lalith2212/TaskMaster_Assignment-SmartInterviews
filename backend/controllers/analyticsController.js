const Task = require('../models/Task');

// @desc    Get analytics for logged in user
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Aggregate all stats in one query
    const stats = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          todo: { $sum: { $cond: [{ $eq: ['$status', 'todo'] }, 1, 0] } },
          highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
          mediumPriority: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
          lowPriority: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } }
        }
      }
    ]);

    // Overdue tasks count
    const overdue = await Task.countDocuments({
      user: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: 'done' }
    });

    // Tasks created in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentTasks = await Task.countDocuments({
      user: userId,
      createdAt: { $gte: sevenDaysAgo }
    });

    const data = stats[0] || {
      total: 0, completed: 0, inProgress: 0, todo: 0,
      highPriority: 0, mediumPriority: 0, lowPriority: 0
    };

    const completionPercentage = data.total > 0
      ? Math.round((data.completed / data.total) * 100)
      : 0;

    res.json({
      success: true,
      data: {
        total: data.total,
        completed: data.completed,
        inProgress: data.inProgress,
        pending: data.todo,
        overdue,
        recentTasks,
        completionPercentage,
        byPriority: {
          high: data.highPriority,
          medium: data.mediumPriority,
          low: data.lowPriority
        },
        byStatus: {
          todo: data.todo,
          'in-progress': data.inProgress,
          done: data.completed
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics };
