const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profiles');
const prisma = require('./prismaClient');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'DevProfileHub API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

module.exports = app;
