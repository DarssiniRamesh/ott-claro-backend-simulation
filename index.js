const express = require('express');
const path = require('path');
const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// API Documentation routes
const apiDocsRouter = require('./routes/api-docs');
app.use('/api-docs', apiDocsRouter);

// Import routes
const navRoutes = require('./routes/navRoutes');

// Use routes
app.use('/nav', navRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});