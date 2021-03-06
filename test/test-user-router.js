"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');

const { DATABASE_URL } = require("../config");
const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

let testUser;

let authToken;

describe('user/auth router', function() {

	before(function() {
		return runServer(DATABASE_URL);
	});
	after(function() {
		return closeServer();
	});

	it('should sign up new user on POST', function() {
		return chai.request(app)
		.post("/api/users")
    .send({
     "username": "testUser",
     "password": "testPassword",
		 "email": "email@email.com",
     "firstName": "Test",
     "lastName": "User"
     })
		.then(function(res) {
      testUser = res.body;
			expect(res).to.have.status(201);
		})
	})

	it('should send token on POST to /login', function() {
		return chai.request(app)
		.post("/api/login")
		.send({
			"username": "testUser",
			"password": "testPassword"
		})
		.then(function(res) {
			authToken = res.body.authToken;
			expect(res).to.have.status(200);
		})
	})

	it('should retrieve user on GET', function() {
		return chai.request(app)
		.get(`/api/user/${testUser}`)
		.set("Authorization", `Bearer ${authToken}`)
		.then(function(res) {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
		})
	})

	it('should add playlist on PUT', function() {
		return chai.request(app)
		.put(`/api/playlists/${testUser}`)
		.set("Authorization", `Bearer ${authToken}`)
		.send("playlist tester")
		.then(function(res) {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
		})
	})

  it('should add artistogram on PUT', function() {
		return chai.request(app)
		.put(`/api/artistograms/${testUser}`)
		.set("Authorization", `Bearer ${authToken}`)
		.send("artistogram tester")
		.then(function(res) {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
		})
	})

	it('should delete user on DELETE', function() {
		return chai.request(app)
		.delete(`/api/users/${testUser}`)
		.then(function(res) {
			expect(res).to.be.status(200);
			expect(res).to.be.json;
		})
	})
})
