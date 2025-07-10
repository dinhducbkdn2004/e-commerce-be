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

export interface AddressDTO {
    fullName: string;
    phone: string;
    street: string;
    ward: string;
    district: string;
    city: string;
    isDefault?: boolean;
}

export interface CartItemDTO {
    productId: string;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
}

export interface EmailVerificationDTO {
    email: string;
    token: string;
}

export interface UserPasswordResetDTO {
    email: string;
    token: string;
    newPassword: string;
}