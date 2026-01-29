const express = require('express');
let books = require('../books.json');

const auth_users = express.Router();

// In-memory user storage
let users = [];

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.status(401).json({ message: 'Unauthorized. Please login first.' });
  }
};

// Helper function to check if user exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Helper function to authenticate user
const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);
  if (user && user.password === password) {
    return true;
  }
  return false;
};

// Task 7: Register a new user
auth_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: 'User already exists' });
  }

  users.push({ username, password });
  return res.status(201).json({ message: 'User successfully registered. You can now login.' });
});

// Task 8: Login as a registered user
auth_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (!isValid(username)) {
    return res.status(404).json({ message: 'User not found. Please register first.' });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  req.session.user = username;
  return res.status(200).json({ message: 'Login successful', username: username });
});

// Task 9: Add or modify a book review (authenticated users only)
auth_users.put('/reviewadded/:isbn', isAuthenticated, (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.session.user;

  if (!review) {
    return res.status(400).json({ message: 'Review text is required' });
  }

  const book = Object.values(books).find(b => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  // Add or update review
  book.reviews[username] = review;

  return res.status(200).json({
    message: 'Review successfully added/updated',
    book: book
  });
});

// Task 10: Delete a book review (authenticated users only)
auth_users.delete('/deletereview/:isbn', isAuthenticated, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.user;

  const book = Object.values(books).find(b => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (!book.reviews[username]) {
    return res.status(404).json({ message: 'Review not found for this user' });
  }

  // Delete the review
  delete book.reviews[username];

  return res.status(200).json({
    message: 'Review successfully deleted',
    book: book
  });
});

// Logout endpoint
auth_users.post('/logout', isAuthenticated, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    return res.status(200).json({ message: 'Logout successful' });
  });
});

module.exports = auth_users;