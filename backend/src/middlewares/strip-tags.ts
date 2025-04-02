import { NextFunction, Request, Response } from "express";
import striptags from 'striptags';

export default function stripTags(request: Request, response: Response, next: NextFunction) {
    const entries = Object.entries(request.body);
    const stripped = entries.map(([key, value]) => [key, striptags(value as string)])
    request.body = Object.fromEntries(stripped);
    next()

}