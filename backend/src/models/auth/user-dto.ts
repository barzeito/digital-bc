import CredentialsDTO from "./credential-dto";

export default interface userDTO extends CredentialsDTO {
    userId: string;
    firstName: string;
    lastName: string;
    roleId: number;
    isTemporaryPassword: boolean;
}

export enum Roles {
    USER = 1,
    ADMIN = 2,
    PREMIUM = 3,
}