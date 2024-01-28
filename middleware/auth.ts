import { Request, Response, NextFunction, RequestHandler } from 'express';
import CustomRequest from '../express';
import catchAsync from '../utils/errorHandelers/catchAsync';
import { ErrorCode } from '../utils/commonStatusCode/statusCode';
import { ErrorMessage } from '../utils/commonMessage/message';
import AppError from '../utils/errorHandelers/errorHandler';
import logger from '../utils/logger/logger';
import userRole from '../utils/enum/userEnum';
import jwt  from '../utils/helper';


const JWT_SECRET = "scrap$#33210*&%?#@&secrer";

interface UserData {
    userId       : string,
    email        : string,
    mobileNumber : string,
    profilePics ?: string
    role         : string;
}

const userAuthorize : RequestHandler =  catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader) {
        throw new AppError(ErrorCode.UNAUTHORIZED, ErrorMessage.NO_AUTH_TOKEN);
    }
    logger.info('Authorization Header is found!!');
    const token = authorizationHeader.split(' ')[1];
    if (!token) throw new AppError(ErrorCode.UNAUTHORIZED, ErrorMessage.NO_AUTH_TOKEN);
    logger.info('Token is found in the header!!');
    const data = jwt.verifyToken(token, JWT_SECRET) as UserData;
    if (data.role !== userRole.USER) {
        throw new AppError(ErrorCode.UNAUTHORIZED, ErrorMessage.USER_NOT_AUTHORIZED);
    }
    
    req.customObject = data;
    next();
})

export default userAuthorize;