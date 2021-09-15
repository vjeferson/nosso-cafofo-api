import { Request, Response } from 'express';
import AuthService from './auth-service';
import { IAuthenticateBody } from '../../interfaces/auth-body-interface';
import { IAuthenticateResult } from '../../interfaces/auth-result-interface';

export default class AuthController {

    constructor() { };

    async authenticate(request: Request, response: Response) {
        try {
            const filters: IAuthenticateBody = request.body;
            const service = new AuthService();
            const dados: IAuthenticateResult = await service.authenticate(filters);
            return response.status(200).send(dados);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao realizar autenticação', message: error.message });
        }
    }

}