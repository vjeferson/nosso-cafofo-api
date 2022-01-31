import { Request, Response } from 'express';
import { ITrocaSenhaAcesso } from '../../interfaces/troca-senha-interface';
import { INovoUsuario } from '../../interfaces/usuario-create-interface';
import { IFiltroUsuario } from '../../interfaces/usuario-filter-interface';
import { IUpdateUsuario } from '../../interfaces/usuario-update-interface';
import { IVinculaAccountSocialData } from '../../interfaces/vincula-account-social-interface';
import CriptografarSenhasSerive from '../../utils/criptografar-senhas-service';
import { EnumTipoPerfil } from '../../utils/enums';
import TenantsSerive from '../../utils/tenants-service';
import ValidadoresSerive from '../../utils/validadores-service';
import { Perfil } from '../perfil/perfil-model';
import { Usuario } from './usuario-model';

export default class UsuarioController {

    async find(request: Request, response: Response) {
        try {
            const filters: IFiltroUsuario = request.query as any;

            const query = Usuario.query();

            if (filters.nome) {
                query.where('nome', 'like', `${filters.nome}%`);
            }

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
            const data: INovoUsuario = request.body;

            ValidadoresSerive.validaEmail(data.email);
            ValidadoresSerive.validaSenha(data.senha as string);
            const senhaEncriptada = CriptografarSenhasSerive.encrypt(data.senha);

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

            const data: IUpdateUsuario = request.body;

            const usuarioAtualizado = await Usuario.query().findById(+usuarioId)
                .skipUndefined()
                .patch({ id: +usuarioId, nome: data.nome, email: data.email });

            if (!usuarioAtualizado) {
                throw new Error('Não existe um usuário para o id (identificador) informado!');
            }

            return response.status(201).send(true);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao atualizar usuário', message: error.message });
        }
    }

    async trocaSenha(request: Request, response: Response) {
        try {
            const data: ITrocaSenhaAcesso = request.body;

            const usuarioId = request.params.id;
            if (isNaN(+usuarioId) || usuarioId === null || usuarioId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const query = Usuario.query();
            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, query, request.usuario.republicaId);
            query.where('id', usuarioId);
            const usuario = (await query.select())[0] || null;

            const senhaAtualCriptografada = CriptografarSenhasSerive.encrypt(data.senhaAtual);
            if (usuario) {
                if (senhaAtualCriptografada !== usuario.senha) {
                    throw new Error('Senha atual não confere!');
                }

                ValidadoresSerive.validaSenha(data.novaSenha);

                if (data.novaSenha !== data.confirmarSenha) {
                    throw new Error('Nova senha não confere com a confirmação!');
                }

                const novaSenhaCriptografada = CriptografarSenhasSerive.encrypt(data.novaSenha);

                await Usuario.query().findById(+usuarioId)
                    .skipUndefined()
                    .patch({ id: +usuarioId, email: usuario.email, senha: novaSenhaCriptografada });

                return response.status(200).send(true);
            } else {
                throw new Error('Usuário para o identificador não foi encontrado');
            }
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao atualizar senha de acesso do usuário', message: error.message });
        }
    }

    async vincularAccountSocial(request: Request, response: Response) {
        try {
            const body: IVinculaAccountSocialData = request.body;

            const usuarioId = request.params.id;
            if (isNaN(+usuarioId) || usuarioId === null || usuarioId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const query = Usuario.query();
            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, query, request.usuario.republicaId);
            query.where('id', usuarioId);
            const usuario = (await query.select())[0] || null;

            if (usuario) {
                const mapSocialTypeColumn: any = {
                    'facebook': 'facebookId',
                    'google': 'googleId'
                };
                let objetoAlteracaoUsuario: any = { id: +usuarioId, email: usuario.email }
                if (!mapSocialTypeColumn[body.socialType]) {
                    throw new Error('Tipo de conta para vinculação inválida!')
                }

                objetoAlteracaoUsuario[mapSocialTypeColumn[body.socialType]] = body.id;
                await Usuario.query().findById(+usuarioId)
                    .skipUndefined()
                    .patch(objetoAlteracaoUsuario);

                return response.status(200).send(true);
            } else {
                throw new Error('Usuário para o identificador não foi encontrado');
            }
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao vincular conta social', message: error.message });
        }
    }

}