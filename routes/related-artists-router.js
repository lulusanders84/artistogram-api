const express = require('express');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { getToken } = require('../requests/get-token');
const { requestSpotifySearch } = require('../requests/get-spotify-search');
const { createArtistsArr } = require('./create-artists-data');
const { sortByDecade } = require('./create-decades')
//request received for artistObjs for related artists
  router.post('/', jsonParser, (req, res) => {
    getToken().then(token => {
      return {
        artists: req.body.artists,
        token,
      };
    }).then(res => {
      const { artists, token } = res;
      let artistObjs = findMatchingSearchResult(artists, token);
      return {
        artistObjs,
        token,
      };
    }).then(res => {
      return Promise.all([res.artistObjs, res.token]).then(([artistObjs, token]) => {
        return createArtistsArr(artistObjs, token);
      })
    }).then(artists => {
      artists = sortByDecade(artists);
      return res.status(200).json(artists);
    })

      // res.status(200).json(obj);
    });

const findMatchingSearchResult = (artists, token) => {
  let artistObjs = artists.map(artist => {
    return requestSpotifySearch(artist, token).then(resObj => {
      const { searchResults, name, token } = resObj;
      let match = "No artist found";
      for(let i=0; i<searchResults.length; i++) {
        if(searchResults[i].name.toLowerCase() === name.toLowerCase()) {
          match = searchResults[i];
          break;
        }
      }
      return match;
    })
  })
  return Promise.all(artistObjs).then(res => {return res});
}

// //retrieve spotify ids from spotify for related artists
//   const requestRelatedArtists = (artists) => {
//     request.post(authOptions, function(error, response, body) {
//         returns list of search results
//         //search list for entry exactly matching related artists
//     const searchForRelatedArtistMatch = (results, artist) => {
//       //for each result check for match with artist
//       return matching result
//     })
//       //pass array of matching results
//       return resultsArr;
//     })
// //retreive album object for each related artist
//   const requestAlbumObject = (artist) => {
//     request.get(albumsRequestOptions, function(error, response, body) {
//       //find earliest album release date (albumArr.length -1)
//       const findFirstActiveYear = (albums) => {
//         add active year to artist obj
//         return artist obj
//       }
// //respond with an array of artist objs
//   res.json(artistObjs)
module.exports = router;
