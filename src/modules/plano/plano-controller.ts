import { Request, Response } from 'express';
import { INovoPlano } from '../../interfaces/plano-create-interface';
import { IFiltroPlano } from '../../interfaces/plano-filter-interface';
import { IUpdatePlano } from '../../interfaces/plano-update-interface';
import { ITipoPlano } from '../../interfaces/tipo-plano-interface';
import { EnumTipoPlano } from '../../utils/enums';
import errorHandlerObjection from '../../utils/handler-erros-objection';
import { Plano } from './plano-model';

export default class PlanoController {

    constructor() { };

    async tiposPlanos(request: Request, response: Response) {
        const tiposPlanos: ITipoPlano[] = [
            {
                descricao: 'Plano Mensal',
                codigoTipoPlano: EnumTipoPlano.Mensal
            },
            {
                descricao: 'Plano Semestal',
                codigoTipoPlano: EnumTipoPlano.Semestral
            },
            {
                descricao: 'Plano Anual',
                codigoTipoPlano: EnumTipoPlano.Anual
            },
            {
                descricao: 'Plano Promocional Anual',
                codigoTipoPlano: EnumTipoPlano.PromocionalAnual
            }
        ];

        return response.status(200).send(tiposPlanos);
    }

    async find(request: Request, response: Response) {
        try {
            const filters: IFiltroPlano = request.query as any;

            const query = Plano.query();

            if (filters.tipoPlano) {
                query.where('tipoPlano', filters.tipoPlano);
            }

            if (filters.ativo !== null && filters.ativo !== undefined &&
                (Boolean(filters.ativo) === true || Boolean(filters.ativo) === false)) {
                query.where('ativo', filters.ativo);
            }

            const planos = await query.select();

            return response.status(200).send(planos);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar planos', message: error.message });
        }
    }

    async findOne(request: Request, response: Response) {
        try {
            const planoId = request.params.id;
            if (!planoId) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const query = Plano.query();
            const planos = await query.select().where('id', planoId);
            return response.status(200).send(Array.isArray(planos) && planos.length > 0 ? planos[0] : null);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar plano', message: error.message });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const dados: INovoPlano = request.body;
            const novoPlano = await Plano.query().insert({
                tipoPlano: dados.tipoPlano,
                recorrencia: dados.recorrencia,
                descricao: dados.descricao,
                numeroMaximoParcelasPagamento: dados.numeroMaximoParcelasPagamento,
                valorPlano: dados.valorPlano
            }).returning('*');

            return response.status(201).send(novoPlano);
        } catch (error: any) {
            errorHandlerObjection(error, response, 'Erro ao criar plano');
        }
    }

    async upsert(request: Request, response: Response) {
        try {
            const planoId = request.params.id;
            if (isNaN(+planoId) || planoId === null || planoId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const dados: IUpdatePlano = request.body;

            const planoAtualizado = await Plano.query()
                .findById(planoId)
                .patch({
                    recorrencia: dados.recorrencia,
                    descricao: dados.descricao,
                    ativo: dados.ativo
                });

            if (!planoAtualizado) {
                throw new Error('Não existe um plano para o id (identificador) informado!');
            }

            return response.status(200).send(true);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao atualizar plano', message: error.message });
        }
    }

}