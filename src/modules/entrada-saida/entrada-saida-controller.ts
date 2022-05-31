import { Request, Response } from 'express';
import { INovaEntradaSaida } from '../../interfaces/entrada-saida-create-interface';
import { IFiltroEntradaSaida } from '../../interfaces/entrada-saida-filter-interface';
import { LIMIT_DEFAULT, LIMIT_MAXIMO } from '../../utils/consts';
import { EnumTipoMovimentoEntradaSaida } from '../../utils/enums';
import TenantsSerive from '../../utils/tenants-service';
import { EntradaSaida } from './entrada-saida-model';

export default class EstadoController {

    constructor() { };

    async find(request: Request, response: Response) {
        try {
            const filters: IFiltroEntradaSaida = request.query as any;
            const limit: number = filters.limit && !isNaN(+filters.limit) && filters.limit < LIMIT_MAXIMO ?
                +filters.limit : LIMIT_DEFAULT;
            const offset: number = filters.offset || 0;

            const query = EntradaSaida.query();
            const queryCount = EntradaSaida.query();

            if (filters.descricao) {
                query.where('descricao', 'like', `${filters.descricao}%`);
                queryCount.where('descricao', 'like', `${filters.descricao}%`);
            }

            if ([EnumTipoMovimentoEntradaSaida.Entrada, 
                EnumTipoMovimentoEntradaSaida.Saida].indexOf(filters.tipoMovimento as any) >-1) {
                query.where('tipoMovimento', '=', filters.tipoMovimento);
                queryCount.where('tipoMovimento', '=', filters.tipoMovimento);
            }

            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, query,
                request.usuario.republicaId);
            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, queryCount,
                request.usuario.republicaId);

            const movimentos = await query.select().limit(limit).offset(offset).orderBy('id');
            const count: any[] = await queryCount.select().count();

            return response.status(200).send({
                rows: movimentos,
                count: Array.isArray(count) && count.length > 0 ?
                    +count[0].count : 0
            });
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar registros', message: error.message });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const dados: INovaEntradaSaida = request.body;
            const novoRegistro = await EntradaSaida.query().insert(
                Object.assign(dados, {republicaId: request.republica.id})
            );

            return response.status(201).send(novoRegistro);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao criar registro', message: error.message });
        }
    }

}