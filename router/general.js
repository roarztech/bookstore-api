const express = require('express');
const axios = require('axios');
let books = require('../books.json');

const general = express.Router();

// Task 2: Get all books using async/await with Axios
general.get('/getallbooks', async (req, res) => {
  try {
    // Simulating async operation with promise
    const getAllBooks = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(books);
        }, 100);
      });
    };

    const allBooks = await getAllBooks();
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving books', error: error.message });
  }
});

// Task 3: Get books by ISBN using promise callbacks
general.get('/getbooksbyISBN/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = Object.values(books).find(b => b.isbn === isbn);
        if (book) {
          resolve(book);
        } else {
          reject(new Error('Book not found'));
        }
      }, 100);
    });
  };

  getBookByISBN(isbn)
    .then(book => {
      return res.status(200).json(book);
    })
    .catch(error => {
      return res.status(404).json({ message: error.message });
    });
});

// Task 4: Get books by author using async/await
general.get('/getbooksbyauthor/:author', async (req, res) => {
  try {
    const author = req.params.author;

    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const booksByAuthor = Object.values(books).filter(
            b => b.author.toLowerCase() === author.toLowerCase()
          );
          if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
          } else {
            reject(new Error('No books found by this author'));
          }
        }, 100);
      });
    };

    const booksByAuthor = await getBooksByAuthor(author);
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

// Task 5: Get books by title using promise callbacks
general.get('/getbooksbytitle/:title', (req, res) => {
  const title = req.params.title;

  const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const booksByTitle = Object.values(books).filter(
          b => b.title.toLowerCase().includes(title.toLowerCase())
        );
        if (booksByTitle.length > 0) {
          resolve(booksByTitle);
        } else {
          reject(new Error('No books found with this title'));
        }
      }, 100);
    });
  };

  getBooksByTitle(title)
    .then(books => {
      return res.status(200).json(books);
    })
    .catch(error => {
      return res.status(404).json({ message: error.message });
    });
});

// Task 6: Get book review using async/await
general.get('/getbookreview/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;

    const getReviews = (isbn) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const book = Object.values(books).find(b => b.isbn === isbn);
          if (book) {
            resolve(book.reviews);
          } else {
            reject(new Error('Book not found'));
          }
        }, 100);
      });
    };

    const reviews = await getReviews(isbn);
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

module.exports = general;