import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ITokenPayload } from '../interfaces/token-payload-interface';
import { Usuario } from '../modules/usuario/usuario-model';
import { Republica } from '../modules/republica/republica.model';
import { Perfil } from '../modules/perfil/perfil-model';

dotenv.config();

export default async function authMiddleware(request: Request, response: Response, next: NextFunction) {
    let token, decodedToken, usuarioId;
    try {
        const { authorization } = request.headers;
        if (!authorization) {
            response.sendStatus(401);
        }

        token = authorization?.replace('Bearer', '').trim();
        decodedToken = jwt.verify(token as string, `${process.env.JWT_KEY}`);
        usuarioId = (decodedToken as ITokenPayload).id;

        const usuario = await Usuario.query().findById(usuarioId);
        const perfil = await usuario.$relatedQuery<Perfil>('perfil');
        const republica = await usuario.$relatedQuery<Republica>('republica');
        request.usuario = usuario;
        request.perfil = perfil;
        request.republica = republica;

        next();
    } catch (error: any) {
        response.sendStatus(401);
    }
};