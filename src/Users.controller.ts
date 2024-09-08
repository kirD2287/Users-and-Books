import  prisma from './Prisma.service'
import { CreateUserDto }  from './dto/create-user.dto'
import { Roles } from './dto/roles'
import * as bcrypt from 'bcrypt'
import crypto from 'crypto'
import { sendConfirmationEmail } from './mailer.service'
import  TokenService  from './token.service'
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken'




    export const registration = async  (dto: CreateUserDto)  => {
        try {
            if (!dto.username || !dto.email || !dto.password) {
                throw new Error('Username, email and password are required.');
            }
            const hashedPassword = await bcrypt.hash(dto.password, 10)
            const emailToken = crypto.randomBytes(16).toString('hex');
            const user = await prisma.users.create({
                data: {
                    username: dto.username,
                    email: dto.email,
                    password: hashedPassword,
                    emailToken,
                    roles: Roles.USER,
                    isEmailConfirmed: false,
                },
            })
            
            await sendConfirmationEmail(dto.email, emailToken)
            return {
                message: 'User registered successfully. Check your email for confirmation.',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: user.roles,
                }
            }
        } catch (err) {
            console.error('Error registering user:', err)
            throw new Error('Error registering user');
        }
        
    }

    export const confirmEmail = async (token: any) => {
        try {
            const user = await prisma.users.updateMany({
                where: { emailToken: token },
                data: { isEmailConfirmed: true, emailToken: null },
            });

            if (user.count === 0) {
                throw new Error('Invalid token.');
            }

            return { message: 'Email confirmed successfully.' };
        } catch (err) {
            console.error('Error confirming email:', err);
            throw new Error('Error confirming email');
        }
    }
    
    export const login = async (email: string, password: string) =>  {
        try {
            const user = await prisma.users.findFirst({ where: { 
                email,
                roles: Roles.ADMIN
            } });
            if (!user ) {
                throw new Error('User not found');
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                throw new Error('Invalid password.');
            }
            if (!Roles.ADMIN ) {
                throw new Error('User does not have ADMIN role');
            } 
            const books = await prisma.books.findMany({ where: {
                authorId: user.id
            }})
            const accessToken = TokenService.generateToken( user.id,  user.email, user.password, user.roles);
            return {accessToken, books}
                    
        } catch (err) {
            console.error('Error logging in:', err);
            throw new Error('Error logging in');
        }
    }
    
    export const authenticateMiddleware = async (req: Request, res: Response, next:any) => {
        const secret = process.env.JWT_ACCESS_SECRET
        if (!secret) {
            throw new Error('JWT_ACCESS_SECRET не определен');
        }
        try {
          const token = req.headers.authorization?.split(' ')[1];
          if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
          }
      
          const decoded = jwt.verify(token, secret);
          req.user = decoded
          next()
          
        } catch (err) {
          console.error('Error authenticating:', err);
          return res.status(401).json({ message: 'Unauthorized' });
        }
      };


      export const hasRole = (roles: number, roleToCheck: Roles) => {
        return (roles & roleToCheck) === roleToCheck;
    }

    export const updateRole = async (role: Roles, userId: number, requesterId: number) =>  {
        
        try {
            const requester = await prisma.users.findUnique({where:{id: requesterId}})
            if(!requester || !hasRole(requester.roles, Roles.ADMIN)) {
                throw new Error('Нет прав для изменения роли пользователя')
            }
            const user = await prisma.users.update({
                where: { id: userId },
                data: { roles: role },
            });
            return user;
        } catch (err) {
            console.error('Error updating user role:', err);
            throw new Error('Error updating user role');
        }
    }
    













