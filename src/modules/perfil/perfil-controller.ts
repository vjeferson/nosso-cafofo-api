import { Request, Response } from 'express';
import { Perfil } from './perfil-model';

export default class PerfilController {

    async find(request: Request, response: Response) {
        try {
            const filters = request.query;

            const perfis = await Perfil.query().select();
            return response.status(200).send(perfis);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar perfis', message: error.message });
        }
    }

    async findOne(request: Request, response: Response) {
        try {
            const perfilId = +request.params.id;
            if (isNaN(+perfilId) || perfilId === null || perfilId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const perfil = await Perfil.query().findById(perfilId);
            return response.status(200).send(perfil);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar perfil', message: error.message });
        }
    }

}