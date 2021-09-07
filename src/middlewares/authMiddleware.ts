import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { ITokenPayload } from '../interfaces/token-payload-interface';

dotenv.config();

export default function authMiddleware(request: Request, response: Response, next: NextFunction) {
    try {
        const { authorization } = request.headers;
        if (!authorization) {
            response.sendStatus(401);
        }

        const token = authorization?.replace('Bearer', '').trim();
        const decodedToken = jwt.verify(token as string, `${process.env.JWT_KEY}`);
        const { id } = decodedToken as ITokenPayload;
        request.usuarioId = id;
        next();
    } catch (error: any) {
        response.sendStatus(401);
    }
};