const express = require('express');
const request = require('request');

const { yearRequestOptions } = require('../requests/request-options');

const getFirstYearActive = (token, name, id) => {
  console.log(name, id);
  const options = yearRequestOptions(id, token);
  return new Promise((resolve, reject) => {
    request.get(options, function(error, response, body) {
      console.log(body);
      resolve(findFirstAlbum(body.items));
    })
  })
}

const findFirstAlbum = (albumsArr) => {
  return albumsArr[albumsArr.length-1].release_date.substring(0, 4);
}

module.exports = { getFirstYearActive };
