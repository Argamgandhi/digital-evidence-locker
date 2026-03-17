const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { syncDB } = require('./models');

dotenv.config();

const app = express();

// CORS - allow Vercel frontend + local dev
app.use(cors({
  origin: [
    'https://digital-evidence-locker-steel.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',   require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/verify', require('./routes/verify'));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'EvidenceLocker backend running' });
});

const PORT = process.env.PORT || 5000;

syncDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(console.error);