import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { Perfil } from '../modules/perfil/perfil-model';
import { Usuario } from '../modules/usuario/usuario-model';
import { EnumTipoPerfil } from '../utils/enums';

dotenv.config();

const authAdministradorNossoCafofoMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const usuario = await Usuario.query().findById(request.usuarioId);
        const perfil = await usuario.$relatedQuery('perfil');
        // const token = authorization?.replace('Bearer', '').trim();
        // const decodedToken = jwt.verify(token as string, `${process.env.JWT_KEY}`);
        // const { id } = decodedToken as ITokenPayload;
        // request.usuario = id;
        if ((perfil as any).tipoPerfil === EnumTipoPerfil.AdministradorNossoCafofo) {
            next();
        } else {
            return response.status(401).send('Você não possui autorização para a rota!');
        }
    } catch (error: any) {
        return response.sendStatus(401);
    }
}

export default authAdministradorNossoCafofoMiddleware;