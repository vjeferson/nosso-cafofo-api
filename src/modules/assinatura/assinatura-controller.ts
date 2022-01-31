import { Request, Response } from 'express';
import { IFiltroAssinantes } from '../../interfaces/assinantes-filter-interface';
import { INovaAssinatura } from '../../interfaces/assinatura-create-interface';
import { IFiltroAssinatura } from '../../interfaces/assinatura-filter-interface';
import { LIMIT_DEFAULT, LIMIT_MAXIMO } from '../../utils/consts';
import TenantsSerive from '../../utils/tenants-service';
import { Assinatura } from './assinatura-model';

export default class AssinaturaController {

    constructor() { };

    async find(request: Request, response: Response) {
        try {
            const filters: IFiltroAssinatura = request.query as any;

            const query = Assinatura.query();

            if (filters.planoId) {
                query.where('planoId', filters.planoId);
            }

            if (filters.ativa !== null && filters.ativa !== undefined &&
                (Boolean(filters.ativa) === true || Boolean(filters.ativa) === false)) {
                query.where('ativa', filters.ativa);
            }

            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, query, request.usuario.republicaId);
            const assinaturas = await query.select();
            return response.status(200).send(assinaturas);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar assinaturas', message: error.message });
        }
    }

    async findOne(request: Request, response: Response) {
        try {
            const assinaturaId = request.params.id;
            if (isNaN(+assinaturaId) || assinaturaId === null || assinaturaId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const query = Assinatura.query();
            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, query, request.usuario.republicaId);
            query.where('id', assinaturaId);
            const assinatura = await query.select();

            return response.status(200).send(Array.isArray(assinatura) && assinatura.length > 0 ? assinatura[0] : null);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar o assinatura', message: error.message });
        }
    }

    async assinar(request: Request, response: Response) {
        try {
            const dados: INovaAssinatura = request.body;
            if (isNaN(+dados.planoId) || dados.planoId === null || dados.planoId === undefined) {
                throw new Error('Id (identificador) do Plano informado é inválido!');
            }

            const novaAssinatura = await Assinatura.query().insert({
                ativa: true,
                planoId: dados.planoId,
                republicaId: request.republica.id
            });
            return response.status(201).send(novaAssinatura);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao assinar plano', message: error.message });
        }
    }

    async findAssinantes(request: Request, response: Response) {
        try {
            const filters: IFiltroAssinantes = request.query as any;
            const limit: number = filters.limit && !isNaN(+filters.limit) && filters.limit < LIMIT_MAXIMO ?
                +filters.limit : LIMIT_DEFAULT;
            const offset: number = filters.offset || 0;

            const query = Assinatura.query().alias('a');
            query.where('a.ativa', '=', true);
            const queryCount = Assinatura.query().alias('a');
            queryCount.where('a.ativa', '=', true);

            if (filters.nome) {
                query.where('r.nome', 'like', `${filters.nome}%`);
                queryCount.where('r.nome', 'like', `${filters.nome}%`);
            }

            if (!isNaN(+(filters.anoCriacao as any)) && filters.anoCriacao !== null
                && filters.anoCriacao !== undefined && (filters.anoCriacao as any) !== '') {
                query.where('r.anoCriacao', filters.anoCriacao);
                queryCount.where('r.anoCriacao', filters.anoCriacao);
            }

            if (!isNaN(+(filters.dataPagamentoContas as any)) && filters.dataPagamentoContas !== null
                && filters.dataPagamentoContas !== undefined && (filters.dataPagamentoContas as any) !== '') {
                query.where('r.dataPagamentoContas', filters.dataPagamentoContas);
                queryCount.where('r.dataPagamentoContas', filters.dataPagamentoContas);
            }

            if (!isNaN(+(filters.tipoPlanoAtivo as any)) && filters.tipoPlanoAtivo !== null
                && filters.tipoPlanoAtivo !== undefined && (filters.tipoPlanoAtivo as any) !== '') {
                query.where('p.tipoPlano', filters.tipoPlanoAtivo);
                queryCount.where('p.tipoPlano', filters.tipoPlanoAtivo);
            }

            const assinantes = await query.select(
                'a.id',
                'r.nome',
                'r.anoCriacao',
                'r.dataPagamentoContas',
                'p.tipoPlano')
                .joinRelated('republica', { alias: 'r' })
                .joinRelated('plano', { alias: 'p' })
                .limit(limit).offset(offset).orderBy('a.id', 'ASC');

            const count: any[] = await queryCount.select()
                .joinRelated('republica', { alias: 'r' })
                .joinRelated('plano', { alias: 'p' })
                .count();

            return response.status(200).send({ rows: assinantes, count: Array.isArray(count) && count.length > 0 ? +count[0].count : 0 });
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao assinar plano', message: error.message });
        }
    }


    async findAssinanteEspecifico(request: Request, response: Response) {
        try {
            const assinaturaId = request.params.id;
            if (isNaN(+assinaturaId) || assinaturaId === null || assinaturaId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const query = Assinatura.query().alias('a');
            query.where('a.id', '=', assinaturaId);
            query.where('a.ativa', '=', true);

            const assinante = await query.select(
                'a.id',
                'a.dataAssinatura',
                'r.nome',
                'r.anoCriacao',
                'r.dataPagamentoContas',
                'p.tipoPlano')
                .joinRelated('republica', { alias: 'r' })
                .joinRelated('plano', { alias: 'p' });

            return response.status(200).send(Array.isArray(assinante) && assinante.length > 0 ? assinante[0] : null);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar o assinatura', message: error.message });
        }
    }

}