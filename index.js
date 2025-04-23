const express = require('express');
const app = express();

app.use(express.json());

// Import routes
const navRoutes = require('./routes/navRoutes');

// Use routes
app.use('/nav', navRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});