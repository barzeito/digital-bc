import { NextFunction, Request, Response } from "express";

export default function addImageToBody(req: Request, res: Response, next: NextFunction) {
    req.body.coverImageFile = req.files?.coverImageFile;
    req.body.profileImageFile = req.files?.profileImageFile;
    return next();
}