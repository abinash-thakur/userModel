import { DataTypes, Model } from 'sequelize';
import Sequelize  from '../database/Sequelize';

import userEnum from '../utils/enum/userEnum';

interface UserAttributes {
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

interface UserModel extends Model<UserAttributes>, UserAttributes {}

const userSchema = Sequelize.define<UserModel>("userTable", {
    userId            : {
        type          : DataTypes.INTEGER,
        primaryKey    : true,
        autoIncrement : true
    },
    userName          : {
        type          : DataTypes.STRING(255),
        allowNull     : false
    },
    email             : {
        type          : DataTypes.STRING(255),
        allowNull     : false,
        unique        : true
    },
    mobileNumber      : {
        type          : DataTypes.STRING(255),
        allowNull     : false,
        unique        : true
    },
    profilePics       : {
        type          : DataTypes.STRING(255),
        allowNull     : true
    },
    password          : {
        type          : DataTypes.STRING(255),
        allowNull     : false
    },
    role              : {
        type          : DataTypes.STRING(255),
        defaultValue  : userEnum.USER
    },
    createdAt         : {
        type          : DataTypes.DATE,
        allowNull     : false,
        defaultValue  : DataTypes.NOW
    },
    updatedAt         : {
        type          : DataTypes.DATE,
        allowNull     : false,
        defaultValue  : DataTypes.NOW
    }
})

export default userSchema;