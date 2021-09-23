import { Request, Response } from 'express';
import { INovaReuniao } from '../../interfaces/reuniao-create-interface';
import { IFiltroReuniao } from '../../interfaces/reuniao-filter-interface';
import { IUpdateReuniao } from '../../interfaces/reuniao-update-interface';
import TenantsSerive from '../../utils/tenants-service';
import { Reuniao } from './reuniao-model';

export default class ReuniaoController {

    constructor() { };

    async find(request: Request, response: Response) {
        try {
            const filters: IFiltroReuniao = request.query as any;

            const query = Reuniao.query();

            if (filters.descricao) {
                query.where('descricao', 'like', `${filters.descricao}%`);
            }

            if (filters.data) {
                query.where('data', filters.data);
            }

            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, query, request.usuario.republicaId);
            const reunioes = await query.select();
            return response.status(200).send(reunioes);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar reuniões', message: error.message });
        }
    }

    async findOne(request: Request, response: Response) {
        try {
            const reuniaoId = request.params.id;
            if (isNaN(+reuniaoId) || reuniaoId === null || reuniaoId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const query = Reuniao.query();
            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, query, request.usuario.republicaId);
            query.where('id', reuniaoId);
            const reuniao = await query.select();

            return response.status(200).send(Array.isArray(reuniao) && reuniao.length > 0 ? reuniao[0] : null);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar a reunião', message: error.message });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const dados: INovaReuniao = request.body;

            if (!dados.data) {
                throw new Error('Data da reunião é obrigatória!')
            }

            const novaReuniao = await Reuniao.query().insert({
                descricao: dados.descricao,
                anotacoes: dados.anotacoes,
                data: dados.data,
                republicaId: request.republica.id
            });

            return response.status(201).send(novaReuniao);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao criar reunião', message: error.message });
        }
    }

    async upsert(request: Request, response: Response) {
        try {
            const reuniaoId = request.params.id;
            if (isNaN(+reuniaoId) || reuniaoId === null || reuniaoId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const dados: IUpdateReuniao = request.body;

            const reuniao = await Reuniao.query().findById(reuniaoId);

            if (reuniao) {
                if (+request.usuario.republicaId !== +reuniao.republicaId) {
                    return response.status(401).send('Seu usuário não pode alterar informações da reunião informada!');
                }

                await Reuniao.query()
                    .findById(reuniaoId)
                    .patch({
                        descricao: dados.descricao,
                        anotacoes: dados.anotacoes,
                        data: dados.data
                    });
            } else {
                throw new Error('Não existe uma reunião para o id (identificador) informado!');
            }

            return response.status(200).send(true);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao atualizar reunião', message: error.message });
        }
    }

    async delete(request: Request, response: Response) {
        try {
            const reuniaoId = request.params.id;
            if (isNaN(+reuniaoId) || reuniaoId === null || reuniaoId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const reuniao = await Reuniao.query().findById(reuniaoId);

            if (reuniao) {
                if (+request.usuario.republicaId !== +reuniao.republicaId) {
                    return response.status(401).send('Seu usuário não pode deletar a reunião informado!');
                }

                await Reuniao.query().deleteById(reuniao.id as number);
            } else {
                return response.status(204).send('Não existe uma reunião para o id (identificador) informado!');
            }

            return response.status(200).send(true);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao deletar reunião', message: error.message });
        }
    }

}