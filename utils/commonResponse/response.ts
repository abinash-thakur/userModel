import { Response } from 'express';

interface CommonResponseParams {
    result           ?: any;
    response_message ?: string;
    response_code     : number;
}

interface SendResponseWithPaginationParams {
    responseCode    : number;
    responseMessage : string;
    result          : any;
    paginationData ?: any;
}

interface SendResponseWithDataParams {
    response_code       : number;
    response_message    : string;
    result              : any;
    token               ?: string;
}

interface SendResponseWithoutDataParams {
    response_code       : number;
    response_message    : string;
}

interface SendResponseWithBlankArrayParams {
    result              ?: any;
    response_code       : number;
    response_message    : string;
}

export default {
    commonResponse: (responseObj: Response, statusCode: number, result?: any, message?: string) => {
        const responseParams: CommonResponseParams = {
            result              : result || null,
            response_message    : message,
            response_code       : statusCode,
        };
        return responseObj.json(responseParams);
    },

    sendResponseWithPagination: (responseObj: Response, { responseCode, responseMessage, result, paginationData }: SendResponseWithPaginationParams) => {
        return responseObj.send({ responseCode, responseMessage, result, paginationData: paginationData || null });
    },

    sendResponseWithData: (responseObj: Response, { response_code, response_message, result, token }: SendResponseWithDataParams) => {
        return responseObj.send({ response_code, response_message, result, token });
    },

    sendResponseWithoutData: (responseObj: Response, { response_code, response_message }: SendResponseWithoutDataParams) => {
        return responseObj.send({ response_code, response_message });
    },

    sendResponseWithBlankArray: (responseObj: Response, { result, response_code, response_message }: SendResponseWithBlankArrayParams) => {
        return responseObj.send({ result: result || null, response_code, response_message });
    },
};
