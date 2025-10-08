import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// Use environment variable or default to localhost for development
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/shorten`, {
        originalUrl: originalUrl.trim(),
      });

      setShortUrl(response.data.shortUrl);
      setOriginalUrl('');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShortUrlClick = () => {
    if (shortUrl) {
      window.open(shortUrl, '_blank');
    }
  };

  const copyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl)
        .then(() => {
          alert('URL copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>URL Shortener</h1>
        <p>Shorten your long URLs quickly and easily</p>
        
        <form onSubmit={handleSubmit} className="url-form">
          <div className="input-group">
            <input
              type="text"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="Enter your long URL here (e.g., https://example.com/very-long-path)"
              required
            />
            <button type="submit" disabled={loading || !originalUrl.trim()}>
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {shortUrl && (
          <div className="result">
            <p>Your shortened URL:</p>
            <div className="short-url-container">
              <span className="short-url" onClick={handleShortUrlClick}>
                {shortUrl}
              </span>
              <button onClick={copyToClipboard} className="copy-btn">
                Copy
              </button>
            </div>
            <small>Click the URL to open in new tab, or copy to share</small>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;