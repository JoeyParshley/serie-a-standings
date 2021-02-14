'use strict'

const Hapi = require('hapi');
const Request = require('request');
const Vision = require('vision');
const Handlebars = require('handlebars');
const LodashFilter = require('lodash.filter');
const LodashTake = require('lodash.take');

const server = new Hapi.Server();

server.connection({
  host: '127.0.0.1',
  port: 3000
});

// Register vision for our views
server.register(Vision, (err) => {
  server.views({
    engines: {
      html: Handlebars
    },
    relativeTo: __dirname,
    path: './views',
  });
});

/*
  Create home route to display standings
  - route is a GET request to the project home page ('/')
  - one route is hit, make an API request to Football-data API
  - Using the Request HTTP client, we make GET request on Football-data API
  - competitions/{id}/leagueTable endpoint with a specific competition ID
    which will get the League table for the competition
    - 438 ius the ID for Serie A
    - so getting the league table for Serie A
  - then send the respo

 */
server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply){
    Request.get('https://api.football-data.org/v1/competitions/438/leagueTable',
        function (error, response, body) {
          if (error) {
            throw error;
          }

          const data = JSON.parse(body);
          reply.view('index', {result: data});
        });
  }
});

// simple helper fuinction that extracts team ID from the team URL
Handlebars.registerHelper('teamID', function (teamUrl) {
  return teamUrl.slice(38);
});

server.start((err) => {
  if (err) {
    throw err;
  }

  console.log(`Server running at: ${server.info.uri}`);
});