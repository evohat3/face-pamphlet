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

            const thought = await Thoughts.create(req.body);
            const thoughtId = thought.id;

          const user = await User.findOneAndUpdate(
            { _id: req.params.userId},
            { $push: {thoughts: thoughtId} },
            {new: true}
          );

          if(!user) {
            return res.status(404).json({ message: 'No user with that ID' })
          }
          res.status(200).json({user, message: 'Thought Added'});
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

            const reactionBody = {
              reactionBody: req.body.reactionBody,
              username: req.body.username
            }
            const thought = await Thoughts.findById(req.params.thoughtId);

            if (!thought) {
                return res.stauts(404).json({message: 'no thought with that ID'});
            }

            thought.reactions.push(reactionBody);
            const updatedThought = await thought.save()

    res.status(200).json({updatedThought, message: 'your comment was added!'});
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