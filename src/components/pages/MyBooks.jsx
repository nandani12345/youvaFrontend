import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [rating, setRating] = useState({});
  const [hover, setHover] = useState({});
  const [likedBooks, setLikedBooks] = useState({});

  const token = localStorage.getItem('token');

  // Fetch all books
  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/books/mybooks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooks(res.data);
      } catch (err) {
        console.error('Error fetching books:', err.response?.data || err.message);
      }
    };

    fetchMyBooks();
  }, [token]);

  // Handle Review Submission
  const handleReviewSubmit = async (bookId, starValue) => {
    try {
      await axios.post(
        `http://localhost:5000/api/books/${bookId}/review`,
        { rating: starValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Review submitted!');
    } catch (err) {
      console.error('Error submitting review:', err.response?.data || err.message);
    }
  };

  // Handle Like
  const handleLike = async (bookId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/books/${bookId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Book liked!');
      setLikedBooks((prev) => ({ ...prev, [bookId]: true }));
    } catch (err) {
      console.error('Error liking book:', err.response?.data || err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Books</h2>

      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {books.map((book) => (
            <div
              key={book._id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                width: '250px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <img
                src={book.imageURL}
                alt={book.title}
                style={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                }}
              />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <p><strong>Condition:</strong> {book.condition}</p>

              {/* Like Button */}
              <button
                onClick={() => handleLike(book._id)}
                disabled={likedBooks[book._id]}
                style={{
                  backgroundColor: likedBooks[book._id] ? 'gray' : '#4caf50',
                  color: 'white',
                  border: 'none',
                  padding: '8px',
                  marginBottom: '8px',
                  cursor: likedBooks[book._id] ? 'not-allowed' : 'pointer',
                  width: '100%',
                }}
              >
                {likedBooks[book._id] ? 'Liked' : 'Like'}
              </button>

              {/* Star Rating */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}>
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <label key={index}>
                      <input
                        type="radio"
                        name={`rating-${book._id}`}
                        value={starValue}
                        onClick={() => {
                          setRating({ ...rating, [book._id]: starValue });
                          handleReviewSubmit(book._id, starValue);
                        }}
                        style={{ display: 'none' }}
                      />
                      <span
                        style={{
                          fontSize: '24px',
                          color:
                            starValue <= (hover[book._id] || rating[book._id] || 0)
                              ? '#ffc107'
                              : '#e4e5e9',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={() => setHover({ ...hover, [book._id]: starValue })}
                        onMouseLeave={() => setHover({ ...hover, [book._id]: null })}
                      >
                        ★
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
