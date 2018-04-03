"use strict";

const url = 'http://api.sportsdatabase.com/mlb/query.json?sdql=date%2Cteam%2Co%3Ateam%2Cline%2Ctotal%40season&output=json&api_key=guest';
const Sequelize = require('sequelize');
const request = require('request-promise');
const path = require('path');
const fs = require('fs');

const sequelize = new Sequelize('mlb_bets', 'mlb_bets', 'mlb_bets', {
  host: "localhost",
  port: 5432,
  dialect: 'postgres'
});

let models = {};

var Change = sequelize.define('change', {
  changed: Sequelize.BOOLEAN
});

sequelize.sync();

var _response;

setInterval(() => {
  console.log('doing it')
  request(url).then((response) => {
    console.log('fetched');
    if (_response) {
      if (_response !== response) {
        Change.create({
          changed: true
        }).then(() => {
          _response = response;
        })
      }
    } else {
      _response = response;
    }
  });
}, 300000);