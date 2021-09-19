import { Request, Response } from 'express';
import { IUsuario } from '../../interfaces/usuario-interface';
import CriptografarSenhasSerive from '../../utils/criptografar-senhas-service';
import ValidadoresSerive from '../../utils/validadores-service';
import { Usuario } from './usuario-model';

export default class UsuarioController {

    constructor() { };

    async find(request: Request, response: Response) {
        try {
            const filters = request.query;

            const usuarios = await Usuario.query().select();
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

            const usuario = await Usuario.query().select().where('id', '=', usuarioId);
            return response.status(200).send(usuario);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar o usuário', message: error.message });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const data: IUsuario = request.body;

            ValidadoresSerive.validaEmail(data.email);
            ValidadoresSerive.validaSenha(data.senha as string);
            const senhaEncriptada = CriptografarSenhasSerive.encrypt(data.senha as string);
            const novoUsuario = await Usuario.query().insert({
                nome: data.nome,
                email: data.email,
                senha: senhaEncriptada,
                perfilId: data.perfilId,
                republicaId: data.republicaId || null,
                moradorId: data.moradorId || null
            });

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

            const usuarioAtualizado = await Usuario.query()
                .findById(usuarioId)
                .patch({
                    nome: data.nome
                });

            if (!usuarioAtualizado) {
                throw new Error('Não existe um usuário para o id (identificador) informado!');
            }

            return response.status(201).send(true);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao atualizar usuário', message: error.message });
        }
    }

}