import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
export declare function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=admin.middleware.d.ts.map