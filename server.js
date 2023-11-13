const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk mengizinkan cache
const allowCache = (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600'); // Mengizinkan cache selama satu jam
  next();
};

// Serve static files (HTML, CSS, JS, images) dengan middleware cache
app.get('/rizaldi.html', allowCache, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'rizaldi.html'));
});

app.get('/style.css', allowCache, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'style.css'));
});

app.get('/your_photo.jpg', allowCache, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'your_photo.jpg'));
});

// Listen to requests on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
