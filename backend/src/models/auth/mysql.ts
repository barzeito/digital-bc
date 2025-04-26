import Model from "./model";
import query from "../../db/mysql";
import { v4 } from "uuid";
import { OkPacketParams } from "mysql2";
import userDTO, { Roles } from "./user-dto";
import CredentialsDTO from "./credential-dto";
import { hashPassword } from "../../utils/crypto";
import config from "config";
import { sendResetEmail, sendWelcomeEmail } from "../../utils/emailService";
import crypto from "crypto";
import generateRandomPassword from "../../utils/passwordGenerator";

class Auth implements Model {

    public async getAll(): Promise<userDTO[]> {
        const users = (await query(`
            SELECT  userId,
                    firstName,
                    lastName,
                    email,
                    password,
                    roleId,
                    isTemporaryPassword
            FROM    users
        `,));
        return users;
    }

    public async getOne(id: string): Promise<userDTO> {
        const user = (await query(`
            SELECT  userId,
                    firstName,
                    lastName,
                    email,
                    password,
                    roleId,
                    isTemporaryPassword
            FROM    users  
            WHERE   userId = ?
        `, [id]))[0];
        return user;
    }

    public async signUp(user: userDTO): Promise<userDTO> {
        const { firstName, lastName, email } = user;
        const userId = v4();

        const tempPassword = generateRandomPassword(10, true);

        const result: OkPacketParams = await query(`
            INSERT INTO users(userId, firstName, lastName, email, password, roleId, isTemporaryPassword)
            VALUES(?, ?, ?, ?, ?, ?,?)
        `, [userId, firstName, lastName, email, hashPassword(tempPassword, config.get<string>('app.secret')), Roles.USER, true]);
        console.log(`${firstName} ${lastName} temporary password is: ${tempPassword}`);
        await sendWelcomeEmail(email, firstName, tempPassword)
        return this.getOne(userId);
    }

    public async signIn(credentials: CredentialsDTO): Promise<userDTO | null> {
        const { email, password } = credentials;
        const user = (await query(`
            SELECT  userId,
                    firstName,
                    lastName,
                    email,
                    password,
                    roleId,
                    isTemporaryPassword
            FROM    users  
            WHERE   email = ?
            AND     password = ?
            `, [email, hashPassword(password, config.get<string>('app.secret'))]))[0];
        return user || null;
    }

    public async updateUser(user: userDTO): Promise<userDTO> {
        const { userId, firstName, lastName, roleId, email, password } = user;
        const results = await query(`
                UPDATE  users
                SET     firstName = ?,
                        lastName = ?,
                        email = ?,
                        password = ?,
                        roleId = ?
                WHERE   userId = ?
            `, [firstName, lastName, email, hashPassword(password, config.get<string>('app.secret')), roleId, userId]);
        return this.getOne(userId);
    }

    public async updatePassword(user: userDTO): Promise<userDTO> {
        const { userId, password } = user;

        await query(`
            UPDATE users
            SET password = ?,
                isTemporaryPassword = ?,
                resetPasswordToken = NULL,
                resetPasswordExpires = NULL
            WHERE userId = ?
        `, [hashPassword(password, config.get<string>('app.secret')), 0, userId]);
        console.log(`User updated password is ${password}`)
        return this.getOne(userId);
    }

    public async forgotPassword(user: userDTO): Promise<userDTO> {
        const { userId, email } = user;
        const passwordResetToken = crypto.randomBytes(32).toString("hex");
        const tokenExpire = new Date(Date.now() + 15 * 60 * 1000)

        await query(`
            UPDATE users
            SET resetPasswordToken = ?,
                resetPasswordExpires = ?
            WHERE userId = ?
        `, [passwordResetToken, tokenExpire, userId]);

        const resetLink = `https://example.com/reset-password?token=${passwordResetToken}`;
        await sendResetEmail(email, resetLink);

        return this.getOne(userId);
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
            SELECT  roleId
            FROM    users  
            WHERE   userId = ?
            `, [userId]))[0];
        return user?.roleId === 2;
    }

    public async isPremium(userId: string): Promise<boolean> {
        const user = (await query(`
            SELECT  roleId
            FROM    users  
            WHERE   userId = ?
            `, [userId]))[0];
        return user?.roleId === 3;
    }

    public async deleteUser(id: string): Promise<boolean> {
        const result: OkPacketParams = await query(`
            DELETE FROM users
            WHERE       userId = ?
        `, [id]);
        return Boolean(result.affectedRows);
    }
}

const auth = new Auth();
export default auth;