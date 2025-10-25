const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  course: {
    type: String,
    required: true,
    trim: true,
  },
  batch: {
    type: String,
    required: true,
  },
  grade: {
    type: String,
    required: true,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
  },
  dateOfAdmission: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

studentSchema.index({ name: 'text', email: 'text', course: 'text' });

module.exports = mongoose.model('Student', studentSchema);
