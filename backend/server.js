const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookRoutes = require('./routes/books');

const app = express();

// Middleware
app.use(cors());  // Allow all origins temporarily for debugging
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);

// MongoDB Connection
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://shivarajswami2:atlas@5600@shiva.mnec1fn.mongodb.net/?retryWrites=true&w=majority&appName=shiva';

mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Could not connect to MongoDB:', err));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});