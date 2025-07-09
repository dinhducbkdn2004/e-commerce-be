export interface UserPasswordResetDTO {
    email: string;
    token: string;
    newPassword: string;
}

export interface EmailVerificationDTO {
    email: string;
    token: string;
}
