import { Request, Response } from 'express';
import { INovaFesta } from '../../interfaces/festa-create-interface';
import { IFiltroFesta } from '../../interfaces/festa-filter-interface';
import { IUpdateFesta } from '../../interfaces/festa-update-interface';
import { LIMIT_DEFAULT, LIMIT_MAXIMO } from '../../utils/consts';
import TenantsSerive from '../../utils/tenants-service';
import { Festa } from './festa-model';

export default class FestaController {

    constructor() { };

    async find(request: Request, response: Response) {
        try {
            const filters: IFiltroFesta = request.query as any;
            const limit: number = filters.limit && !isNaN(+filters.limit) && filters.limit < LIMIT_MAXIMO ?
                +filters.limit : LIMIT_DEFAULT;
            const offset: number = filters.offset || 0;

            const query = Festa.query();
            const queryCount = Festa.query();

            if (filters.descricao) {
                query.where('descricao', 'like', `${filters.descricao}%`);
                queryCount.where('descricao', 'like', `${filters.descricao}%`);
            }

            if (!isNaN(+filters.situacao) && filters.situacao !== null && filters.situacao !== undefined
                && (filters.situacao as any) !== '') {
                query.where('situacao', filters.situacao);
                queryCount.where('situacao', filters.situacao);
            }

            if (filters.data) {
                filters.data = Array.isArray(filters.data) ? filters.data :
                    (filters.data as string).split(',');
                query.whereBetween('data', [new Date(filters.data[0]),
                new Date(filters.data[1])] as any);
                queryCount.whereBetween('data', [new Date(filters.data[0]),
                new Date(filters.data[1])] as any);
            }

            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, query,
                request.usuario.republicaId);
            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, queryCount,
                request.usuario.republicaId);

            const festas = await query.select().limit(limit).offset(offset).orderBy('id');
            const count: any[] = await queryCount.select().count();

            return response.status(200).send({
                rows: festas,
                count: Array.isArray(count) && count.length > 0 ?
                    +count[0].count : 0
            });
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar festas', message: error.message });
        }
    }

    async findOne(request: Request, response: Response) {
        try {
            const festaId = request.params.id;
            if (isNaN(+festaId) || festaId === null || festaId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const query = Festa.query();
            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, query, request.usuario.republicaId);
            query.where('id', festaId);
            const festa = await query.select();

            return response.status(200).send(Array.isArray(festa) && festa.length > 0 ? festa[0] : null);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar a festa', message: error.message });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const dados: INovaFesta = request.body;
            const novaFesta = await Festa.query().insert({
                descricao: dados.descricao,
                data: dados.data,
                republicaId: request.republica.id
            });

            return response.status(201).send(novaFesta);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao criar festa', message: error.message });
        }
    }

    async upsert(request: Request, response: Response) {
        try {
            const festaId = request.params.id;
            if (isNaN(+festaId) || festaId === null || festaId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const dados: IUpdateFesta = request.body;

            const festa = await Festa.query().findById(festaId);

            if (festa) {
                if (+request.usuario.republicaId !== +festa.republicaId) {
                    return response.status(401).send('Seu usuário não pode alterar informações da festa informada!');
                }

                await Festa.query()
                    .findById(festa.id as number)
                    .patch({
                        descricao: dados.descricao,
                        data: dados.data
                    });
            } else {
                throw new Error('Não existe uma festa para o id (identificador) informado!');
            }

            return response.status(200).send(true);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao atualizar festa', message: error.message });
        }
    }

    async delete(request: Request, response: Response) {
        try {
            const festaId = request.params.id;
            if (isNaN(+festaId) || festaId === null || festaId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const festa = await Festa.query().findById(festaId);

            if (festa) {
                if (+request.usuario.republicaId !== +festa.republicaId) {
                    return response.status(401).send('Seu usuário não pode deletar a festa informado!');
                }

                await festa.$query().delete();
            } else {
                return response.status(204).send('Não existe uma festa para o id (identificador) informado!');
            }

            return response.status(200).send(true);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao deletar festa', message: error.message });
        }
    }

}