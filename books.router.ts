import express from 'express'
import BooksController from "./src/books.controller"
import {authenticateMiddleware} from './src/Users.controller'
import {User} from './src/dto/user.model'
const booksRouter = express.Router()



booksRouter.post('/books', authenticateMiddleware, async (req, res) => {
    try {
        const requesterId =  (req.user as User).id;
        const book = await BooksController.createBook(req.body, requesterId)
        res.status(201).json(book)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating book' })
    }
})

booksRouter.get('/books', async (req, res) => {
    try {
        const books = await BooksController.getBooks()
        res.json(books)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error getting books' })
    }
})
booksRouter.get('/books/:id', async (req, res) => {
    try {
        const book = await BooksController.getBookById(parseInt(req.params.id))
        if (!book) {
            return res.status(404).json({ error: 'Book not found' })
        }
        res.json(book)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error getting book by id' })
    }
})

booksRouter.put('/books/:id', authenticateMiddleware, async (req, res) => {
    try {
        const requesterId = (req.user as User).id;
        const book = await BooksController.updateBook(parseInt(req.params.id), req.body, requesterId)
        if (!book) {
            return res.status(404).json({ error: 'Book not found' })
        }
        return res.json(book)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating book' })
    }
 
})
booksRouter.delete('/books/:id', authenticateMiddleware, async (req, res) => {
    try {
        const requesterId =  (req.user as User).id;
        const book = await BooksController.deleteBook(parseInt(req.params.id), requesterId)
        if (!book) {
            return res.status(404).json({ error: 'Book not found' })
        }
        return res.json({message: 'Book deleted'})
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting book' })
    }
 })




export default booksRouter;