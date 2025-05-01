import { UploadedFile } from "express-fileupload";

export default interface DTO {
    id: string;
    company: string;
    coverImage: string;
    profileImage: string;
    coverImageFile: UploadedFile;
    profileImageFile: UploadedFile;
    name: string;
    description: string;
    about: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    created_at: string;
    updated_at: string;
    ownedBy: string;
    themeColor: string;
    textColor: string;
    backgroundColor: string;
}
