const express = require('express');
const request = require('request');

const { searchRequestOptions } = require('./request-options');

const requestSpotifySearch = (name, token) => {
  return new Promise((resolve, reject) => {

    request.get(searchRequestOptions(name, token), function(error, response, body) {
      const returnObj = {
        searchResults: body.artists.items,
        name,
        token,
      }
      resolve(returnObj);
    })
  })
}

module.exports = { requestSpotifySearch};
