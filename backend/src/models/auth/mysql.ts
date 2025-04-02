import Model from "./model";
import query from "../../db/mysql";
import { v4 } from "uuid";
import { OkPacketParams } from "mysql2";
import userDTO, { Roles } from "./user-dto";
import CredentialsDTO from "./credential-dto";

class Auth implements Model {

    // public async getAll(): Promise<DTO[]> {
    //     const slinks = (await query(`
    //         SELECT  id,
    //                 company_id,
    //                 company,
    //                 platform,
    //                 url
    //         FROM    social_links 
    //     `,));
    //     return slinks;
    // }

    public async getOne(userId: string): Promise<userDTO> {
        const user = (await query(`
            SELECT  userId,
                    firstName,
                    lastName,
                    email,
                    password,
                    roleId
            FROM    users  
            WHERE   userId = ?
        `, [userId]))[0];
        return user;
    }

    public async signUp(user: userDTO): Promise<userDTO> {
        const { firstName, lastName, email, password } = user;
        const userId = v4();

        const result: OkPacketParams = await query(`
            INSERT INTO users(userId, firstName, lastName, email, password, roleId)
            VALUES(?, ?, ?, ?, ?, ?)
        `, [userId, firstName, lastName, email, password, Roles.USER]);
        return this.getOne(userId);
    }

    public async signIn(credentials: CredentialsDTO): Promise<userDTO> {
        const { email, password } = credentials;
        const user = (await query(`
            SELECT  userId,
                    firstName,
                    lastName,
                    email,
                    password,
                    roleId
            FROM    users  
            WHERE   email = ?
            AND     password = ?
            `, [email, password]))[0];
        return user;
    }


    public async getByEmail(email: string): Promise<userDTO | null> {
        const user = (await query(`
           SELECT   userId,
                    firstName,
                    lastName,
                    email,
                    password,
                    roleId
            FROM    users  
            WHERE   email = ?
        `, [email]))[0];
        return user || null;
    }

    public async isAdmin(userId: string): Promise<boolean> {
        const user = (await query(`
            SELECT  roleId,
            FROM    users  
            WHERE   userId = ?
            `, [userId]));
        return user;
    }
}

const auth = new Auth();
export default auth;