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
import { EnumTipoPerfil, EnumTipoPlano } from '../../utils/enums';
import { Perfil } from '../perfil/perfil-model';
import { Assinatura } from '../assinatura/assinatura-model';
import { Plano } from '../plano/plano-model';

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


            let objectUsuario: any = {
                nome: dadosCliente.nome,
                email: dadosCliente.email,
                senha: senhaEncriptada,
                perfilId: perfil[0].id,
                moradorId: morador.id,
                republicaId: republica.id
            };

            if (dadosCliente.idSocialAccount && dadosCliente.socialType) {
                const mapSocialTypeColumn: any = {
                    'facebook': 'facebookId',
                    'google': 'googleId'
                };

                objectUsuario[mapSocialTypeColumn[dadosCliente.socialType]] = dadosCliente.idSocialAccount;
            }

            await Usuario.query(transaction).insert(objectUsuario);

            let plano: Plano[];
            if (!dadosCliente.planoId) {
                plano = await Plano.query(transaction)
                    .select('id')
                    .where('tipoPlano', '=', EnumTipoPlano.Free)
                    .where('ativo', '=', true);

                if (!Array.isArray(plano) || plano.length == 0) {
                    throw Error('Cadastro de clientes temporariamente indisponível, entre em contato com o Suporte para obter mais informações!');
                }
            } else {
                plano = await Plano.query(transaction).select().where('id', dadosCliente.planoId);
            }

            if (!plano || plano.length == 0) {
                throw Error('Cadastro de clientes temporariamente indisponível, entre em contato com o Suporte para obter mais informações!');
            }

            await Assinatura.query(transaction).insert({
                ativa: true,
                planoId: plano[0].id,
                republicaId: republica.id
            });

            await transaction.commit();

            const result: IAuthenticateResult = await authService.authenticate(
                {
                    email: dadosCliente.email,
                    senha: dadosCliente.senha
                } as IAuthenticateBody
            );
            return response.status(201).send(result);
        } catch (error: any) {
            if (transaction) {
                await transaction.rollback();
            }
            return response.status(400).json({ error: 'Erro ao criar cadastro', message: error.message });
        }
    }

}