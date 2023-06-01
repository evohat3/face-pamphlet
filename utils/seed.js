const connection = require('../config/connection');
const User = require('../models/user');



connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');

  const userData = [
    {

      username: 'JohnDoe',
      email: 'johndoe@example.com',
      thoughts: [],
      friends: [],
    },
    {

      username: 'JaneSmith',
      email: 'janesmith@example.com',
      thoughts: [],
      friends: [],
    },
    {

      username: 'BobJohnson',
      email: 'bobjohnson@example.com',
      thoughts: [],
      friends: [],
    },
    // Add more user objects as needed
  ];

  async function seedUsers() {
    try {
      await User.deleteMany({}, { timeout: 60000 }); // Clear existing users
      await User.insertMany(userData); // Seed the users collection
      console.log('Seed data inserted successfully.');
    } catch (error) {
      console.error('Error seeding users:', error);
    }
  }

  seedUsers();
});