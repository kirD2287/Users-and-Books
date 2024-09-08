import express from 'express';
import { Request } from 'express';
import { registration, login, confirmEmail, updateRole, authenticateMiddleware} from './src/Users.controller';
import {User} from './src/dto/user.model'
import  prisma from './src/Prisma.service'

const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
    try {
         await registration(req.body);
        res.status(201).json({message: 'User registered successfully. Check your email for confirmation.'})
    } catch (err) {
        console.error('Error registering user:', err);
        return res.status(400).json({ message: 'Error registering user' });
    }
});

userRouter.get('/confirm/:token', confirmEmail);

userRouter.post('/login', [
], async (req: Request, res: any) => {
    try {
        const { email, password } = req.body;
        const accessToken = await login(email, password);
        res.json(accessToken);
    } catch (err) {
        console.error('Error authenticating:', err);
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});

userRouter.get('/me', authenticateMiddleware, async (req: Request, res) => {
    try {
        
        const user = req.user as User;
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error getting user:', err);
        return res.status(500).json({ message: 'Error getting user' });
    }
});

userRouter.put('/:id/role', authenticateMiddleware, async (req: Request, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Необходима аутентификация.' })
    }
    const userId = parseInt(req.params.id);
    const role = parseInt(req.body.role);
    const requesterId =  (req.user as User).id;
    try {
        const updatedUser = await updateRole(role, userId, requesterId);
        return res.status(200).json(updatedUser);
    } catch (err) {
        console.error('Ошибка обновления роли:', err);
        return res.status(500).json({ message: 'Ошибка при обновлении роли пользователя' });
    }
}); 

export default userRouter;

