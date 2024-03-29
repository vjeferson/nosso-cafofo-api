import { Request, Response } from 'express';
import { Transaction } from 'objection';
import { IDesvinculaAccountSocialData } from '../../interfaces/desvincula-account-social-interface';
import { IRecuperaSenhaAcesso } from '../../interfaces/recupera-senha-interface';
import { ITrocaSenhaAcesso } from '../../interfaces/troca-senha-interface';
import { ITrocaSenhaAcessoRecuperacao } from '../../interfaces/troca-senha-recuperacao-interface';
import { INovoUsuario } from '../../interfaces/usuario-create-interface';
import { IFiltroUsuario } from '../../interfaces/usuario-filter-interface';
import { IUpdateUsuario } from '../../interfaces/usuario-update-interface';
import { IValidaRecuperacaoSenhaAcesso } from '../../interfaces/valida-recuperacao-senha-interface';
import { IVerificaVinculoAccountSocialData } from '../../interfaces/verifica-vinculo-account-social-interface';
import { IVinculaAccountSocialData } from '../../interfaces/vincula-account-social-interface';
import { LIMIT_DEFAULT, LIMIT_MAXIMO } from '../../utils/consts';
import CriptografarSenhasSerive from '../../utils/criptografar-senhas-service';
import { EnumTipoPerfil } from '../../utils/enums';
import errorHandlerObjection from '../../utils/handler-erros-objection';
import TenantsSerive from '../../utils/tenants-service';
import UtilsSerive from '../../utils/utils-service';
import ValidadoresSerive from '../../utils/validadores-service';
import { Perfil } from '../perfil/perfil-model';
import { Usuario } from './usuario-model';
const sgMail = require('@sendgrid/mail');
import mime from "mime";

export default class UsuarioController {

    async find(request: Request, response: Response) {
        try {
            const filters: IFiltroUsuario = request.query as any;
            const limit: number = filters.limit && !isNaN(+filters.limit) && filters.limit < LIMIT_MAXIMO ?
                +filters.limit : LIMIT_DEFAULT;
            const offset: number = filters.offset || 0;
            const query = Usuario.query();
            const queryCount = Usuario.query();

            if (filters.nome) {
                query.where('nome', 'like', `${filters.nome}%`);
                queryCount.where('nome', 'like', `${filters.nome}%`);
            }

            if (filters.ativo !== null && filters.ativo !== undefined &&
                (filters.ativo as any) !== 'todos' &&
                (filters.ativo === true || (filters as any).ativo === 'true' ||
                    filters.ativo === false || (filters.ativo as any) === 'false')
            ) {
                query.where('ativo', filters.ativo);
                queryCount.where('ativo', filters.ativo);
            }

            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, query, request.usuario.republicaId);
            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, queryCount, request.usuario.republicaId);
            const usuarios = await query.select().limit(limit).offset(offset).orderBy('id', 'ASC');
            const count: any[] = await queryCount.select().count();

            return response.status(200).send({ rows: usuarios, count: Array.isArray(count) && count.length > 0 ? +count[0].count : 0 });
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
            if (data.senha !== data.confirmarSenha) {
                throw new Error('Senha não confere com a confirmação!');
            }

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

            let objetoAtualizacao: any = {
                id: +usuarioId,
                nome: data.nome,
                email: data.email
            };

            if (data.perfilId !== null && data.perfilId !== undefined && !isNaN(+data.perfilId as any)) {
                objetoAtualizacao['perfilId'] = data.perfilId;
            }

            if (data.ativo !== null && data.ativo !== undefined && ((data.ativo === true || (data as any).ativo === 'true')
                || (data.ativo === false || (data as any).ativo === 'false'))) {
                objetoAtualizacao['ativo'] = data.ativo;
            }

            const usuarioAtualizado = await Usuario.query().findById(+usuarioId)
                .skipUndefined()
                .patch(objetoAtualizacao);

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

    async trocaSenhaRecuperacao(request: Request, response: Response) {
        try {
            const body: ITrocaSenhaAcessoRecuperacao = request.body;
            ValidadoresSerive.validaEmail(body.email);
            ValidadoresSerive.validaSenha(body.senha);

            if (body.senha !== body.confirmaSenha) {
                throw new Error('Nova senha não confere com a confirmação!');
            }

            const usuario = (await Usuario.query()
                .select('id', 'recoveryPasswordCode')
                .where('email', '=', body.email))[0] || null;

            if (usuario) {
                const usuarioId = Number(usuario.id);
                const codigoRecuperacaoValido: boolean =
                    CriptografarSenhasSerive.decrypt(body.codigo, usuario.recoveryPasswordCode || '');

                if (!codigoRecuperacaoValido) {
                    throw new Error('Código informado é inválido!');
                }

                const senhaCriptografada =
                    CriptografarSenhasSerive.encrypt(body.senha);

                await Usuario.query().findById(+usuarioId)
                    .skipUndefined()
                    .patch({
                        id: +usuarioId,
                        email: body.email,
                        senha: senhaCriptografada,
                        recoveryPasswordCode: null
                    });

                return response.status(200).send(true);
            } else {
                throw new Error('Não existe um cadastro de usuário para o e-mail informado!');
            }
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao redefinir senha de acesso', message: error.message });
        }
    }

