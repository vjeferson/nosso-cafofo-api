import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export default function authAdministradorNossoCafofoMiddleware(request: Request, response: Response, next: NextFunction) {
    try {

        // const token = authorization?.replace('Bearer', '').trim();
        // const decodedToken = jwt.verify(token as string, `${process.env.JWT_KEY}`);
        // const { id } = decodedToken as ITokenPayload;
        // request.usuario = id;
        next();
    } catch (error: any) {
        response.sendStatus(401);
    }
};