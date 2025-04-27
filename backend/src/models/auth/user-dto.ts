import CredentialsDTO from "./credential-dto";

export default interface userDTO extends CredentialsDTO {
    userId: string;
    firstName: string;
    lastName: string;
    roleId: number;
    isTemporaryPassword: boolean;
    resetPasswordToken: string;
    resetPasswordExpires: string;
}

export enum Roles {
    USER = 1,
    ADMIN = 2,
    PREMIUM = 3,
}