import config from "config";
import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import path from "path";
import { promisify } from "util";
import { v4 } from "uuid";

export default async function uploadImage(req: Request, res: Response, next: NextFunction) {
    if (req.body.coverImageFile) {
        const coverImage = req.body.coverImageFile as UploadedFile;
        const coverImageName = `${v4()}${path.extname(coverImage.name)}`;
        const mvPromisify = promisify(coverImage.mv).bind(coverImage);
        try {
            const coverImagePath = path.resolve(config.get<string>('app.images.path'), coverImageName);
            await mvPromisify(coverImagePath);
            req.body.coverImage = coverImageName;
        } catch (err) {
            next(err);
        }
    }

    if (req.body.profileImageFile) {
        const profileImage = req.body.profileImageFile as UploadedFile;
        const profileImageName = `${v4()}${path.extname(profileImage.name)}`;
        const mvPromisify = promisify(profileImage.mv).bind(profileImage);
        try {
            const profileImagePath = path.resolve(config.get<string>('app.images.path'), profileImageName);
            await mvPromisify(profileImagePath);
            req.body.profileImage = profileImageName;
        } catch (err) {
            next(err);
        }
    }

    return next();
}
