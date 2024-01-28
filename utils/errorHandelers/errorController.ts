import { Request, Response, NextFunction } from 'express';
import logger from '../logger/logger';
import { ErrorCode } from '../commonStatusCode/statusCode';
import { ErrorMessage } from '../commonMessage/message';

interface CustomError {
    statusCode  : number;
    message     : string;
}

export default (err: any, req: Request, res: Response, next: NextFunction) => {
    const customErrors: Record<string, CustomError> = {
        'jwt expired'       : { statusCode: ErrorCode.UNAUTHORIZED, message: ErrorMessage.TOKEN_EXPIRED },
        'jwt malformed'     : { statusCode: ErrorCode.BAD_REQUEST, message: ErrorMessage.INVALID_JWT_TOKEN },
        'invalid signature' : { statusCode: ErrorCode.BAD_REQUEST, message: ErrorMessage.INVALID_SIGNATURE },
    };

    const statusCode = customErrors[err?.message]?.statusCode || err?.statusCode || ErrorCode.INTERNAL_SERVER_ERROR;
    const errMessage = customErrors[err?.message]?.message || err?.message || ErrorMessage.INTERNAL_SERVER_ERROR;

    logger.error(`${statusCode} - ${err.message} - ${req.path} ${req.method}`);

    if (process.env.ENVIRONMENT === 'PRODUCTION') {
        res.status(statusCode).json({
            success     : false,
            message     : errMessage,
            statusCode,
            reference   : `${req.path} ${req.method}`,
        });
    } else {
        res.status(statusCode).json({
            success     : false,
            message     : errMessage,
            statusCode,
            reference   : `${req.path} ${req.method}`,
            stack       : err.stack,
        });
    }
};
