import { NextFunction, Request, Response } from "express";
import striptags from 'striptags';

export default function stripTags(req: Request, res: Response, next: NextFunction) {
    const entries = Object.entries(req.body);
    const stripped = entries.map(([key, value]) => {
        if (typeof value === 'string') {
            return [key, striptags(value)];
        }
        return [key, value];
    });
    req.body = Object.fromEntries(stripped);
    next();
}
