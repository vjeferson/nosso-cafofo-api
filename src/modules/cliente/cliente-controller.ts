import { Request, Response } from 'express';
import { INovoCliente } from '../../interfaces/novo-cliente';
import ClienteService from './cliente-service';
import AuthService from '../auth/auth-service';
import { IAuthenticateResult } from '../../interfaces/auth-result-interface';
import { IAuthenticateBody } from '../../interfaces/auth-body-interface';
import ValidadoresSerive from '../../utils/validadores-service';
import CriptografarSenhasSerive from '../../utils/criptografar-senhas-service';

export default class ClienteController {

    constructor() { };

    async adicionarCliente(request: Request, response: Response) {
        try {
            const clienteService = new ClienteService();
            const authService = new AuthService();
            const dadosCliente: INovoCliente = request.body;

            ValidadoresSerive.validaEmail(dadosCliente.email);
            ValidadoresSerive.validaSenha(dadosCliente.senha);
            const senha = dadosCliente.senha
            dadosCliente.senha = CriptografarSenhasSerive.encrypt(dadosCliente.senha);

            await clienteService.create(dadosCliente);

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