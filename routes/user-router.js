const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { User} = require('../models');


// const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/:id', (req, res) => {
  User
    .findOne({"username": req.params.id})
    .then(user => {
      const userData = {
        username: user.username,
        savedPlaylists: user.savedPlaylists,
        savedArtistograms: user.savedArtistograms
      };
      res.status(200).json(userData);
    }).catch(err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    })
})

router.put('/playlists/:id', jsonParser, (req, res) => {
  console.log(req.body);
      User
      .findOneAndUpdate({username: req.params.id}, {$addToSet: {savedPlaylists: req.body}}, {new: true})
      .then(user => {
        res.status(200).json({
          playlists: user.savedPlaylists,
          message: 'Playlist added'
        });
      }).catch(err => {
          console.error(err);
          res.status(500).json({message: 'Internal server error'});
      })
    })

router.put('/artistograms/:id', jsonParser, (req, res) => {
  console.log(req.body);
      User
      .findOneAndUpdate({username: req.params.id}, {$addToSet: {savedArtistograms: req.body}}, {new: true})
      .then(user => {
        res.status(200).json({
          artistograms: user.savedArtistograms,
          message: 'Artistogram added'
        });
      }).catch(err => {
          console.error(err);
          res.status(500).json({message: 'Internal server error'});
      })
    })

router.post('/users', jsonParser, (req, res) => {
    const requiredFields = ['username', 'password'];
    const missingField = requiredFields.find(field => !(field in req.body));
    if (missingField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Missing field',
        location: missingField
      });
    }

    const stringFields = ['username', 'password', 'firstName', 'lastName'];
    const nonStringField = stringFields.find(
      field => field in req.body && typeof req.body[field] !== 'string'
    );

    if (nonStringField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Incorrect field type: expected string',
        location: nonStringField
      });
    }

    // If the username and password aren't trimmed we give an error.  Users might
    // expect that these will work without trimming (i.e. they want the password
    // "foobar ", including the space at the end).  We need to reject such values
    // explicitly so the users know what's happening, rather than silently
    // trimming them and expecting the user to understand.
    // We'll silently trim the other fields, because they aren't credentials used
    // to log in, so it's less of a problem.
    const explicityTrimmedFields = ['username', 'password'];
    const nonTrimmedField = explicityTrimmedFields.find(
      field => req.body[field].trim() !== req.body[field]
    );

    if (nonTrimmedField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Cannot start or end with whitespace',
        location: nonTrimmedField
      });
    }

    const sizedFields = {
      username: {
        min: 1
      },
      password: {
        min: 8,
        // bcrypt truncates after 72 characters, so let's not give the illusion
        // of security by storing extra (unused) info
        max: 72
      }
    };
    const tooSmallField = Object.keys(sizedFields).find(
      field =>
        'min' in sizedFields[field] &&
              req.body[field].trim().length < sizedFields[field].min
    );
    const tooLargeField = Object.keys(sizedFields).find(
      field =>
        'max' in sizedFields[field] &&
              req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField || tooLargeField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: tooSmallField
          ? `Must be at least ${sizedFields[tooSmallField]
            .min} characters long`
          : `Must be at most ${sizedFields[tooLargeField]
            .max} characters long`,
        location: tooSmallField || tooLargeField
      });
    }

    let {username, password, firstName = '', lastName = ''} = req.body;
    // username and password come in pre-trimmed, otherwise we throw an error
    // before this
    firstName = firstName.trim();
    lastName = lastName.trim();
    User.find({username: username})
      .count()
      .then(count => {
        if (count > 0) {
          // There is an existing user with the same username
          return Promise.reject({
            code: 422,
            reason: 'ValidationError',
            message: 'username already taken',
            location: 'username'
          });
        }
        // If there is no existing user, hash the password
        const hash = User.hashPassword(password);
        hash.then(hash => {
          User
        .create({
          username: username,
          password: hash,
          firstName: firstName,
          lastName: lastName,
        })
    .then(user => {
      return res.status(201).json(user);
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error', err: err});
    });
  });
});
});
//
// router.delete('/:id', jsonParser, (req, res) => {
//   User
//   .findByIdAndDelete(req.params.id)
//   .then(user => {
//     res.status(200).json(user);
//   })
// });
module.exports = router;