    async recuperaSenha(request: Request, response: Response) {
        try {
            const body: IRecuperaSenhaAcesso = request.body;
            ValidadoresSerive.validaEmail(body.email);

            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const usuario = await Usuario.query()
                .select('id', 'nome')
                .where('email', '=', body.email);

            if (Array.isArray(usuario) && usuario.length > 0) {
                const usuarioId = Number(usuario[0].id);
                const codigoRecuperacaoSenha = UtilsSerive.gerarCodigoRecuperacaoSenha();
                const codigoRecuperacaoSenhaEncriptado =
                    CriptografarSenhasSerive.encrypt(codigoRecuperacaoSenha);

                const msg = {
                    to: body.email,
                    from: 'valdecijpr@gmail.com',
                    templateId: 'd-840e157031e14212bbeffffb0985ff1a',
                    dynamicTemplateData: {
                        subject: 'Nosso Cafofo - Recuperação de Senha',
                        name: usuario[0].nome,
                        codigoRecuperacaoSenha
                    }
                };

                await Usuario.query().findById(+usuarioId)
                    .skipUndefined()
                    .patch({
                        id: +usuarioId,
                        nome: usuario[0].nome,
                        email: body.email,
                        recoveryPasswordCode: codigoRecuperacaoSenhaEncriptado
                    });

                sgMail
                    .send(msg)
                    .then(() => {
                        return response.status(200).send(true);
                    })
                    .catch((error: any) => {
                        throw new Error('Email de recuperação não foi enviado!');
                    })
            } else {
                throw new Error('Não existe um cadastro de usuário para o e-mail informado!');
            }
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao recuperar senha', message: error.message });
        }
    }

    async verificaCodigoRecuperacaoSenha(request: Request, response: Response) {
        try {
            const body: IValidaRecuperacaoSenhaAcesso = request.body;
            ValidadoresSerive.validaEmail(body.email);

            const usuario = await Usuario.query()
                .select('recoveryPasswordCode')
                .where('email', '=', body.email);

            if (Array.isArray(usuario) && usuario.length > 0) {
                const codigoEncriptado = CriptografarSenhasSerive.encrypt(body.codigo);

                if (codigoEncriptado !== usuario[0].recoveryPasswordCode) {
                    throw new Error('Código informado é inválido!');
                }

                return response.status(200).send(true);
            } else {
                throw new Error('Não existe um cadastro de usuário para o e-mail informado!');
            }
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao validar código de recuperação de senha', message: error.message });
        }
    }

    async verificaExistenciaCadastroSocial(request: Request, response: Response) {
        try {
            const body: IVerificaVinculoAccountSocialData = request.body;
            const mapSocialTypeColumn: any = {
                'facebook': 'facebookId',
                'google': 'googleId'
            };
            if (!mapSocialTypeColumn[body.socialType]) {
                throw new Error('Tipo de conta para verificação inválida!')
            }

            const usuario = await Usuario.query()
                .select('id')
                .where(function () {
                    this.where(mapSocialTypeColumn[body.socialType], '=', body.id)
                })
            const result = {
                jaVinculado: Array.isArray(usuario) && usuario.length > 0
            };

            return response.status(201).send(result);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao verificar vínculo', message: error.message });
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

    async desvincularAccountSocial(request: Request, response: Response) {
        try {
            const body: IDesvinculaAccountSocialData = request.body;

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

                objetoAlteracaoUsuario[mapSocialTypeColumn[body.socialType]] = null;
                await Usuario.query().findById(+usuarioId)
                    .skipUndefined()
                    .patch(objetoAlteracaoUsuario);

                return response.status(200).send(true);
            } else {
                throw new Error('Usuário para o identificador não foi encontrado');
            }
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao desvincular conta social', message: error.message });
        }
    }

    async ativacaoOuDesativacao(request: Request, response: Response) {
        let transaction: Transaction;
        try {
            const ativo: boolean = request.path.includes('desativar') ? false : true;
            const identificadorRegistro = request.params.id;
            if (isNaN(+identificadorRegistro) || identificadorRegistro === null || identificadorRegistro === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            transaction = await Usuario.startTransaction();
            const registro = await Usuario.query(transaction).findById(identificadorRegistro);
            if (!registro) {
                throw new Error('Não existe um registro para o id (identificador) informado!');
            }

            await Usuario.query(transaction)
                .patch({ ativo, id: registro.id, email: registro.email })
                .where('id', '=', registro.id);

            await transaction.commit();
            return response.status(200).send(true);
        } catch (error: any) {
            if (transaction) {
                await transaction.rollback();
            }
            errorHandlerObjection(error, response, 'Erro ao ativar registro');
        }
    }

    async trocaImagemProfile(request: Request, response: Response) {
        try {
            if (request.file) {
                const name = `usuario-${request.usuario.id}.${mime.extension(request.file.mimetype)}`;
                const url = await UtilsSerive.sendFileS3(request.file.buffer, name, 'nosso-cafofo-public/images/profile');            
                
                
                const urlSplited = url.split('?')[0];
                let objetoAtualizacao: any = {
                    id: +request.usuario.id,
                    nome: request.usuario.nome,
                    email: request.usuario.email,
                    profileUrlImage: urlSplited
                };
    
                const usuarioAtualizado = await Usuario.query().findById(+objetoAtualizacao.id)
                    .skipUndefined()
                    .patch(objetoAtualizacao);
    
                if (!usuarioAtualizado) {
                    throw new Error('Não existe um usuário para o id (identificador) informado!');
                }
                
                return response.status(200).send(urlSplited);
            }

            throw new Error('Faltou informar o arquivo!');
        } catch (error: any) {
            errorHandlerObjection(error, response, 'Erro ao ativar registro');
        }
    }

}