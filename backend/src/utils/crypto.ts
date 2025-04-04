import { createHash, createHmac } from "crypto";
import { sign } from "jsonwebtoken";
import userDTO from "../models/auth/user-dto";

export function hashPassword(plainTextPassword: string, salt: string): string {
    return createHmac('md5', salt)
        .update(`${plainTextPassword}`)
        .digest('hex');
}

export function generateJWT(user: userDTO, secret: string, expiresIn: number): string {
    return sign({ user }, secret, { expiresIn })
}