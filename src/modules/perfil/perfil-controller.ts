import { Request, Response } from 'express';
import PerfilService from './perfil-service';

export default class PerfilController {

    constructor() { };

    async find(request: Request, response: Response) {
        try {
            const filters = request.query;
            const service = new PerfilService();
            const perfis = await service.find(filters);
            return response.status(200).send(perfis);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar perfis', message: error.message });
        }
    }

    async findOne(request: Request, response: Response) {
        try {
            const perfilId = +request.params.id;
            const service = new PerfilService();
            const perfil = await service.findOne(perfilId);
            return response.status(200).send(perfil);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar perfil', message: error.message });
        }
    }

}