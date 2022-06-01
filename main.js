const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost/users')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('Could not connect to MongoDB...'));
// middleare function
app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.POR || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));