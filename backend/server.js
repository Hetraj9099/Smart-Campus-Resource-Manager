const express = require('express');
const path = require('path');
const resourceRoutes = require('./routes/resourceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
require('./db');

const app = express();
const PORT = 3000;
const frontendPath = path.join(__dirname, '..', 'frontend');

// Parse JSON request bodies for API calls.
app.use(express.json());

// Serve the frontend pages and static assets.
app.use(express.static(frontendPath));

// Load application routes.
app.use(resourceRoutes);
app.use(bookingRoutes);

app.get('/', (request, response) => {
  response.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
