const express = require('express');
const mongoose = require('mongoose');
const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');
const { errors } = require('celebrate');
const handelError = require('./middlewares/handelError');
const bodyParser = require('body-parser');
const { ERROR_NOT_FOUND } = require('./utils/errors');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use('/users', routeUsers);
app.use('/cards', routeCards);
app.use(auth);
app.use(errors());
app.use(handelError);
app.post('/signup', createUser);
app.post('/signin', login);

app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страницы по запрошенному URL не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});