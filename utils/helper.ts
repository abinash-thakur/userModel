import { sign, verify, Secret } from 'jsonwebtoken';

require('dotenv').config({ path: './.env' });

interface TokenPayload {
    userId          : string;
    email           ?: string;
    mobileNumber    : string;
    role            : string;
    profilePics     ?: string;
}

export default {
    createToken: (user: any, time: string, secretKey: Secret) => {
        const accessToken = sign(
            {
                userId          : user.userId,
                email           : user?.email,
                mobileNumber    : user.mobileNumber,
                role            : user.role,
                profilePics     : user?.profilePics,
            } as TokenPayload,
            secretKey,
            { expiresIn: time }
        );
        return accessToken;
    },

    verifyToken: (token: string, secretKey: Secret) => {
        const decode = verify(token, secretKey) as TokenPayload;
        return decode;
    },

    generateRandomId: () => {
        const newId = Date.now().toString().substring(7);
        return newId;
    },
};
