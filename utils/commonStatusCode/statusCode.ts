export const ErrorCode = Object.freeze({
    'BAD_REQUEST'           : 400,
    'UNAUTHORIZED'          : 401,
    'FORBIDEN'              : 403,
    'NOT_FOUND'             : 404,
    'NOT_ALLOWED'           : 405,
    'ALREADY_EXIST'         : 409,
    'INTERNAL_SERVER_ERROR' : 500,
    'SOMETHING_WENT_WRONG'  : 501
});

export const SuccessCode = Object.freeze({
    'SUCCESS'    : 200,
    'CREATED'    : 201,
    'UPDATED'    : 202,
    'NO_CONTENT' : 204
});