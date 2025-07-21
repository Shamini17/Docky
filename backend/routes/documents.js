const express = require('express');
const multer = require('multer');
const Document = require('../models/Document');
const auth = require('../middleware/auth');
const path = require('path');

const router = express.Router();

// Multer storage (local for now, can be replaced with S3/Firebase)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Upload document
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const { description, deadline } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded.' });
    const document = new Document({
      userId: req.user.userId,
      fileUrl: `/uploads/${file.filename}`,
      fileType: file.mimetype,
      fileName: file.originalname,
      description,
      deadline
    });
    await document.save();
    res.status(201).json({ message: 'Document uploaded successfully.', document });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// List documents (for current user)
router.get('/', auth, async (req, res) => {
  try {
    const documents = await Document.find({ userId: req.user.userId });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// List all documents (for teachers/admins)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied.' });
    }
    const documents = await Document.find().populate('userId', 'name email');
    res.json(documents);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 