const { User, Thoughts } = require('../models');


module.exports = {

    async getUsers(req, res) {
        try {
          const users = await User.find();
          res.json(users);
        } catch (err) {
          res.status(500).json(err);
        }
      },
      async createUser(req, res) {
        try {
          const user = await User.create(req.body);
          res.status(200).json({user, message: `Welcome to Face-pamphlet! make sure to copy your user.id! ${user.id}`});
        } catch (err) {
          res.status(500).json(err);
        }
      },

      async getSingleUser(req, res) {
        try {
          const user = await User.findOne({ _id: req.params.userId });
    
          if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
          }
    
          res.status(200).json({user, message: 'Single User Retrieved!'});
        } catch (err) {
          res.status(500).json(err);
        }
      },

      async updateUser(req, res) {
        try {
          const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: { 
              username: req.body.username,
              email: req.body.email} },
            { runValidators: true, new: true} 
          );
          
          if (!user) {
            return res.status(404).json({ message: 'No user with that ID' });
          }
    
          res.status(200).json({user, message: `your new username is ${user.username} and your email is ${user.email}`});
        } catch (err) {
          res.status(500).json(err);
        }
      },

    async deleteUser(req, res) {
      try{ 
        const user = await User.findOneAndRemove({_id: req.params.userId});
        if (!user) {
          return res.status(404).json({ message: 'No user with that ID' });
        }

        await Thoughts.deleteMany({ username: user.username });
  
        res.status(200).json({user, message: 'Thank you for Coming!'});
      } catch (err) {
        res.status(500).json(err);
      }
    },

    async addFriend(req, res) {

      try{
      const friend = await User.findOneAndUpdate(
        { _id: req.params.userId},
        { $addToSet: { friends: req.params.friendId} },
        { new: true }
  );

  if (!friend) {
    return res.status(404).json({ message: 'No user with that ID' });
  }
  res.status(200).json({friend, message: 'You Have Made A New Friend! 😀 '});
      } catch (err) {
        res.status(500).json(err);
      }
    },

    async removeFriend(req, res) {
      try{ 
        const friend = await User.findByIdAndUpdate(
          req.params.userId, 
          { $pull: { friends: req.params.friendId} },
          { new: true }
          );

        if (!friend) {
          return res.status(404).json({ message: 'No user with that ID' });
        
        }
        res.status(200).json({friend, message: `you have removed ${req.params.friendId} 😡 `});
      } catch (err) {
        res.status(500).json(err);
      }
    }


}