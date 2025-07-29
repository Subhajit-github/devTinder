const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
  fromUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  toUserID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['ignored', 'accepted', 'rejected', 'interested', 'pending'],
    default: 'pending',
    message: '{VALUE} is not a valid status. Status must be one of the following: ignored, accepted, rejected, interested, pending.',
  },
}, { timestamps: true });

connectionRequestSchema.index({ fromUserID: 1, toUserID: 1 }, { unique: true }); // Ensure unique connection requests between two users

connectionRequestSchema.index({ fromUserName: 1, toUserName: 1 }); // Ensure unique connection requests based on user names

connectionRequestSchema.pre('save', function(next) {
  //check if fromUserID and toUserID are the same
  if (this.fromUserID.toString() === this.toUserID.toString()) {
    const error = new Error('fromUserID and toUserID must be different');
    error.statusCode = 400;
    return next(error);
  }
  next();
});

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest;
// This code defines the schema and model for connection requests in a MongoDB database using Mongoose.