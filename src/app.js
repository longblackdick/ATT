const bodyParser = require('body-parser');
const express = require('express'); // express tool kit
const path = require('path');
const cookie = require('cookie-parser');
const session = require('express-session');
const config = require('./config/dev.env');

const app = express();

/**
 * use - middleware
 */
// Set the files under public to static
// after which the public directory becomes the root directory
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(bodyParser.json());// to parse the application/json
app.use(bodyParser.urlencoded({ extended: true }));//  to parse application/x-www-form-urlencoded
app.use(cookie());
app.use(session({
  secret: 'card game',
  resave: true,
  saveUninitialized: true,
}));

// controllers
const indexRouter = require('./controllers/index');
const gameRouter = require('./controllers/game');
const userRouter = require('./controllers/user');

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/game', gameRouter);
app.use((req, res) => {
  const viewDir = path.join(__dirname, 'views');
  res.sendFile(path.join(viewDir, 'error.html'));
});

const port = config.port || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}\n`);
});
