import express from 'express';
import usersRouter from './users.router';
import passport from 'passport';
import dotenv from 'dotenv';
import booksRouter from './books.router';
   dotenv.config()
const app = express();

const PORT = process.env.PORT || 3000

app.use(express.json())
if (!process.env.SECRET) {
    throw new Error('SECRET environment variable is not set');
  }



app.use('/users', usersRouter)
app.use('/api', booksRouter)

async function start () {
    try {
        await app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}


start() 