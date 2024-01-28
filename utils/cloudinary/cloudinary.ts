import cloudinary from 'cloudinary';
import catchAsync from '../errorHandelers/catchAsync';
import AppError from '../errorHandelers/errorHandler';
import { ErrorCode } from '../commonStatusCode/statusCode';
import { ErrorMessage } from '../commonMessage/message';
import logger from '../logger/logger';
import fs from 'fs';

cloudinary.v2.config({
    secure: true,
});

interface UploadImageResult {
    public_id   : string;
    url         : string;
    width       : number;
    height      : number;
    format      : string;
}

export default {
    uploadImage: async (filePath : string, fileName : string) : Promise<UploadImageResult> => {
        logger.info('cloudinary function is fired');

        const res = await cloudinary.v2.uploader.upload(filePath, { public_id: fileName });
        logger.info('image is uploaded to the cloudinary server');

        const resizedImageUrl = cloudinary.v2.url(fileName, {
            width: 100,
            height: 150,
            crop: 'fill',
        });

        if (!res) {
            logger.error('some error occurred in cloudinary image uploading');
            throw new AppError(ErrorCode.SOMETHING_WENT_WRONG, ErrorMessage.SOMETHING_WENT_WRONG);
        }

        fs.unlink(filePath, (err) => {
            if (err)
                logger.error('some error occurred in the deletion of the image in cloudinary');
            else 
                logger.info('Image is successfully deleted from the public directory');
        });

        return {
            public_id   : res.public_id,
            url         : resizedImageUrl,
            width       : res.width,
            height      : res.height,
            format      : res.format,
        };
    },

    deleteImage : async (fileName: string): Promise<any> => {
        const res = await cloudinary.v2.uploader.destroy(fileName);
        return res;
    }
};