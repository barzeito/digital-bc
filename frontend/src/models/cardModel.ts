import UserModel from './userModel';

export default class CardModel {
    id?: string;
    company?: string;
    coverImageUrl?: string;
    profileImageUrl?: string;
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
    firstName?: string;
    lastName?: string;
    user?: UserModel;
}