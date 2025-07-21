const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  attachments: [{ type: String }], // URLs or file paths
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', assignmentSchema); 