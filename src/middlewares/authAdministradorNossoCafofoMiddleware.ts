import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { EnumTipoPerfil } from '../utils/enums';

dotenv.config();

export default async function authAdministradorNossoCafofoMiddleware(request: Request, response: Response, next: NextFunction) {
    try {
        // const token = authorization?.replace('Bearer', '').trim();
        // const decodedToken = jwt.verify(token as string, `${process.env.JWT_KEY}`);
        // const { id } = decodedToken as ITokenPayload;
        // request.usuario = id;
        if (request.perfil.tipoPerfil === EnumTipoPerfil.AdministradorNossoCafofo) {
            next();
        } else {
            return response.status(401).send('Você não possui autorização para a rota!');
        }
    } catch (error: any) {
        return response.sendStatus(401);
    }
}