import { Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
export declare function registerController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function loginController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function verifyOtpController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function forgotPasswordController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function resetPasswordController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function meController(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.controller.d.ts.map