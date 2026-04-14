export declare function registerUser(name: string, email: string, password: string): Promise<{
    user: {
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    };
    accessToken: string;
}>;
export declare function loginUser(email: string, password: string): Promise<{
    requires2fa: boolean;
    email: string;
    message: string;
}>;
export declare function verifyOtp(email: string, code: string): Promise<{
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    };
}>;
export declare function sendForgotPasswordCode(email: string): Promise<{
    message: string;
}>;
export declare function resetPassword(email: string, code: string, newPassword: string): Promise<{
    message: string;
}>;
export declare function getCurrentUser(userId: string): Promise<{
    email: string;
    name: string;
    id: string;
    role: import(".prisma/client").$Enums.Role;
    createdAt: Date;
} | null>;
//# sourceMappingURL=auth.service.d.ts.map