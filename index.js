const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const generalRoutes = require('./router/general.js');
const authRoutes = require('./router/auth_users.js');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: 'bookstore_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Routes
app.use('/customer', authRoutes);
app.use('/', generalRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});