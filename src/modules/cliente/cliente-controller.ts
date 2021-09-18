import { Request, Response } from 'express';
import { INovoCliente } from '../../interfaces/novo-cliente-interface';
import ClienteService from './cliente-service';
import AuthService from '../auth/auth-service';
import { IAuthenticateResult } from '../../interfaces/auth-result-interface';
import { IAuthenticateBody } from '../../interfaces/auth-body-interface';

export default class ClienteController {

    constructor() { };

    async adicionarCliente(request: Request, response: Response) {
        try {
            const clienteService = new ClienteService();
            const authService = new AuthService();
            const dadosCliente: INovoCliente = request.body;

            const senha = dadosCliente.senha;
            await clienteService.create(dadosCliente, response);

            const result: IAuthenticateResult = await authService.authenticate(
                {
                    email: dadosCliente.email,
                    senha: senha
                } as IAuthenticateBody
            );
            return response.status(200).send(result);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao criar cadastro', message: error.message });
        }
    }

}