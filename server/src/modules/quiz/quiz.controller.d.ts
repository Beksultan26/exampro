import { Request, Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
export declare function getQuizBySubjectController(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getExamController(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function submitExamController(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function submitQuizController(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getQuizHistoryController(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getAttemptByIdController(req: AuthRequest, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=quiz.controller.d.ts.map