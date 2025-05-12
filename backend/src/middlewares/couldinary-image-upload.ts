import cloudinary from "../utils/cloudinary";
import { Request, Response, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";

export default async function cloudinaryImageUpload(req: Request, res: Response, next: NextFunction) {
    const uploadToCloudinary = async (file: UploadedFile) => {
        const res = await cloudinary.uploader.upload(file.tempFilePath || file.name, {
            folder: 'business_cards',
            use_filename: true,
            unique_filename: false,
        });
        return res.secure_url;
    };

    try {
        if (req.body.coverImageFile) {
            req.body.coverImage = await uploadToCloudinary(req.body.coverImageFile);
        }

        if (req.body.profileImageFile) {
            req.body.profileImage = await uploadToCloudinary(req.body.profileImageFile);
        }

        return next();
    } catch (err) {
        console.log(err)
        return next(err);
    }
}
