const express = require('express');
const request = require('request');

const { relatedRequestOptions } = require('./request-options');

const requestRelatedArtists = (id, token, firstRequest) => {
  console.log("request related artists running");
  return new Promise((resolve, reject) => {
    request.get(relatedRequestOptions(id, token), function(error, response, body) {
      if(firstRequest) {
        resolve(body.artists);
      } else {
        const artists = body.artists.reduce((acc, artist, index) => {
          if(index < 5) {
            acc.push(artist);
          }
          return acc;
        }, []);
        resolve(artists);
      }
    })
  })
}



module.exports = { requestRelatedArtists };
