import { Request, Response } from 'express';
import RepublicaService from './republica-service';

export default class UsuarioController {

    constructor() { };

    // async find(request: Request, response: Response) {
    //     try {
    //         const filters = request.query;
    //         const service = new RepublicaService();
    //         const usuarios = await service.find(filters);
    //         return response.status(200).send(usuarios);
    //     } catch (error: any) {
    //         return response.status(400).json({ error: 'Erro ao consultar usuários', message: error.message });
    //     }
    // }

    // async findOne(request: Request, response: Response) {
    //     try {
    //         const usuarioId = request.params.id;
    //         if (isNaN(+usuarioId) || usuarioId === null || usuarioId === undefined) {
    //             throw new Error('Id (identificador) informado é inválido!');
    //         }

    //         const service = new UsuarioService();
    //         const usuario = await service.findOne(+usuarioId);
    //         return response.status(200).send(usuario);
    //     } catch (error: any) {
    //         return response.status(400).json({ error: 'Erro ao consultar o usuário', message: error.message });
    //     }
    // }

    // async upsert(request: Request, response: Response) {
    //     try {
    //         const usuarioId = request.params.id;
    //         if (isNaN(+usuarioId) || usuarioId === null || usuarioId === undefined) {
    //             throw new Error('Id (identificador) informado é inválido!');
    //         }
    //         const data: IUsuario = request.body;
    //         const service = new UsuarioService();
    //         const retorno = await service.upsert(+usuarioId, data);
    //         return response.status(201).send(retorno);
    //     } catch (error: any) {
    //         return response.status(400).json({ error: 'Erro ao atualizar usuário', message: error.message });
    //     }
    // }

}