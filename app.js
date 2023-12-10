const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(routes);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: "6575902d35bbbc881f8eae3d"
  };

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});