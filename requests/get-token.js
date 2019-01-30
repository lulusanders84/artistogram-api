const express = require('express');
const request = require('request');

const { tokenRequestOptions } = require('./request-options');

const getToken = () => {
  return new Promise((resolve, reject) => {
    request.post(tokenRequestOptions, function(error, response, body) {
      resolve(body.access_token);
    })
  })
}

module.exports = { getToken };
