import UserModel from './userModel';

export default class CardModel {
    id?: string;
    company?: string;
    description?: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    created_at?: string;
    updated_at?: string;
    user?: UserModel;
}