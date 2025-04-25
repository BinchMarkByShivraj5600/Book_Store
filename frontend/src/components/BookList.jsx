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
    TextField,
    Snackbar,
    Alert
} from '@mui/material';
import { getAllBooks, addBook, updateBook, deleteBook } from '../services/api';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [open, setOpen] = useState(false);
    const [editBook, setEditBook] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: '',
        publishedYear: ''
    });
    const [error, setError] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
            setEditBook(book);
            setFormData(book);
        } else {
            setEditBook(null);
            setFormData({
                title: '',
                author: '',
                category: '',
                publishedYear: ''
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditBook(null);
        setFormData({
            title: '',
            author: '',
            category: '',
            publishedYear: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editBook) {
                await updateBook(editBook._id, formData);
                setSnackbar({ open: true, message: 'Book updated successfully!', severity: 'success' });
            } else {
                await addBook(formData);
                setSnackbar({ open: true, message: 'Book added successfully!', severity: 'success' });
            }
            fetchBooks();
            handleClose();
        } catch (error) {
            setError(error.message);
            setSnackbar({ open: true, message: error.message, severity: 'error' });
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteBook(id);
            setSnackbar({ open: true, message: 'Book deleted successfully!', severity: 'success' });
            fetchBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
            setSnackbar({ open: true, message: error.message, severity: 'error' });
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
                <DialogTitle>{editBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="title"
                            label="Title"
                            fullWidth
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            name="author"
                            label="Author"
                            fullWidth
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            name="category"
                            label="Category"
                            fullWidth
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            name="publishedYear"
                            label="Published Year"
                            type="number"
                            fullWidth
                            value={formData.publishedYear}
                            onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value })}
                            required
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">
                        {editBook ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default BookList;