const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db'); // SQLite connection
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');

// Multer config for uploads (must be before routes)
const upload = multer({
  dest: path.join(__dirname, 'uploads'),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Deprecated routes - remove if not needed
// const documentRoutes = require('./routes/documents');
// const classRoutes = require('./routes/classes');
// const assignmentRoutes = require('./routes/assignments');
// const submissionRoutes = require('./routes/submissions');
// const notificationRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- SQLite: Create users table if not exists ---
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  )
`);

// --- SQLite Signup/Login Endpoints ---
app.post('/api/auth/signup/:role', async (req, res) => {
  const { name, email, password } = req.body;
  const role = req.params.role;
  if (!['user', 'admin'].includes(role)) return res.status(400).json({ message: 'Invalid role.' });
  if (role === 'admin') {
    // Only allow default admin
    if (email !== 'nuvai@gmail.com' || password !== 'Nuvai@123') {
      return res.status(403).json({ message: 'Only the default admin can be created.' });
    }
    db.get('SELECT * FROM users WHERE role = ?', ['admin'], (err, admin) => {
      if (admin) return res.status(403).json({ message: 'Admin already exists.' });
      const passwordHash = bcrypt.hashSync(password, 10);
      db.run(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, passwordHash, role],
        function (err) {
          if (err) return res.status(409).json({ message: 'Email already in use.' });
          res.json({ message: 'Signup successful.' });
        }
      );
    });
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, role],
      function (err) {
        if (err) return res.status(409).json({ message: 'Email already in use.' });
        res.json({ message: 'Signup successful.' });
      }
    );
  }
});

app.post('/api/auth/login/:role', (req, res) => {
  const { email, password } = req.body;
  const role = req.params.role;
  if (role === 'admin') {
    // Only allow default admin
    if (email !== 'nuvai@gmail.com') {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }
  }
  db.get(
    'SELECT * FROM users WHERE email = ? AND role = ?',
    [email, role],
    async (err, user) => {
      if (err || !user) return res.status(401).json({ message: 'Login failed.' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Login failed.' });
      // Remove password before sending user object
      const { password: _pw, ...safeUser } = user;
      res.json({ message: 'Login successful.', user: safeUser });
    }
  );
});

// --- SQLite: Create uploads table if not exists ---
db.run(`
  CREATE TABLE IF NOT EXISTS uploads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT,
    fileName TEXT,
    filePath TEXT,
    uploadedAt TEXT
  )
`);

// --- File Upload Endpoint ---
app.post('/api/user/upload', upload.single('file'), (req, res) => {
  // For demo, get user email from body (in production, use auth)
  const userEmail = req.body.email || 'abc@gmail.com'; // fallback for demo
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
  const fileName = req.file.originalname;
  const filePath = req.file.filename;
  const uploadedAt = new Date().toISOString();
  db.run(
    'INSERT INTO uploads (user_email, fileName, filePath, uploadedAt) VALUES (?, ?, ?, ?)',
    [userEmail, fileName, filePath, uploadedAt],
    function (err) {
      if (err) return res.status(500).json({ message: 'Failed to save upload.' });
      res.json({ message: 'Upload successful.' });
    }
  );
});

// --- Upload History Endpoint ---
app.get('/api/user/uploads', (req, res) => {
  // For demo, get user email from query (in production, use auth)
  const userEmail = req.query.email || 'abc@gmail.com';
  db.all(
    'SELECT fileName, filePath, uploadedAt FROM uploads WHERE user_email = ? ORDER BY uploadedAt DESC',
    [userEmail],
    (err, rows) => {
      if (err) return res.status(500).json([]);
      // Map filePath to fileUrl
      const uploads = rows.map(u => ({
        fileName: u.fileName,
        uploadedAt: u.uploadedAt,
        fileUrl: `/uploads/${u.filePath}`,
      }));
      res.json(uploads);
    }
  );
});

// Fetch all users
app.get('/api/users', (req, res) => {
  db.all('SELECT id, name, email, role FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch users.' });
    }
    res.json(rows);
  });
});

// Fetch all uploads
app.get('/api/uploads', (req, res) => {
  db.all('SELECT * FROM uploads', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to fetch uploads.' });
    }
    res.json(rows);
  });
});

// app.use('/api/auth', authRoutes); // Deprecated, removed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/api/documents', documentRoutes);
// app.use('/api/classes', classRoutes);
// app.use('/api/assignments', assignmentRoutes);
// app.use('/api/submissions', submissionRoutes);
// app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.send('Docky backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 