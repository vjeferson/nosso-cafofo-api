import { Request, Response } from 'express';
import { IFiltroEstado } from '../../interfaces/estado-filter-interface';
import { Estado } from './estado.model';

export default class EstadoController {

    constructor() { };

    async find(request: Request, response: Response) {
        try {
            const filters: IFiltroEstado = request.query as any;

            const query = Estado.query();

            if (filters.estado) {
                query.where('estado', 'like', `${filters.estado.toUpperCase()}%`);
            }

            if (filters.id) {
                query.where('id', 'like', `${filters.id.toUpperCase()}%`);
            }

            const estados = await query.select();

            return response.status(200).send(estados);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar estados', message: error.message });
        }
    }

    async findOne(request: Request, response: Response) {
        try {
            const estadoId = request.params.id;
            if (!estadoId) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const query = Estado.query();
            const estados = await query.select().where('id', estadoId);
            return response.status(200).send(Array.isArray(estados) && estados.length > 0 ? estados[0] : null);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar estado', message: error.message });
        }
    }

}