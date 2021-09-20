import { Request, Response } from 'express';
import { IUsuario } from '../../interfaces/usuario-interface';
import CriptografarSenhasSerive from '../../utils/criptografar-senhas-service';
import { EnumTipoPerfil } from '../../utils/enums';
import TenantsSerive from '../../utils/tenants-service';
import ValidadoresSerive from '../../utils/validadores-service';
import { Perfil } from '../perfil/perfil-model';
import { Usuario } from './usuario-model';

export default class UsuarioController {

    async find(request: Request, response: Response) {
        try {
            const filters = request.query;

            const query = Usuario.query();
            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, query, request.usuario.republicaId);
            const usuarios = await query.select();

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

            const query = Usuario.query();
            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, query, request.usuario.republicaId);
            query.where('id', usuarioId);
            const usuario = await query.select();

            return response.status(200).send(Array.isArray(usuario) && usuario.length > 0 ? usuario[0] : null);
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

            if (request.perfil.tipoPerfil === EnumTipoPerfil.AdministradorNossoCafofo) {
                data.perfilId = request.perfil.id;
            } else {
                const perfil = await Perfil.query().findById(data.perfilId);
                if (!perfil || (perfil && perfil.tipoPerfil === EnumTipoPerfil.AdministradorNossoCafofo)) {
                    throw new Error('Identificador de Perfil inválido!');
                }
            }

            const novoUsuario = await Usuario.query().insert({
                nome: data.nome,
                email: data.email,
                senha: senhaEncriptada,
                perfilId: data.perfilId,
                republicaId: request.republica ? request.republica.id : null,
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