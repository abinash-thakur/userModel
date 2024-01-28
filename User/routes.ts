import { Router } from 'express';
import userController from './controller';
import authorize from '../middleware/auth';
import upload from '../middleware/multer';

const routes = Router();

routes.post('/createUser', upload.single("upload"), userController.userCreation);
routes.post('/userLogin', userController.userLogin);
routes.get('/getUserById', authorize, userController.getUserById);
routes.put('/updateProfile', authorize, upload.single("upload"), userController.updateProfile);

export default routes;