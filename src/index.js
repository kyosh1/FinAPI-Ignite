const express = require('express')
const { v4: uuidv4 } = require('uuid');

const app = express()
const routes = require('./routes')

app.use(express.json());

app.use(routes)

app.listen(3333);
