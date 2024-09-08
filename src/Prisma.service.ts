
import { PrismaClient } from '@prisma/client'

class PrismaService extends PrismaClient {
    constructor() {
        super();
        this.$connect()
            .then(() => console.log('Prisma connected'))
            .catch((err) => console.error('Error connecting to Prisma:', err));
    }
}

export default new PrismaService();