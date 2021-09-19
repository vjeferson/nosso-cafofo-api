import { Response } from 'express';
import database from '../../database/connection';
import { INovoCliente } from '../../interfaces/novo-cliente-interface';
import CriptografarSenhasSerive from '../../utils/criptografar-senhas-service';
import { EnumTipoPerfil } from '../../utils/enums';
import ValidadoresSerive from '../../utils/validadores-service';

export default class ClienteService {
    constructor() { };

    async create(dados: INovoCliente, response: Response): Promise<void> {
        try {
            ValidadoresSerive.validaEmail(dados.email);
            ValidadoresSerive.validaSenha(dados.senha);
            const senhaEncriptada = CriptografarSenhasSerive.encrypt(dados.senha);

            await database.transaction(t => {
                database('republica').transacting(t)
                    .insert({
                        nome: dados.nomeRepublica,
                        ano_criacao: dados.anoCriacaoRepublica,
                        data_pagamento_contas: dados.diaPagamentoContas,
                        numero: dados.numero,
                        logradouro: dados.logradouro,
                        complemento: dados.complemento,
                        estado_id: dados.estadoId,
                        cidade_id: dados.cidadeId
                    }).returning('id')
                    .then(republica => {
                        database('morador').transacting(t)
                            .insert({
                                nome: dados.nome,
                                ano_entrada: dados.anoEntradaMorador,
                                ativo: true,
                                republica_id: republica[0]
                            }).returning('id')
                            .then(morador => {
                                database('usuario').transacting(t)
                                    .insert({
                                        nome: dados.nome,
                                        email: dados.email,
                                        senha: senhaEncriptada,
                                        perfil_id: EnumTipoPerfil.MoradorAdministrador,
                                        morador_id: morador[0] || null,
                                        republica_id: republica[0] || null
                                    })
                                    .then(t.commit)
                                    .catch(error => {
                                        t.rollback;
                                        return response.status(400).json({ error: `Houve um erro na criação do registro de Usuário`, message: error.message });
                                    });
                            }).catch(error => {
                                t.rollback;
                                return response.status(400).json({ error: `Houve um erro na criação do registro de Morador`, message: error.message });
                            });
                    }).catch(error => {
                        t.rollback;
                        return response.status(400).json({ error: `Houve um erro na criação do registro de República`, message: error.message });
                    });
            });
        } catch (error) {
            throw error;
        }
    }

}