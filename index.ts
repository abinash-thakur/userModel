import express, { Request, Response } from 'express';
import { connectToDb, syncTheDb } from './database/db';
import routes from './routes/routes';
import apiLogger from './utils/logger/apiRouteLogger';
import AppError from './utils/errorHandelers/errorHandler';
import errorController from './utils/errorHandelers/errorController';
import logger from './utils/logger/logger';
import { ErrorCode } from './utils/commonStatusCode/statusCode';
import cors from 'cors';
import { ErrorMessage } from './utils/commonMessage/message';
import rateLimit from 'express-rate-limit';

const PORT = 5201;

const app = express();
app.use(express.json());

// To check the server status
app.options('/checkServer', cors());
app.get('/checkServer', cors(), (req: Request, res: Response): void => {
    res.send('Server is running!! 😉........');
});

// Define all the allowed origins
const allowedOrigin = [process.env.ALLOW_ORIGIN1];

// Configure CORS with custom origin validation
app.use(
    cors({
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        origin: (origin, callback) => {
            if (!origin) throw new AppError(ErrorCode.FORBIDEN, ErrorMessage.BAD_REQUEST_ORIGIN);
            else if (allowedOrigin.includes(origin)) callback(null, true);
            else throw new AppError(ErrorCode.FORBIDEN, `NOT ALLOWED : INVALID ORIGIN: ${origin}`);
        },
    })
);

connectToDb();
syncTheDb();

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 10,
    headers: true,
    legacyHeaders: false,
});

app.use(limiter);

app.use('/api', apiLogger, routes);

app.all('*', (req : Request, res : Response, next) => {
    throw new AppError(
        ErrorCode.SOMETHING_WENT_WRONG,
        process.env.ENVIRONMENT === 'PRODUCTION' ? 'Requested URL not found!' : `Something Went Wrong in the URL http://localhost:${process.env.PORT}${req.path}`
    );
});

// Global error controller to handle the error
app.use(errorController);

app.listen(PORT, (): void => {
    console.log(`Application Is Listen In The Port : ${process.env.PORT}`);
    logger.debug(`Application Is Listen In The Port : ${process.env.PORT}`);
});