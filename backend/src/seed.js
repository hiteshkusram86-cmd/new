require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('./prismaClient');

async function main() {
  await prisma.developerProfile.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('password123', 10);
  const alice = await prisma.user.create({ data: { email: 'alice@example.com', password, name: 'Alice Dev' } });
  const bob = await prisma.user.create({ data: { email: 'bob@example.com', password, name: 'Bob Builder' } });

  await prisma.developerProfile.create({ data: { userId: alice.id, title: 'Full-Stack Developer', bio: 'Building web apps with JS.', skills: 'javascript,react,node,prisma', github: 'https://github.com/alice', linkedin: '', avatar: '', location: 'NYC' } });
  await prisma.developerProfile.create({ data: { userId: bob.id, title: 'Mobile Developer', bio: 'iOS and Android apps.', skills: 'kotlin,swift,react-native', github: 'https://github.com/bob', linkedin: '', avatar: '', location: 'San Francisco' } });

  console.log('Seeded DB');
}

main()
  .catch(e => console.error(e))
  .finally(async () => { await prisma.$disconnect(); });
