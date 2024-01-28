import { Request } from 'express';

interface CustomRequest extends Request {
  customObject?: any;
}

export default CustomRequest;