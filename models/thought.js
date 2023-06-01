const { Schema, model } = require('mongoose');

const reactionSchema = require('./reaction')


const thoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    username: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
      }, 
      reactions: [reactionSchema],
},
{
    toJSON: {
      getters: true,
    },
  }

);

const Thoughts = model('thoughts', thoughtSchema);

module.exports = Thoughts;