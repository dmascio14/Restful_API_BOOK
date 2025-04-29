import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const addBook = async () => {
    if (title.trim() && author.trim()) {
      try {
        await axios.post('http://localhost:5000/api/books', { title, author });
        setTitle('');
        setAuthor('');
        fetchBooks();
      } catch (error) {
        console.error('Error adding book:', error);
      }
    }
  };

  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Books</h1>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {books.map((book) => (
          <li key={book.id} style={{ marginBottom: '10px' }}>
            <strong>{book.title}</strong> by {book.author}
            <button
              onClick={() => deleteBook(book.id)}
              style={{
                marginLeft: '10px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
                borderRadius: '5px',
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h2>Add a New Book</h2>
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button
          onClick={addBook}
          style={{
            padding: '5px 15px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Add Book
        </button>
      </div>
    </div>
  );
}

export default App;