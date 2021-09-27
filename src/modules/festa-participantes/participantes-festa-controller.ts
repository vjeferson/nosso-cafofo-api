import { Request, Response } from 'express';
import { INovoParticipantesFesta } from '../../interfaces/participantes-festa-create-interface';
import { IFiltroParticipantesFesta } from '../../interfaces/participantes-festa-filter-interface';
import { IUpdateParticipantesFesta } from '../../interfaces/participantes-festa-update-interface';
import errorHandlerObjection from '../../utils/handler-erros-objection';
import TenantsSerive from '../../utils/tenants-service';
import { ParticipantesFesta } from './participantes-festa-model';

export default class ParticipantesFestaController {

    constructor() { };

    async find(request: Request, response: Response) {
        try {
            const filters: IFiltroParticipantesFesta = request.query as any;
            const festaId = request.params.festaId;

            const query = ParticipantesFesta.query();

            if (!isNaN(+(festaId as any)) && festaId !== null && festaId !== undefined
                && (festaId as any) !== '') {
                query.where('festaId', festaId);
            } else {
                throw new Error('Identificador(id) da festa não foi informado!');
            }

            if (filters.nome) {
                query.where('nome', 'like', `${filters.nome}%`);
            }

            if (!isNaN(+filters.situacao) && filters.situacao !== null && filters.situacao !== undefined
                && (filters.situacao as any) !== '') {
                query.where('situacao', filters.situacao);
            }

            if (!isNaN(+filters.lote) && filters.lote !== null && filters.lote !== undefined
                && (filters.lote as any) !== '') {
                query.where('lote', filters.lote);
            }

            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, query, request.usuario.republicaId);
            const participantes = await query.select();
            return response.status(200).send(participantes);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar participantes', message: error.message });
        }
    }

    async findOne(request: Request, response: Response) {
        try {
            const participanteId = request.params.id;
            const festaId = request.params.festaId;

            if (isNaN(+participanteId) || participanteId === null || participanteId === undefined) {
                throw new Error('Id (identificador) do participante informado é inválido!');
            }

            if (isNaN(+festaId) || festaId === null || festaId === undefined) {
                throw new Error('Id (identificador) da festa informado é inválido!');
            }

            const query = ParticipantesFesta.query();
            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, query, request.usuario.republicaId);
            query.where('id', participanteId);
            query.where('festaId', festaId);
            const participante = await query.select();

            return response.status(200).send(Array.isArray(participante) && participante.length > 0 ? participante[0] : null);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar participante', message: error.message });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const dados: INovoParticipantesFesta = request.body;
            const novoParticipante = await ParticipantesFesta.query().insert({
                nome: dados.nome,
                valor: dados.valor,
                lote: dados.lote,
                situacao: dados.situacao,
                festaId: dados.festaId,
                republicaId: request.republica.id
            });

            return response.status(201).send(novoParticipante);
        } catch (error: any) {
            errorHandlerObjection(error, response, 'Erro ao criar participante');
        }
    }

    async upsert(request: Request, response: Response) {
        try {
            const participanteId = request.params.id;
            const festaId = request.params.festaId;

            if (isNaN(+participanteId) || participanteId === null || participanteId === undefined) {
                throw new Error('Id (identificador) do participante informado é inválido!');
            }

            if (isNaN(+festaId) || festaId === null || festaId === undefined) {
                throw new Error('Id (identificador) da festa informado é inválido!');
            }

            const dados: IUpdateParticipantesFesta = request.body;

            const participante = await ParticipantesFesta.query().findById(participanteId);

            if (participante) {
                if (+request.usuario.republicaId !== +participante.republicaId || +festaId !== +participante.festaId) {
                    return response.status(401).send('Seu usuário não pode alterar informações do participante informado!');
                }

                await ParticipantesFesta.query()
                    .findById(participante.id as number)
                    .patch({
                        nome: dados.nome,
                        valor: dados.valor,
                        lote: dados.lote,
                        situacao: dados.situacao
                    });
            } else {
                throw new Error('Não existe um participante para o id (identificador) informado!');
            }

            return response.status(200).send(true);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao atualizar participante', message: error.message });
        }
    }

    async delete(request: Request, response: Response) {
        try {
            const participanteId = request.params.id;
            const festaId = request.params.festaId;
            if (isNaN(+participanteId) || participanteId === null || participanteId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            if (isNaN(+festaId) || festaId === null || festaId === undefined) {
                throw new Error('Id (identificador) da festa informado é inválido!');
            }

            const participante = await ParticipantesFesta.query().findById(participanteId);

            if (participante) {
                if (+request.usuario.republicaId !== +participante.republicaId ||
                    +festaId !== +participante.festaId) {
                    return response.status(401).send('Seu usuário não pode deletar o participante informado!');
                }

                await participante.$query().delete();
            } else {
                return response.status(204).send('Não existe uma participante para o id (identificador) informado!');
            }

            return response.status(200).send(true);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao deletar participante', message: error.message });
        }
    }

}