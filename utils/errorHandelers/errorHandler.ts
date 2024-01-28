class AppError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;

        // capturing the error stack data
        Error.captureStackTrace(this, this.constructor);
    }
}
export default AppError;  