import UserModel from './userModel';

export default class CardModel {
    id?: string;
    company?: string;
    coverImageUrl?: string | null;
    profileImageUrl?: string | null;
    coverImageFile?: File | null;
    profileImageFile?: File | null;
    name?: string;
    description?: string;
    about?: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    created_at?: string;
    updated_at?: string;
    ownedBy?: string;
    themeColor?: string;
    backgroundColor?: string;
    textColor?: string
    firstName?: string;
    lastName?: string;
    user?: UserModel;
}