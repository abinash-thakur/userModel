import { Request } from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: 'public/uploads',
    filename: async (req : Request, file : Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        file.originalname = Date.now() + '.' + file.originalname.split('.')[1];
        return cb(null, file.originalname);
    },
});

const fileFilter = async (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'text/csv' ||
        file.mimetype === 'application/pdf'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
        return new Error('FILE_TYPE_ERROR');
    }
};

const upload = multer({
    storage    : storage,
    //fileFilter : fileFilter
});

export default upload;