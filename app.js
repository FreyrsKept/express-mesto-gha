const express = require('express');
const mongoose = require('mongoose');
const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');
const { errors } = require('celebrate');
const handleError = require('./middlewares/handleError');
const bodyParser = require('body-parser');
const { createUser, loginUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { PORT = 3000 } = process.env;
const app = express();
const routes = require('./routes');
const { validationCreateUser, validationLogin } = require('./middlewares/validation');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use('/users', routeUsers);
app.use('/cards', routeCards);
app.use(auth);
app.use(errors());
app.use(handleError);
app.use(routes)
app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLogin, loginUser);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});