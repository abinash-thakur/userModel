import { Request, Response, NextFunction } from 'express';
import logger from './logger';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

export default (req: Request, res: Response, next: NextFunction) => {
	const apiUrl =
		process.env.ENVIRONMENT === 'PRODUCTION'
			? ``
			: `http://localhost:${process.env.PORT}${req.originalUrl}`;

	logger.info(`${apiUrl} - ${req.method} METHOD`);
	next();
};