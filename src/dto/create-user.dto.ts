import { Books } from "@prisma/client";
import { Roles } from "./roles";

export class CreateUserDto {
    readonly username!: string 
    readonly email!: string;
    readonly password!: string;
    roles!: Roles
}


