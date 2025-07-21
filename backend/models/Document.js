const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  fileName: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date },
  uploadedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['submitted', 'reviewed'], default: 'submitted' }
});

module.exports = mongoose.model('Document', documentSchema); 