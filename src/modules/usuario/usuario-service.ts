import { Response } from 'express';
import database from '../../database/connection';
import CriptografarSenhasSerive from '../../utils/criptografar-senhas-service';
import ValidadoresSerive from '../../utils/validadores-service';
import moment from 'moment';
import { IUsuario } from '../../interfaces/usuario-interface';

export default class UsuarioService {
    constructor() { };

    async find(filters: any): Promise<IUsuario[]> {
        try {
            // const tipoPerfil = !isNaN(+(filters.tipoPerfil as any)) && filters.tipoPerfil !== null && filters.tipoPerfil !== undefined ?
            //     +(filters.tipoPerfil as any) : null;
            // const descricao: string = filters.descricao as string;

            const usuarios = await database('usuario')
                .select(
                    'usuario.id as id',
                    'usuario.nome as nome',
                    'usuario.email as email',
                    'usuario.senha as senha',
                    'usuario.republica_id as republicaId',
                    'usuario.morador_id as moradorId',
                    'usuario.create_time as createTime',
                    'usuario.update_time as updateTime',
                    'usuario.perfil_id as perfilId'
                );
            return usuarios;
        } catch (error) {
            throw error;
        }
    }

    async findOne(usuarioId: number): Promise<IUsuario | null> {
        try {
            const usuario = await database('usuario')
                .select('usuario.*')
                .where('usuario.id', usuarioId)
                .limit(1)
                .offset(0);

            if (Array.isArray(usuario) && usuario.length > 0) {
                return {
                    id: usuario[0].id,
                    nome: usuario[0].nome,
                    email: usuario[0].email,
                    senha: usuario[0].senha,
                    createTime: usuario[0].create_time,
                    updateTime: usuario[0].update_time,
                    perfilId: usuario[0].perfil_id,
                    republicaId: usuario[0].republica_id,
                    moradorId: usuario[0].morador_id
                } as IUsuario;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    async create(data: IUsuario): Promise<IUsuario> {
        try {
            ValidadoresSerive.validaEmail(data.email);
            ValidadoresSerive.validaSenha(data.senha as string);
            const senhaEncriptada = CriptografarSenhasSerive.encrypt(data.senha as string);
            const novoUsuario = await database('usuario').insert({
                nome: data.nome,
                email: data.email,
                senha: senhaEncriptada,
                perfil_id: data.perfilId,
                morador_id: data.moradorId || null,
                republica_id: data.republicaId || null
            }).returning('*');

            return {
                id: novoUsuario[0].id,
                nome: novoUsuario[0].nome,
                email: novoUsuario[0].email,
                senha: novoUsuario[0].senha,
                createTime: novoUsuario[0].create_time,
                updateTime: novoUsuario[0].update_time,
                perfilId: novoUsuario[0].perfil_id,
                republicaId: novoUsuario[0].republica_id,
                moradorId: novoUsuario[0].morador_id
            } as IUsuario;
        } catch (error) {
            throw error;
        }
    }

    async upsert(usuarioId: number, data: IUsuario): Promise<boolean> {
        try {
            const usuario = await database('usuario')
                .select('usuario.*')
                .where('usuario.id', usuarioId)
                .limit(1)
                .offset(0);

            if (Array.isArray(usuario) && usuario.length > 0) {
                await database('usuario')
                    .where({ id: usuario[0].id })
                    .update({
                        nome: data.nome,
                        update_time: moment().toDate()
                    });
            } else {
                throw new Error('Não existe um usuário para o id (identificador) informado!');
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

}