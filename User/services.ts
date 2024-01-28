import userSchema from './model';

interface user{
    userId          ?: number;
    userName        : string;
    email           : string;
    mobileNumber    : string;
    profilePics     ?: string | null;
    password        : string;
    role            ?: string;
    createdAt       ?: Date;
    updatedAt       ?: Date;
}

export default {
    createUser: async (data : user) => {
        const dbResponse = await userSchema.create(data);
        return dbResponse;
    },

    findSingleUser: async (con : any) => {
        const dbResponse = await userSchema.findOne({ where : con });
        return dbResponse;
    },

    updateUser: async (data: object, con: any) => {
        const dbResponse = await userSchema.update(data, con);
        return dbResponse;
    }
};