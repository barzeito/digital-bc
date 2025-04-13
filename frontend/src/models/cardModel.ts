import SocialModel from './socialModel';
import UserModel from './userModel';

export default class CardModel {
    id?: string;
    company?: string;
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