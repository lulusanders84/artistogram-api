const express = require('express');
const request = require('request');

const { getFirstYearActive } = require('./get-year');

const createArtistsArr = (artists, token) => {
  const artistsData = artists.map(artist => {
    const { name, id } = artist;
    return getFirstYearActive(token, name, id)
      .then(year => {
        return {
          name,
          spotifyId: id,
          year,
          imageUrl: artist.images[0].url
        }
    })
  })
  return Promise.all(artistsData).then(artists => {
    console.log(artists)
    return artists;
  })
}

module.exports = { createArtistsArr };
