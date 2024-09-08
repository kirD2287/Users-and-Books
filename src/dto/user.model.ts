import { Books } from "@prisma/client";
import { Roles } from "./roles";


export class User {
    id!: number;
    email!: string;
    password!: string;
    roles!: Roles;
}