const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const mongoose = require('mongoose');

// Get all books with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const books = await Book.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .maxTimeMS(20000)  // Set maximum execution time to 20 seconds
            .lean()  // Convert to plain JavaScript objects
            .exec();

        const total = await Book.countDocuments();

        res.json({
            books,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalBooks: total
        });
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).json({ 
            message: 'Error fetching books', 
            error: err.message 
        });
    }
});

// Add new book
router.post('/', async (req, res) => {
    try {
        if (!req.body.title || !req.body.author) {
            return res.status(400).json({ 
                message: 'Title and author are required' 
            });
        }

        const existingBook = await Book.findOne({
            title: req.body.title,
            author: req.body.author
        });

        if (existingBook) {
            return res.status(409).json({ 
                message: 'A book with this title and author already exists' 
            });
        }

        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            category: req.body.category,
            publishedYear: parseInt(req.body.publishedYear)
        });

        const newBook = await book.save();
        console.log('New book added:', newBook);
        res.status(201).json(newBook);
    } catch (err) {
        console.error('Error adding book:', err);
        if (err.code === 11000) {
            res.status(409).json({ 
                message: 'A book with this title and author already exists' 
            });
        } else {
            res.status(400).json({ message: 'Error adding book', error: err.message });
        }
    }
});

// Update book
router.put('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        book.title = req.body.title;
        book.author = req.body.author;
        book.category = req.body.category;
        book.publishedYear = req.body.publishedYear;

        const updatedBook = await book.save();
        console.log('Book updated:', updatedBook);
        res.json(updatedBook);
    } catch (err) {
        console.error('Error updating book:', err);
        res.status(400).json({ message: 'Error updating book', error: err.message });
    }
});

// Delete book
router.delete('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        console.error('Invalid ID:', req.params.id);
        return res.status(400).json({ message: 'Invalid ID' });
    }

    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            console.error('Book not found:', req.params.id);
            return res.status(404).json({ message: 'Book not found' });
        }

        console.log('Book deleted successfully:', book);
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        console.error('Error deleting book:', err);
        res.status(500).json({ message: 'Error deleting book', error: err.message });
    }
});

module.exports = router;