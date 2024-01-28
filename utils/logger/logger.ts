import { createLogger, transports, format } from 'winston';

const { combine, timestamp, printf, colorize } = format;

const formatter = printf((info) => {
    return `${info.timestamp} [${info.level}] ${info.message} `;
});

const logger = createLogger({
    format: combine(timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }), formatter, colorize()),
    transports: [
        new transports.Console({
            level       : 'debug',
            format      : combine(colorize(), timestamp(), formatter)
        }),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/general.log', level: 'info' }),
    ],
});

export default logger;