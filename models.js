'use strict';

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  name: {
    firstName: String,
    lastName: String,
  },
  email: String,
  username: {
      type: String,
      unique: true
  },
  password: String,
  savedPlaylists: [],
  savedArtistograms: []
});

userSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    savedPlaylists: this.savedPlaylists || '',
    savedArtistograms: this.savedArtistograms || ''
  };
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};


const User = mongoose.model('User', userSchema);

module.exports = {User};
