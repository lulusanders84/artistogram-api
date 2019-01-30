const express = require('express');
const { SPOTIFY_CLIENT_ENCODED } = require('../config');
const spotifyBaseUrl = "https://api.spotify.com/v1";

const optionsObj = (url, token) => {
  return {
    url,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    json: true
  };
}
const tokenRequestOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + SPOTIFY_CLIENT_ENCODED
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

const searchRequestOptions = (artist, token) => {
  const artistUri = encodeURI(artist);
  const url = `${spotifyBaseUrl}/search?q=${artistUri}&type=artist`;
  return optionsObj(url, token);
}

const yearRequestOptions = (id, token) => {
  const url = `${spotifyBaseUrl}/artists/${id}/albums?offset=0&limit=50&include_groups=album&market=US`;
  return optionsObj(url, token);
}

const relatedRequestOptions = (id, token) => {
  const url = `${spotifyBaseUrl}/artists/${id}/related-artists`;
  return optionsObj(url, token);
}


module.exports = {
  tokenRequestOptions,
  searchRequestOptions,
  yearRequestOptions,
  relatedRequestOptions
};
