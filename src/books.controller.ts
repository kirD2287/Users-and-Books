import  prisma from './Prisma.service'
import { CreateBookDto }  from './dto/create-book.dto'
import { hasRole } from './Users.controller'
import { Roles } from './dto/roles'




class BooksController {
    async createBook(dto: CreateBookDto, requesterId: number) {
       
        try {
            const requester = await prisma.users.findUnique({where:{id: requesterId}})
            if(!requester || !hasRole(requester.roles, Roles.ADMIN)) {
                throw new Error('Нет прав для изменения роли пользователя')
            }
            const book = await prisma.books.create({
                data: {
                    title: dto.title,
                    author: {
                        connect: {
                            id: dto.authorId,
                        }
                    },
                    publication_date: dto.publicationDate,
                    genres: dto.genres
                },
            })
            return book
        } catch (err) {
            console.error(err);
            throw new Error('Error creating book');
        }
        
    } 

    async getBooks() {
        try {
            const books = await prisma.books.findMany()
            return books
        } catch (err) {
            console.error(err);
            throw new Error('Error getting all books');
        }

    }

    async getBookById(id: number) {
        try {
            const book = await prisma.books.findUnique({
                where: { id },
            })
            if (!book) {
                throw new Error('Book not found');
            }
            return book
        } catch (err) {
            console.error(err);
            throw new Error('Error getting book by id');
        }
    }
    
    async updateBook(id: number, dto: CreateBookDto, requesterId: number) {
        try {
            const requester = await prisma.users.findUnique({where:{id: requesterId}})
            if(!requester || !hasRole(requester.roles, Roles.ADMIN)) {
                throw new Error('Нет прав для изменения роли пользователя')
            }
            const book = await prisma.books.update({
                where: { id },
                data: {
                    title: dto.title,
                    publication_date: dto.publicationDate,
                    genres: dto.genres
                },
            })
            if (!book) {
                throw new Error('Book not found');
            }
            return book
        } catch (err) {
            console.error(err);
            throw new Error('Error updating book');
        }
    }

    async deleteBook(id: number, requesterId: number) {
        try {
            const requester = await prisma.users.findUnique({where:{id: requesterId}})
            if(!requester || !hasRole(requester.roles, Roles.ADMIN)) {
                throw new Error('Нет прав для изменения роли пользователя')
            }
            const book = await prisma.books.delete({
                where: { id },
            })
            if (!book) {
                throw new Error('Book not found');
            }
            return book
        } catch (err) {
            console.error(err);
            throw new Error('Error deleting book');
        }
    }
}








export default new BooksController();