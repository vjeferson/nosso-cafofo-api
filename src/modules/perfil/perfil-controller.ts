import { Request, Response } from 'express';
import { INovoPerfil } from '../../interfaces/perfil-create-interface';
import { IFiltroPerfil } from '../../interfaces/perfil-filter-interface';
import { IUpdatePerfil } from '../../interfaces/perfil-update-interface';
import { EnumTipoPerfil } from '../../utils/enums';
import { Perfil } from './perfil-model';

export default class PerfilController {

    async find(request: Request, response: Response) {
        try {
            const filters: IFiltroPerfil = request.query;

            const query = Perfil.query();
            if (request.perfil.tipoPerfil !== EnumTipoPerfil.AdministradorNossoCafofo) {
                query.where('tipoPerfil', '!=', EnumTipoPerfil.AdministradorNossoCafofo)
            }

            if (filters.descricao) {
                query.where('descricao', 'like', `${filters.descricao}%`);
            }

            if (!isNaN(+(filters.tipoPerfil as any)) && filters.tipoPerfil !== null && filters.tipoPerfil !== undefined
                && (filters.tipoPerfil as any) !== '') {
                query.where('tipoPerfil', filters.tipoPerfil);
            }

            const perfis = await query.select();

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

            const query = Perfil.query();
            if (request.perfil.tipoPerfil !== EnumTipoPerfil.AdministradorNossoCafofo) {
                query.where('tipoPerfil', '!=', EnumTipoPerfil.AdministradorNossoCafofo)
            }
            query.where('id', perfilId);
            const perfis = await query.select();

            return response.status(200).send(Array.isArray(perfis) && perfis.length > 0 ? perfis[0] : null);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar perfil', message: error.message });
        }
    }

    async upsert(request: Request, response: Response) {
        try {
            const perfilId = +request.params.id;
            if (isNaN(+perfilId) || perfilId === null || perfilId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const data: IUpdatePerfil = request.body;
            const perfilAtualizado = await Perfil.query()
                .findById(perfilId)
                .patch({ descricao: data.descricao });

            if (!perfilAtualizado) {
                throw new Error('Não existe um perfil para o id (identificador) informado!');
            }

            return response.status(201).send(true);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao atualizar perfil', message: error.message });
        }
    }

}