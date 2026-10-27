const { EmergencyResource, CATEGORIES } = require('../models/EmergencyResource');
const Feedback = require('../models/Feedback');

// @desc    Get dashboard metrics & overview
// @route   GET /api/admin/stats
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalResources = await EmergencyResource.countDocuments();
    
    // Resource counts by category
    const categoryAgg = await EmergencyResource.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const categoryCounts = CATEGORIES.reduce((acc, cat) => {
      const found = categoryAgg.find((c) => c._id === cat);
      acc[cat] = found ? found.count : 0;
      return acc;
    }, {});

    // Verification stats
    const verificationAgg = await EmergencyResource.aggregate([
      { $group: { _id: '$verificationStatus', count: { $sum: 1 } } }
    ]);
    const verificationCounts = {
      verified: 0,
      pending: 0,
      unverified: 0
    };
    verificationAgg.forEach((v) => {
      if (v._id) verificationCounts[v._id] = v.count;
    });

    // Feedback stats
    const totalFeedback = await Feedback.countDocuments();
    const newFeedback = await Feedback.countDocuments({ status: 'new' });

    // Recently updated resources
    const recentResources = await EmergencyResource.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      stats: {
        totalResources,
        categoryCounts,
        verificationCounts,
        totalFeedback,
        newFeedback,
        recentResources
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all resources for administrative management
// @route   GET /api/admin/resources
exports.getAllAdminResources = async (req, res, next) => {
  try {
    const { category, verificationStatus, q, page = 1, limit = 50 } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (verificationStatus && verificationStatus !== 'All') {
      query.verificationStatus = verificationStatus;
    }

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      query.$or = [
        { name: regex },
        { address: regex },
        { city: regex },
        { phone: regex }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await EmergencyResource.countDocuments(query);
    const resources = await EmergencyResource.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      count: resources.length,
      data: resources
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new emergency resource
// @route   POST /api/admin/resources
exports.createResource = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      address,
      city,
      state,
      postalCode,
      latitude,
      longitude,
      phone,
      email,
      operatingHours,
      services,
      verificationStatus,
      dataSource
    } = req.body;

    const resourceData = {
      name: name.trim(),
      category,
      description: description ? description.trim() : '',
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode ? postalCode.trim() : '',
      latitude: Number(latitude),
      longitude: Number(longitude),
      phone: phone ? phone.trim() : '',
      email: email ? email.trim() : '',
      operatingHours: operatingHours ? operatingHours.trim() : '24/7 Emergency Service',
      services: Array.isArray(services)
        ? services
        : services
        ? services.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      verificationStatus: verificationStatus || 'unverified',
      verifiedAt: verificationStatus === 'verified' ? new Date() : null,
      dataSource: dataSource || 'Admin Entry (VIT IIP System)',
      lastUpdated: new Date()
    };

    const newResource = await EmergencyResource.create(resourceData);

    res.status(201).json({
      success: true,
      message: 'Emergency resource created successfully.',
      data: newResource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing resource
// @route   PUT /api/admin/resources/:id
exports.updateResource = async (req, res, next) => {
  try {
    const resource = await EmergencyResource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.'
      });
    }

    const {
      name,
      category,
      description,
      address,
      city,
      state,
      postalCode,
      latitude,
      longitude,
      phone,
      email,
      operatingHours,
      services,
      verificationStatus,
      dataSource
    } = req.body;

    if (name) resource.name = name.trim();
    if (category) resource.category = category;
    if (description !== undefined) resource.description = description.trim();
    if (address) resource.address = address.trim();
    if (city) resource.city = city.trim();
    if (state) resource.state = state.trim();
    if (postalCode !== undefined) resource.postalCode = postalCode.trim();
    if (latitude !== undefined) resource.latitude = Number(latitude);
    if (longitude !== undefined) resource.longitude = Number(longitude);
    if (phone !== undefined) resource.phone = phone.trim();
    if (email !== undefined) resource.email = email.trim();
    if (operatingHours !== undefined) resource.operatingHours = operatingHours.trim();
    if (dataSource !== undefined) resource.dataSource = dataSource.trim();

    if (services !== undefined) {
      resource.services = Array.isArray(services)
        ? services
        : services.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (verificationStatus && verificationStatus !== resource.verificationStatus) {
      resource.verificationStatus = verificationStatus;
      resource.verifiedAt = verificationStatus === 'verified' ? new Date() : null;
    }

    resource.lastUpdated = new Date();

    const updatedResource = await resource.save();

    res.status(200).json({
      success: true,
      message: 'Resource updated successfully.',
      data: updatedResource
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete emergency resource
// @route   DELETE /api/admin/resources/:id
exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await EmergencyResource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found.'
      });
    }

    await resource.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
