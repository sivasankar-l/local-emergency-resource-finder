const Feedback = require('../models/Feedback');

// @desc    Submit public contact or feedback
// @route   POST /api/feedback
exports.submitFeedback = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const feedback = await Feedback.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      status: 'new'
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback has been received and logged for review.',
      data: {
        id: feedback._id,
        createdAt: feedback.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all feedback entries (Admin only)
// @route   GET /api/admin/feedback
exports.getAllFeedback = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Feedback.countDocuments(query);
    const feedbackList = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      count: feedbackList.length,
      data: feedbackList
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update feedback status (Admin only)
// @route   PATCH /api/admin/feedback/:id
exports.updateFeedbackStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['new', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: new, reviewed, resolved.'
      });
    }

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback entry not found.'
      });
    }

    feedback.status = status;
    await feedback.save();

    res.status(200).json({
      success: true,
      message: 'Feedback status updated successfully.',
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};
