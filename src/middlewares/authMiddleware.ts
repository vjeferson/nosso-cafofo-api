import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ITokenPayload } from '../interfaces/token-payload-interface';
import database from '../database/connection';
import { IUsuario } from '../interfaces/usuario-interface';

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

    // database('usuario')
    //     .select('usuario.*')
    //     .where('usuario.id', usuarioId)
    //     .limit(1)
    //     .offset(0)
    //     .then(resposta => {
    //         if (Array.isArray(resposta) && resposta.length > 0) {
    //             request.usuario = {
    //                 id: resposta[0].id,
    //                 nome: resposta[0].nome,
    //                 email: resposta[0].email,
    //                 senha: resposta[0].senha,
    //                 createTime: resposta[0].create_time,
    //                 updateTime: resposta[0].update_time,
    //                 perfilId: resposta[0].perfil_id,
    //                 republicaId: resposta[0].republica_id,
    //                 moradorId: resposta[0].morador_id
    //             } as IUsuario;
    //             console.log('Primeiro');
    //             console.log(request.usuario);
    //             next();
    //         } else {
    //             response.sendStatus(400).send('Não existe um usuário para o identificador informado!');
    //         }
    //     }).catch(error => {
    //         response.sendStatus(400).send(error.message);
    //     });

};