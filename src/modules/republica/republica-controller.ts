import { Request, Response } from 'express';
import database from '../../database/connection';
import { IFiltroRepublica } from '../../interfaces/republica-filter-interface';
import { IRepublica } from '../../interfaces/republica-interface';
import { EnumTipoPerfil } from '../../utils/enums';
import { Republica } from './republica.model';

export default class RepublicaController {

    constructor() { };

    async find(request: Request, response: Response) {
        try {
            const filters: IFiltroRepublica = request.query as any;

            const query = Republica.query();

            if (filters.nome) {
                query.where('nome', 'like', `${filters.nome}%`);
            }

            if (!isNaN(+(filters.anoCriacao as any)) && filters.anoCriacao !== null && filters.anoCriacao !== undefined
                && (filters.anoCriacao as any) !== '') {
                query.where('anoCriacao', filters.anoCriacao);
            }

            if (!isNaN(+(filters.dataPagamentoContas as any)) && filters.dataPagamentoContas !== null && filters.dataPagamentoContas !== undefined
                && (filters.dataPagamentoContas as any) !== '') {
                query.where('dataPagamentoContas', filters.dataPagamentoContas);
            }

            const republicas = await query.select();

            return response.status(200).send(republicas);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar repúblicas', message: error.message });
        }
    }

    async findOne(request: Request, response: Response) {
        try {
            const republicaId = request.params.id;
            if (isNaN(+republicaId) || republicaId === null || republicaId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            if (+request.usuario.republicaId !== +republicaId && request.perfil.tipoPerfil !== EnumTipoPerfil.AdministradorNossoCafofo) {
                return response.status(401).send('Seu usuário não possui permissão para visualizar informações da república informada!');
            }

            const query = Republica.query();
            const cidades = await query.select().where('id', republicaId);
            return response.status(200).send(Array.isArray(cidades) && cidades.length > 0 ? cidades[0] : null);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar o república', message: error.message });
        }
    }

    async upsert(request: Request, response: Response) {
        try {
            const republicaId = request.params.id;
            if (isNaN(+republicaId) || republicaId === null || republicaId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const dados: IRepublica = request.body;

            if (+request.usuario.republicaId !== +republicaId) {
                return response.status(401).send('Seu usuário não possui permissão para alterar informações da república informada!');
            }

            const republicaAtualizada = await Republica.query()
                .findById(republicaId)
                .patch({
                    nome: dados.nome,
                    anoCriacao: dados.anoCriacao,
                    dataPagamentoContas: dados.dataPagamentoContas
                });

            if (!republicaAtualizada) {
                throw new Error('Não existe uma república para o id (identificador) informado!');
            }

            return response.status(201).send(true);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao atualizar república', message: error.message });
        }
    }

}