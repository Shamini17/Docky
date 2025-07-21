const express = require('express');
const multer = require('multer');
const path = require('path');
const Submission = require('../models/Submission');
const User = require('../models/User');
const router = express.Router();

// Multer config for PDF/DOCX only
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only PDF and DOCX files are allowed'), false);
};
const upload = multer({ storage, fileFilter });

// Middleware: require user role
function requireUser(req, res, next) {
  if (!req.user || req.user.role !== 'user') return res.status(403).json({ message: 'Only users can submit.' });
  next();
}
// Middleware: require admin role
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Only admins can view submissions.' });
  next();
}

// POST / - User uploads a file (PDF/DOCX)
router.post('/', upload.single('file'), requireUser, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File is required.' });
    const submission = new Submission({
      user: req.user.userId,
      filePath: req.file.filename
    });
    await submission.save();
    res.status(201).json({ message: 'Submission successful.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET / - Admin: list all submissions
router.get('/', requireAdmin, async (req, res) => {
  try {
    const submissions = await Submission.find().populate('user', 'name email');
    res.json(submissions.map(sub => ({
      name: sub.user.name,
      email: sub.user.email,
      file: `/uploads/${sub.filePath}`,
      submittedAt: sub.submittedAt
    })));
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 