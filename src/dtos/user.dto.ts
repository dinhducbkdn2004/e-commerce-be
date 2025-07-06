export interface CreateUserDTO {
    username: string;
    password: string;
    role?: 'user' | 'admin';
}