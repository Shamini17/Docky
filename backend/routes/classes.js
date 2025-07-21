const express = require('express');
const Class = require('../models/Class');
const User = require('../models/User');
const router = express.Router();

// Create a class (teacher only)
router.post('/', async (req, res) => {
  try {
    if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Only teachers can create classes.' });
    const { name, description, topics } = req.body;
    const newClass = new Class({ name, description, topics, teacher: req.user.userId });
    await newClass.save();
    await User.findByIdAndUpdate(req.user.userId, { $push: { classes: newClass._id } });
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Join a class (student only)
router.post('/:id/join', async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Only students can join classes.' });
    const classObj = await Class.findById(req.params.id);
    if (!classObj) return res.status(404).json({ message: 'Class not found.' });
    if (!classObj.students.includes(req.user.userId)) {
      classObj.students.push(req.user.userId);
      await classObj.save();
      await User.findByIdAndUpdate(req.user.userId, { $push: { classes: classObj._id } });
    }
    res.json({ message: 'Joined class successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// List all classes for the user
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('classes');
    res.json(user.classes);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Get class details
router.get('/:id', async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id).populate('teacher students');
    if (!classObj) return res.status(404).json({ message: 'Class not found.' });
    res.json(classObj);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router; 