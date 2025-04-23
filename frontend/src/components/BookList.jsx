import React, { useState, useEffect } from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import { getAllBooks, addBook, updateBook, deleteBook } from '../services/api';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentBook, setCurrentBook] = useState({
        title: '',
        author: '',
        category: '',
        publishedYear: ''
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const data = await getAllBooks();
            setBooks(data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const handleOpen = (book = null) => {
        if (book) {
            setCurrentBook(book);
            setEditMode(true);
        } else {
            setCurrentBook({
                title: '',
                author: '',
                category: '',
                publishedYear: ''
            });
            setEditMode(false);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentBook({
            title: '',
            author: '',
            category: '',
            publishedYear: ''
        });
    };

    const handleChange = (e) => {
        setCurrentBook({
            ...currentBook,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await updateBook(currentBook._id, currentBook);
            } else {
                await addBook(currentBook);
            }
            fetchBooks();
            handleClose();
        } catch (error) {
            console.error('Error saving book:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteBook(id);
            fetchBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                Add New Book
            </Button>

            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Published Year</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map((book) => (
                            <TableRow key={book._id}>
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>{book.category}</TableCell>
                                <TableCell>{book.publishedYear}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpen(book)}>Edit</Button>
                                    <Button onClick={() => handleDelete(book._id)} color="error">
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editMode ? 'Edit Book' : 'Add New Book'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Title"
                        fullWidth
                        value={currentBook.title}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="author"
                        label="Author"
                        fullWidth
                        value={currentBook.author}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="category"
                        label="Category"
                        fullWidth
                        value={currentBook.category}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="publishedYear"
                        label="Published Year"
                        type="number"
                        fullWidth
                        value={currentBook.publishedYear}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">
                        {editMode ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default BookList; 