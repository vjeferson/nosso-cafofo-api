import { Request, Response } from 'express';
import { IUsuario } from './usuario-interface';
import UsuarioService from './usuario-service';

export default class UsuarioController {

    constructor() { };

    async find(request: Request, response: Response) {
        try {
            const filters = request.query;
            const service = new UsuarioService();
            const usuarios = await service.find(filters);
            return response.status(200).send(usuarios);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar usuários', message: error.message });
        }
    }

    async findOne(request: Request, response: Response) {
        try {
            const usuarioId = +request.params.id;
            const service = new UsuarioService();
            const usuario = await service.findOne(usuarioId);
            return response.status(200).send(usuario);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar o usuário', message: error.message });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const data: IUsuario = request.body;
            const service = new UsuarioService();
            await service.create(data, response);
            return response.status(201).send();
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao criar usuário', message: error.message });
        }
    }

    async createNewClient() {
        return null;
    }

}