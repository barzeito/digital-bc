import { createHash, createHmac } from "crypto";

export function hashPassword(plainTextPassword: string, salt: string): string {
    return createHmac('md5', salt)
        .update(`${plainTextPassword}`)
        .digest('hex');
}