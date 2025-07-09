import { Types } from 'mongoose';

export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
    phoneNumber?: string;
    avatar?: string;
    emailVerificationToken?: string;
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    avatar?: string;
}