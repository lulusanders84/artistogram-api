
const express = require('express');
const request = require('request');

const sortByDecade = (artists) => {
  console.log(artists);
  return artists.sort((a, b) => {
    return a.year - b.year;
  })
}


module.exports = { sortByDecade };
