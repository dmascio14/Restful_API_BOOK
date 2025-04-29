const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const booksFilePath = path.join(__dirname, 'books.json');

// Load books from file
let books = [];

const loadBooksFromFile = () => {
  try {
    if (fs.existsSync(booksFilePath)) {
      const data = fs.readFileSync(booksFilePath, 'utf-8');
      books = JSON.parse(data);
    } else {
      books = [];
    }
  } catch (err) {
    console.error('Failed to load books.json', err);
    books = [];
  }
};

// Save books to file
const saveBooksToFile = () => {
  try {
    fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));
  } catch (err) {
    console.error('Failed to save books.json', err);
  }
};

// Load books when server starts
loadBooksFromFile();

// API routes

app.get('/api/books', (req, res) => {
  res.json(books);
});

app.post('/api/books', (req, res) => {
  const { title, author } = req.body;
  const newBook = {
    id: books.length > 0 ? books[books.length - 1].id + 1 : 1,
    title,
    author,
  };
  books.push(newBook);
  saveBooksToFile();
  res.status(201).json(newBook);
});

app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const bookId = parseInt(id);
  const index = books.findIndex(book => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    saveBooksToFile();
    res.status(200).json({ message: 'Book deleted' });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});