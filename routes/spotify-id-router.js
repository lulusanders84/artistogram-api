const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const fetch = require('node-fetch');
const request = require('request');
const { SPOTIFY_CLIENT_ENCODED } = require('../config');
const authRequestUrl = "https://accounts.spotify.com/api/token";
const searchUrl = "https://api.spotify.com/v1/search?";

const { SpotifyId } = require('../models');

// your application requests authorization

const fetchArtistSpotifyId = (body, artist) => {

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
    resolve ({
      artist,
      id: body.artists.items[0].id
    })
  })
})
}

function addArtistSpotifyId(artist, token) {
  const artistUri = encodeURI(artist);
  const url = `${searchUrl}q=${artistUri}&type=artist`;
  fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(res => {
    const id = res.artists.items.id;
    const artist = res.artists.items.name;
    SpotifyId
      .create({
        artist,
        id,
      })
      .then(spotifyId => {
        return spotifyId;
      })
  })
}


router.post('/', jsonParser, (req, res) => {
//   //req.body contains array of artists names
  const artists = req.body.artists;

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
               console.log("spotifyId is null", spotifyId);
               return fetchArtistSpotifyId(body, artist);
             } else {
               return new Promise((resolve, reject) => {
                 return resolve(spotifyId.serialize());
               })
             }
           })
        })
      Promise.all(artistsData).then(spotifyIds => {
        console.log(spotifyIds);
        res.json(spotifyIds);
      })
    }
 })
})
      // use the access token to access the Spotify Web API

//     }
//   });
// });
//   .then(token => {
//     console.log(token, "token");
//     const artists = req.body;
//     return artists.map(artist => {
//       SpotifyId
//         .findOne({"artist": artist})
//         .then(spotifyId => {
//           if(spotifyId === null) {
//             return addArtistSpotifyId(artist, token);
//           } else {
//             return spotifyId;
//           }
//         })
//       })
//     })
//     .then(artistIds => {
//       res.status(200).json(artistIds);
//     }).catch(err => {
//         console.error(err);
//         res.status(500).json({message: 'Internal server error'});
//     })
// })
//get request for multiple artist spotify ids
  //if artist is not in collection
    //api request to spotify to get id for artist
    //then post artist to collection
  //find artists in collection and return spotifyids

module.exports = router;
