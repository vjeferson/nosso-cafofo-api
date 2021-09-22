import { Request, Response } from 'express';
import { IFiltroCidade } from '../../interfaces/cidade-filter-interface';
import { LIMIT_DEFAULT, LIMIT_MAXIMO } from '../../utils/consts';
import { Cidade } from './cidade-model';

export default class CidadeController {

    constructor() { };

    async find(request: Request, response: Response) {
        try {
            const filters: IFiltroCidade = request.query as any;

            const limit: number = filters.limit && !isNaN(+filters.limit) && filters.limit < LIMIT_MAXIMO ? +filters.limit : LIMIT_DEFAULT;
            const offset: number = filters.offset || 0;

            const query = Cidade.query();

            if (filters.estadoId) {
                query.where('estadoId', 'like', `${filters.estadoId.toUpperCase()}%`);
            }

            if (filters.cidade) {
                query.where('cidade', 'like', `${filters.cidade}%`);
            }

            const cidades = await query.select().limit(limit).offset(offset);

            return response.status(200).send(cidades);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar cidades', message: error.message });
        }
    }

    async findOne(request: Request, response: Response) {
        try {
            const cidadeId = request.params.id;
            if (isNaN(+cidadeId) || cidadeId === null || cidadeId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const query = Cidade.query();
            const cidades = await query.select().where('id', cidadeId);
            return response.status(200).send(Array.isArray(cidades) && cidades.length > 0 ? cidades[0] : null);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar cidade', message: error.message });
        }
    }

}