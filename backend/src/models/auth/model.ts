import { promises } from 'dns';
import DTO from './credential-dto';
import userDTO from './user-dto';
import CredentialsDTO from './credential-dto';

export default interface Model {
    getAll(): Promise<DTO[]>;
    getOne(id: string): Promise<userDTO>;
    signUp(user: userDTO): Promise<userDTO>;
    deleteUser(id: string): Promise<boolean>;
    signIn(credentials: CredentialsDTO): Promise<userDTO>;
    getByEmail(email: string): Promise<userDTO | null>;
    isAdmin(id: string): Promise<boolean>;
    isPremium(id: string): Promise<boolean>;
    updatePassword(user: userDTO): Promise<DTO>;
    forgotPassword(user: userDTO): Promise<DTO>;
    resetPassword(user: userDTO): Promise<DTO>;
    updateUser(user: userDTO): Promise<userDTO>;
    getByResetToken(resetPasswordToken: string): Promise<userDTO | null>;

}