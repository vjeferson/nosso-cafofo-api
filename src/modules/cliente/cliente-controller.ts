import { Request, Response } from 'express';
import { INovoCliente } from '../../interfaces/novo-cliente-interface';
import AuthService from '../auth/auth-service';
import { IAuthenticateResult } from '../../interfaces/auth-result-interface';
import { IAuthenticateBody } from '../../interfaces/auth-body-interface';
import { Transaction } from 'objection';
import { Usuario } from '../usuario/usuario-model';
import ValidadoresSerive from '../../utils/validadores-service';
import CriptografarSenhasSerive from '../../utils/criptografar-senhas-service';
import { Republica } from '../republica/republica.model';
import { Morador } from '../morador/morador-model';
import { EnumTipoPerfil } from '../../utils/enums';
import { Perfil } from '../perfil/perfil-model';

export default class ClienteController {

    constructor() { };

    async adicionarCliente(request: Request, response: Response) {
        let transaction: Transaction = null;
        try {
            const authService = new AuthService();
            const dadosCliente: INovoCliente = request.body;

            transaction = await Usuario.startTransaction();

            ValidadoresSerive.validaEmail(dadosCliente.email);
            ValidadoresSerive.validaSenha(dadosCliente.senha);
            const senhaEncriptada = CriptografarSenhasSerive.encrypt(dadosCliente.senha);

            const republica = await Republica.query(transaction).insert({
                nome: dadosCliente.nomeRepublica,
                anoCriacao: dadosCliente.anoCriacaoRepublica,
                dataPagamentoContas: dadosCliente.diaPagamentoContas,
                numero: dadosCliente.numero,
                logradouro: dadosCliente.logradouro,
                complemento: dadosCliente.complemento,
                estadoId: dadosCliente.estadoId,
                cidadeId: dadosCliente.cidadeId
            });

            const morador = await Morador.query(transaction).insert({
                nome: dadosCliente.nome,
                anoEntrada: dadosCliente.anoEntradaMorador,
                ativo: true,
                republicaId: republica.id
            });

            const perfil = await Perfil.query(transaction).select('id').where('tipoPerfil', '=', EnumTipoPerfil.MoradorAdministrador);

            await Usuario.query(transaction).insert({
                nome: dadosCliente.nome,
                email: dadosCliente.email,
                senha: senhaEncriptada,
                perfilId: perfil[0].id,
                moradorId: morador.id,
                republicaId: republica.id
            });

            await transaction.commit();

            const result: IAuthenticateResult = await authService.authenticate(
                {
                    email: dadosCliente.email,
                    senha: dadosCliente.senha
                } as IAuthenticateBody
            );
            return response.status(200).send(result);
        } catch (error: any) {
            if (transaction) {
                await transaction.rollback();
            }
            return response.status(400).json({ error: 'Erro ao criar cadastro', message: error.message });
        }
    }

}