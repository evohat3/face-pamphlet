const { Thoughts, User} = require('../models/');

const { reactionSchema } = require('../models/thought')

module.exports = { 
  async getThoughts(req, res) {
    try { 
          const thoughts = await Thoughts.find();
          res.status(200).json(thoughts);
        }catch (err) {
        res.status(500).json(err)}
    },

async getSingleThought(req, res) {
  try {
    const thought = await Thoughts.findOne({_id: req.params.thoughtId});

    if (!thought) {
      return res.status(400).json({message: 'no Thought with that ID'})
    }
    res.status(200).json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
},

    async createThought(req, res) {
        try {

          const { userId } = req.params;
          const { thoughtText } = req.body;

          const user = await User.findById(userId);
          const username = user.username;

            const thought = await Thoughts.create({
              thoughtText,
              username,
            });
            const thoughtId = thought.id;

            const updatedUser = await User.findOneAndUpdate(
              { _id: userId },
              { $push: { thoughts: thoughtId } },
              { new: true }
            );
        

            if (!updatedUser) {
              return res.status(404).json({ message: 'No user with that ID' });
            }
        
            res.status(200).json({ updatedUser, message: 'Thought Added' });
          } catch (err) {
            res.status(500).json(err);
          }
        },

async updateThought(req,res) {
  try {
const thought = await Thoughts.findOneAndUpdate(
  {_id: req.params.thoughtId},
  {$set: {thoughtText: req.body.thoughtText}},
  {new: true}
);

if (!thought) {
  return res.status(400).json({message: 'there are no thoughts with that ID'})
}

res.status(200).json({thought, message: 'your thought has been updated!'})
  }catch (err) {

  }
},

      async RemoveThought(req,res) {
        try {

          const thought = await Thoughts.findOneAndRemove({_id: req.params.thoughtId})

          const userThought = await User.findByIdAndUpdate(
            req.params.userId,
            { $pull: { thoughts: req.params.thoughtId}},
            { new: true }
          );

          if (!thought) {
            return res.status(404).json({ message: 'No Thought with that ID'})
          }
          res.status(200).json({userThought, message: `you have removed your thought: ${req.params.thoughtId}`})
        }catch {
          res.status(500).json(err);
        }
      },
      async addComment(req, res) {
        try {
          const { thoughtId, userId } = req.params;
          const { reactionBody } = req.body;
      
          // Retrieves the username associated with req.params.userId
          const user = await User.findById(userId);
          const username = user.username;
      
          const thought = await Thoughts.findById(thoughtId);
      
          if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
          }
      
          thought.reactions.push({
            reactionBody,
            username,
          });
      
          const updatedThought = await thought.save();
      
          res.status(200).json({ updatedThought, message: `Your comment was added ${username}` });
        } catch (err) {
          res.status(500).json(err);
        }
      },

    async deleteComment(req, res) {
      try {
        const thoughtId = req.params.thoughtId;
        const reactionId = req.params.reactionId;
    
        const thought = await Thoughts.findByIdAndUpdate(
          thoughtId,
          { $pull: { reactions: { reactionId } } },
          { new: true }
        );
    
        if (!thought) {
          return res.status(404).json({ message: 'No thought with that ID' });
        }
    
        res.status(200).json({ thought, message: 'Reaction deleted' });
      } catch (err) {
        res.status(500).json(err);
      }
    }
}