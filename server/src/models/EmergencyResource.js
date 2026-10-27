const mongoose = require('mongoose');

const CATEGORIES = [
  'Hospitals',
  'Ambulance Services',
  'Police Stations',
  'Fire Stations',
  'Pharmacies',
  'Blood Banks',
  'Emergency Shelters'
];

const EmergencyResourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: '{VALUE} is not a valid emergency category'
      }
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    postalCode: {
      type: String,
      trim: true,
      default: ''
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      trim: true,
      default: '',
      lowercase: true
    },
    operatingHours: {
      type: String,
      trim: true,
      default: '24/7 Emergency Service'
    },
    services: {
      type: [String],
      default: []
    },
    availabilityStatus: {
      status: {
        type: String,
        default: 'Operational'
      },
      source: {
        type: String,
        default: 'Demonstration / Initial Listing'
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified'],
      default: 'unverified'
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    dataSource: {
      type: String,
      default: 'Demonstration Data (Academic Project - VIT IIP)'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for fast searching, filtering, and proximity
EmergencyResourceSchema.index({ category: 1 });
EmergencyResourceSchema.index({ latitude: 1, longitude: 1 });
EmergencyResourceSchema.index({ name: 'text', address: 'text', city: 'text' });
EmergencyResourceSchema.index({ verificationStatus: 1 });

module.exports = {
  EmergencyResource: mongoose.model('EmergencyResource', EmergencyResourceSchema),
  CATEGORIES
};
