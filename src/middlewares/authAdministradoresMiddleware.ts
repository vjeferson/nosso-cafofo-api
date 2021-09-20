import { Request, Response, NextFunction } from 'express';
import { EnumTipoPerfil } from '../utils/enums';

export default async function authAdministradoresMiddleware(request: Request, response: Response, next: NextFunction) {
    try {
        if (request.perfil.tipoPerfil === EnumTipoPerfil.AdministradorNossoCafofo ||
            request.perfil.tipoPerfil === EnumTipoPerfil.MoradorAdministrador
        ) {
            next();
        } else {
            return response.status(401).send('Você não possui autorização para realizar a ação!');
        }
    } catch (error: any) {
        return response.sendStatus(401);
    }
}