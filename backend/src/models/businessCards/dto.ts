import { UploadedFile } from "express-fileupload";

export default interface DTO {
    id: string;
    company: string;
    coverImage: string | null;
    profileImage: string | null;
    coverImageFile: UploadedFile | null;
    profileImageFile: UploadedFile | null;
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
