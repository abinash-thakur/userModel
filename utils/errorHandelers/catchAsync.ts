import { Request, Response, NextFunction } from 'express';

const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req : Request, res : Response,next : NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch((error) => next(error));
};

export default catchAsync;