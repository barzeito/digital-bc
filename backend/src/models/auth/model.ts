import { promises } from 'dns';
import DTO from './credential-dto';
import userDTO from './user-dto';
import CredentialsDTO from './credential-dto';

export default interface Model {
    getAll(): Promise<DTO[]>;
    getOne(userId: string): Promise<userDTO>;
    signUp(user: userDTO): Promise<userDTO>;
    signIn(credentials: CredentialsDTO): Promise<userDTO>;
    getByEmail(email: string): Promise<userDTO | null>;
    isAdmin(id: string): Promise<boolean>;
    updatePassword(user: userDTO): Promise<DTO>;
    forgotPassword(user: userDTO): Promise<DTO>;

}