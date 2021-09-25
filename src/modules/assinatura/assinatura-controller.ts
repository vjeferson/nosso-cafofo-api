import { Request, Response } from 'express';
import { INovaAssinatura } from '../../interfaces/assinatura-create-interface';
import { IFiltroAssinatura } from '../../interfaces/assinatura-filter-interface';
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

}