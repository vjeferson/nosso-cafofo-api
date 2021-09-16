import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ITokenPayload } from '../interfaces/token-payload-interface';

dotenv.config();

export default function authMiddleware(request: Request, response: Response, next: NextFunction) {
    let token, decodedToken, usuarioId;
    try {
        const { authorization } = request.headers;
        if (!authorization) {
            response.sendStatus(401);
        }

        token = authorization?.replace('Bearer', '').trim();
        decodedToken = jwt.verify(token as string, `${process.env.JWT_KEY}`);
        usuarioId = (decodedToken as ITokenPayload).id;
        request.usuarioId = usuarioId;
        next();
    } catch (error: any) {
        response.sendStatus(401);
    }
};