import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
dotenv.config({path : './.env'});
import Joi, { string } from 'joi';
import path from 'path';
import catchAsync from '../utils/errorHandelers/catchAsync';
import sendResponse from '../utils/commonResponse/response';
import { ErrorCode, SuccessCode } from '../utils/commonStatusCode/statusCode';
import { ErrorMessage, SuccessMessage } from '../utils/commonMessage/message';
import userServices from './services';
import appError from '../utils/errorHandelers/errorHandler';
import logger from '../utils/logger/logger';
import tokenCreation  from '../utils/helper';
import cloudinary  from '../utils/cloudinary/cloudinary';
import  bcrypt from 'bcryptjs';
const JWT_SECRET = "scrap$#33210*&%?#@&secrer";
const EXPIRY_JWT = "365d";

export default{
    userCreation : catchAsync( async(req : Request, res : Response) => {

        logger.info("userCreation api is fire!!");
        const validationSchema = Joi.object({
            userName     : Joi.string().min(4).required(),
            email        : Joi.string().required(),
            mobileNumber : Joi.string().regex(/^[0-9]{10}$/).messages({ 'string.pattern.base': `mobile number must have 10 digits numbers and valid.` }).required(),
            profilePics  : Joi.string().optional(),
            password     : Joi.string().min(4)
        })

        const {error} = validationSchema.validate(req.body);
        if(error)
            throw new appError( ErrorCode.BAD_REQUEST, error.details[0].message );

        let imgUrl;
        if(req?.file)
        {
            logger.info("image uploading is started!!");
            imgUrl = await cloudinary.uploadImage(path.join(__dirname, '..', `/public/uploads/${req.file.originalname}`), req.file.originalname);
            if(!imgUrl)
                throw new appError(ErrorCode.SOMETHING_WENT_WRONG, ErrorMessage.CLOUDINARY_IMG_URL);
            logger.info("image is successfully uploaded");
        }

        const password    = req.body.password;
        const salt        = await bcrypt.genSalt(10);
        const secPasswprd = await bcrypt.hash(password,salt);

        interface dataObj {
            userName        : string,
            email           : string,
            mobileNumber    : string,
            password        : string,
            profilePics     : string | null
        }

        const data : dataObj = {
            userName     : req.body.userName,
            email        : req.body.email,
            mobileNumber : req.body.mobileNumber,
            password     : secPasswprd,
            profilePics  : imgUrl != undefined ? imgUrl.url : null
        }

        const dbResponse = await userServices.createUser(data);
        logger.info("database process is finish in create user api!!");
        if(!dbResponse)
            throw new appError(ErrorCode.SOMETHING_WENT_WRONG, ErrorMessage.SOMETHING_WENT_WRONG);
        const jwtToken = tokenCreation.createToken(dbResponse, EXPIRY_JWT, JWT_SECRET);
        sendResponse.sendResponseWithData(res, {response_code : SuccessCode.SUCCESS, response_message : SuccessMessage.SIGN_UP, result : dbResponse, token : jwtToken});
    }),

    userLogin : catchAsync( async(req : Request, res : Response) => {
        logger.info("userLogin api is fire!!");

        const validationSchema = Joi.object({
            email       : Joi.string().required(),
            password    : Joi.string().min(4).required()
        })

        const {error} = validationSchema.validate(req.body);
        if(error)
            throw new appError( ErrorCode.BAD_REQUEST, error.details[0].message );

        const filter = {email : req.body.email};
        const dbResponse = await userServices.findSingleUser(filter);
        logger.info("database process is finished!!");
        if(!dbResponse)
            throw new appError(ErrorCode.NOT_FOUND, ErrorMessage.USER_NOT_FOUND);

        const password = await bcrypt.compare(req.body.password, dbResponse.password);
        if(!password)
            throw new appError(ErrorCode.UNAUTHORIZED, ErrorMessage.PASSWORD_WRONG);    
        sendResponse.commonResponse(res, SuccessCode.SUCCESS, dbResponse, SuccessMessage.DATA_FETCHED);
    }),

    getUserById : catchAsync( async(req : Request, res : Response)=>{
        logger.info("getUser api is fire!!");

        const validationSchema = Joi.object({
            userId : Joi.number().required()
        })

        const {error} = validationSchema.validate(req.query);
        if(error)
            throw new appError( ErrorCode.BAD_REQUEST, error.details[0].message );

        const filter = {userId : req.query.userId};

        const dbResponse = await userServices.findSingleUser(filter);
        logger.info("database process is finish in find single user by id api !!");
        if(!dbResponse)
            throw new appError(ErrorCode.NOT_FOUND, ErrorMessage.USER_NOT_FOUND);
        sendResponse.commonResponse(res, SuccessCode.SUCCESS, dbResponse, SuccessMessage.DATA_FETCHED);
    }),

    updateProfile : catchAsync( async(req : Request,res : Response) => {
        logger.info("profile picture is updated!!");
        const validationSchema = Joi.object({
            userId       : Joi.number().required(),
            userName     : Joi.string().min(4).optional(),
            mobileNumber : Joi.string().regex(/^[0-9]{10}$/).messages({ 'string.pattern.base': `mobile number must have 10 digits numbers and valid.` }).optional()
        })

        const {error} = validationSchema.validate(req.body);
        if(error)
            throw new appError( ErrorCode.BAD_REQUEST, error.details[0].message );

        let imgUrl;
        if(req?.file)
        {
            logger.info("image uploading is started!!");
            imgUrl = await cloudinary.uploadImage(path.join(__dirname, '..', `/public/uploads/${req.file.originalname}`), req.file.originalname);
            if(!imgUrl)
                throw new appError(ErrorCode.SOMETHING_WENT_WRONG, ErrorMessage.CLOUDINARY_IMG_URL);
            logger.info("image is successfully uploaded");
        }

        interface updateData {
            userName     ?: string,
            mobileNumber ?: string,
            profilePics  ?: string
        }
        const data : updateData = {}
        if(req.body.userName)
            data["userName"] = req.body.userName
        if(req.body.mobileNumber)
            data["mobileNumber"] = req.body.mobileNumber
        if(imgUrl)
            data["profilePics"] = imgUrl.url

        const con = {
            where : {
                userId : req.body.userId
            }
        }

        const dbResponse = await userServices.updateUser(data, con);
        logger.info("database process is finish in create user api!!");
        if(!dbResponse)
            throw new appError(ErrorCode.SOMETHING_WENT_WRONG, ErrorMessage.SOMETHING_WENT_WRONG);

        sendResponse.commonResponse(res, SuccessCode.SUCCESS, dbResponse,SuccessMessage.DATA_UPDATED);
    })
}