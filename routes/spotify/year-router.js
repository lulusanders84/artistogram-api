const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const request = require('request');

const { SPOTIFY_CLIENT_ENCODED } = require('../../config');
const authRequestUrl = "https://accounts.spotify.com/api/token";

router.post('/', jsonParser, (req, res) => {
//   //req.body contains array of artists names and spotifyids
  let artists = req.body.artists;
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
          return fetchSpotifyAlbums(body, artist);
        })
        Promise.all(artistsData).then(artists => {
          res.json(artists);
        })
    }
  })
})

const fetchSpotifyAlbums = (body, artist) => {
  const token = body.access_token;
  const url = `https://api.spotify.com/v1/artists/${artist.spotifyId}/albums?offset=0&limit=50&include_groups=album&market=US`;
  const options = {
    url,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    json: true
  };
  return new Promise((resolve, reject) => {
    request.get(options, function(error, response, body) {
      resolve({
        artist: artist.name,
        year: findFirstAlbum(body.items)
      })
    })
  })
}

const findFirstAlbum = (albumsArr) => {
  return albumsArr[albumsArr.length-1].release_date.substring(0, 4);
}
module.exports = router;
