
import * as jwt from 'jsonwebtoken';
import { Roles } from './dto/roles';
import { Books } from '@prisma/client';


class TokenService {
    generateToken(id: number, email: string, password: string, role: Roles) {
        const secret = process.env.JWT_ACCESS_SECRET
        if (!secret) {
            throw new Error('JWT_ACCESS_SECRET не определен');
        }
       const payload = {
        id,
        email,
        password,
        role,
       }

       return jwt.sign(payload, secret, {
        expiresIn: '24h',
       })
    }
    
}


export default new TokenService()