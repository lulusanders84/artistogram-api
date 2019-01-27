const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const request = require('request');
const { SPOTIFY_CLIENT_ENCODED } = require('../../config');
const authRequestUrl = "https://accounts.spotify.com/api/token";
const searchUrl = "https://api.spotify.com/v1/search?";
const {capitalize} = require('../../capitalize');

const { SpotifyId } = require('../../models');

const fetchAndPostArtistSpotifyId = (body, artist) => {
  const token = body.access_token;
  const artistUri = encodeURI(artist);
  const url = `${searchUrl}q=${artistUri}&type=artist&limit=1`;
  const options = {
    url,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    json: true
  };

  return new Promise ((resolve, reject) => {
    request.get(options, function(error, response, body) {
      const idObj = {
        artist: body.artists.items[0].name,
        spotifyId: body.artists.items[0].id
      }
      ;
    resolve (postSpotifyId(idObj));
  })
})
}

const postSpotifyId = (idObj) => {
  const { artist, spotifyId } = idObj;
  return SpotifyId.create({
    artist: artist.toLowerCase(),
    spotifyId,
  }).then(spotifyId => {
    return spotifyId.serialize();
  })
}

router.post('/', jsonParser, (req, res) => {
//   //req.body contains array of artists names
  let artists = req.body.artists;
  artists = artists.map(artist => {
    return artist.toLowerCase();
  })
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + SPOTIFY_CLIENT_ENCODED
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      let artistsData = artists.map(artist => {
        return SpotifyId
           .findOne({"artist": artist})
           .then(spotifyId => {
             if(spotifyId == null) {
               return fetchAndPostArtistSpotifyId(body, artist);
             } else {
               return new Promise((resolve, reject) => {
                 return resolve(spotifyId.serialize());
               })
             }
           })
        })
      Promise.all(artistsData).then(spotifyIds => {
        res.json(spotifyIds);
      })
    }
 })
})

module.exports = router;
