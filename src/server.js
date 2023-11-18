// index.js
const express = require('express');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(routes)

module.exports = server;