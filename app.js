const express = require('express');
const mongoose = require('mongoose');
const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');
const bodyParser = require('body-parser');
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: "6575902d35bbbc881f8eae3d"
  };

  next();
});

app.use(routeCards);
app.use(routeUsers);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});