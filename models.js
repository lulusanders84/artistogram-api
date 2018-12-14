'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  name: {
    firstName: String,
    lastName: String,
  },
  username: {
      type: String,
      unique: true
  },
  password: String,
  savedPlaylists: [],
  savedArtistograms: []
});

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', userSchema);

module.exports = {User};
