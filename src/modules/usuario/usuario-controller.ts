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
            const usuarioId = request.params.id;
            if (isNaN(+usuarioId) || usuarioId === null || usuarioId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }
            console.log(request.params)
            const service = new UsuarioService();
            const usuario = await service.findOne(+usuarioId);
            return response.status(200).send(usuario);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar o usuário', message: error.message });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const data: IUsuario = request.body;
            const service = new UsuarioService();
            const novoUsuario = await service.create(data, response);
            console.log(novoUsuario);
            return response.status(201).send(novoUsuario);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao criar usuário', message: error.message });
        }
    }

    async upsert(request: Request, response: Response) {
        try {
            const usuarioId = request.params.id;
            if (isNaN(+usuarioId) || usuarioId === null || usuarioId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }
            const data: IUsuario = request.body;
            const service = new UsuarioService();
            const retorno = await service.upsert(+usuarioId, data, response);
            return response.status(201).send(retorno);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao atualizar usuário', message: error.message });
        }
    }

    async createNewClient() {
        return null;
    }

}