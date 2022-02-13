import { Request, Response } from 'express';
import AuthService from './auth-service';
import { IAuthenticateBody } from '../../interfaces/auth-body-interface';
import { IAuthenticateResult } from '../../interfaces/auth-result-interface';
import { IAuthenticateContaSocialBody } from '../../interfaces/auth-conta-social-body-interface';

export default class AuthController {

    constructor() { };

    async authenticate(request: Request, response: Response) {
        try {
            const filters: IAuthenticateBody = request.body;
            const service = new AuthService();
            const dados: IAuthenticateResult = await service.authenticate(filters, false);
            return response.status(200).send(dados);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao realizar autenticação', message: error.message });
        }
    }

    async authenticateComContaSocial(request: Request, response: Response) {
        try {
            const filters: IAuthenticateContaSocialBody = request.body;
            const service = new AuthService();
            const dados: IAuthenticateResult = await service.authenticate(filters, true);
            return response.status(200).send(dados);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao realizar autenticação', message: error.message });
        }
    }

}