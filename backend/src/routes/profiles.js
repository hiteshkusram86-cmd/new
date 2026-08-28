const express = require('express');
const prisma = require('../prismaClient');
const auth = require('../middleware/auth');

const router = express.Router();

// List / search
router.get('/', async (req, res) => {
  const q = req.query.q || '';
  try {
    const profiles = await prisma.developerProfile.findMany({
      where: {
        OR: [
          { bio: { contains: q, mode: 'insensitive' } },
          { title: { contains: q, mode: 'insensitive' } },
          { skills: { contains: q, mode: 'insensitive' } },
          { location: { contains: q, mode: 'insensitive' } }
        ]
      },
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const profile = await prisma.developerProfile.findUnique({ where: { id }, include: { user: true } });
    if (!profile) return res.status(404).json({ error: 'Not found' });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create (auth)
router.post('/', auth, async (req, res) => {
  const { title, bio, skills, github, linkedin, avatar, location } = req.body;
  try {
    // ensure user doesn't already have a profile
    const existing = await prisma.developerProfile.findUnique({ where: { userId: req.user.id } });
    if (existing) return res.status(400).json({ error: 'Profile already exists for this user' });
    const profile = await prisma.developerProfile.create({ data: { userId: req.user.id, title, bio, skills, github, linkedin, avatar, location } });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update (auth, owner)
router.put('/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body;
  try {
    const profile = await prisma.developerProfile.findUnique({ where: { id } });
    if (!profile) return res.status(404).json({ error: 'Not found' });
    if (profile.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    const updated = await prisma.developerProfile.update({ where: { id }, data });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete (auth, owner)
router.delete('/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  try {
    const profile = await prisma.developerProfile.findUnique({ where: { id } });
    if (!profile) return res.status(404).json({ error: 'Not found' });
    if (profile.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await prisma.developerProfile.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user's profile
router.get('/me/profile', auth, async (req, res) => {
  try {
    const profile = await prisma.developerProfile.findUnique({ where: { userId: req.user.id } });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
