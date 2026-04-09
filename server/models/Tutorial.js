import mongoose from 'mongoose';

const tutorialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  subCategory: {
    type: String,
    required: true,
    trim: true,
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true,
  },
  instructions: {
    type: String,
    required: true,
    trim: true,
  },
  benefits: {
    type: String,
    required: true,
    trim: true,
  },
  properFormTips: {
    type: String,
    required: true,
    trim: true,
  },
  commonMistakes: {
    type: String,
    required: true,
    trim: true,
  },
  focusArea: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one focus area must be selected'
    }
  },
  focusAreaFrontImage: {
    type: String,
    required: false,
  },
  focusAreaFrontImagePublicId: {
    type: String,
    required: false,
  },
  focusAreaBackImage: {
    type: String,
    required: false,
  },
  focusAreaBackImagePublicId: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  imagePublicId: {
    type: String,
    required: true,
  },
  videoLink: {
    type: String,
    required: false,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Tutorial || mongoose.model('Tutorial', tutorialSchema);
