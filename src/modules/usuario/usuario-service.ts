import { Response } from 'express';
import { IUsuario } from './usuario-model';
import database from '../../database/connection';
import { CriptografarSenhasSerive } from '../../utils/criptografar-senhas-service';
import { ValidadoresSerive } from '../../utils/validadores-service';

export default class UsuarioService {
    constructor() { };

    async find(filters: any) {
        try {
            // const tipoPerfil = !isNaN(+(filters.tipoPerfil as any)) && filters.tipoPerfil !== null && filters.tipoPerfil !== undefined ?
            //     +(filters.tipoPerfil as any) : null;
            // const descricao: string = filters.descricao as string;

            const usuarios = await database('usuario')
                .select('usuario.*');
            return usuarios;
        } catch (error) {
            throw error;
        }
    }

    async findOne(usuarioId: number) {
        try {
            const usuario = await database('usuario')
                .select('usuario.*')
                .where('usuario.id', usuarioId);
            return usuario;
        } catch (error) {
            throw error;
        }
    }

    async create(data: IUsuario, response: Response) {
        const {
            nome,
            email,
            senha,
            perfil_id,
            morador_id,
            republica_id
        } = data;

        try {
            ValidadoresSerive.validaSenha(senha as string);
            const senhaEncriptada = CriptografarSenhasSerive.encrypt(senha as string);
            await database('usuario').insert({
                nome,
                email,
                senha: senhaEncriptada,
                perfil_id,
                morador_id,
                republica_id
            });
        } catch (error) {
            throw error;
        }
    }

    private validaSenha(senha: string) {

    }
}