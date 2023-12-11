const express = require('express');
const mongoose = require('mongoose');
const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');
const bodyParser = require('body-parser');
const { ERROR_NOT_FOUND } = require('./utils/errors');
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: "6575902d35bbbc881f8eae3d"
  };

  next();
});

app.use('/users', routeUsers);
app.use('/cards', routeCards);

app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страницы по запрошенному URL не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});