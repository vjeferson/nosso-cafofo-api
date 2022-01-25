import { Request, Response } from 'express';
import { IFiltroRepublica } from '../../interfaces/republica-filter-interface';
import { IUpdateRepublica } from '../../interfaces/republica-update-interface';
import { EnumTipoPerfil } from '../../utils/enums';
import { Cidade } from '../cidade/cidade-model';
import { Estado } from '../estado/estado.model';
import { Republica } from './republica.model';

export default class RepublicaController {

    constructor() { };

    async find(request: Request, response: Response) {
        try {
            const filters: IFiltroRepublica = request.query as any;

            const query = Republica.query();

            if (filters.nome) {
                query.where('nome', 'like', `${filters.nome}%`);
            }

            if (!isNaN(+(filters.anoCriacao as any)) && filters.anoCriacao !== null && filters.anoCriacao !== undefined
                && (filters.anoCriacao as any) !== '') {
                query.where('anoCriacao', filters.anoCriacao);
            }

            if (!isNaN(+(filters.dataPagamentoContas as any)) && filters.dataPagamentoContas !== null && filters.dataPagamentoContas !== undefined
                && (filters.dataPagamentoContas as any) !== '') {
                query.where('dataPagamentoContas', filters.dataPagamentoContas);
            }

            const republicas = await query.select();

            return response.status(200).send(republicas);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar repúblicas', message: error.message });
        }
    }

    async findOne(request: Request, response: Response) {
        try {
            const republicaId = request.params.id;
            if (isNaN(+republicaId) || republicaId === null || republicaId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            if (+request.usuario.republicaId !== +republicaId && request.perfil.tipoPerfil !== EnumTipoPerfil.AdministradorNossoCafofo) {
                return response.status(401).send('Seu usuário não possui permissão para visualizar informações da república informada!');
            }

            const query = Republica.query();
            const republicas = await query.select().where('id', republicaId);
            return response.status(200).send(Array.isArray(republicas) && republicas.length > 0 ? republicas[0] : null);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar o república', message: error.message });
        }
    }

    async informacoesCadastro(request: Request, response: Response) {
        try {
            const republicaId = request.params.id;
            if (isNaN(+republicaId) || republicaId === null || republicaId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            if (+request.usuario.republicaId !== +republicaId && request.perfil.tipoPerfil !== EnumTipoPerfil.AdministradorNossoCafofo) {
                return response.status(401).send('Seu usuário não possui permissão para visualizar informações da república informada!');
            }

            const republica = await Republica.query().findById(republicaId);
            const estado = await republica.$relatedQuery<Estado>('estado');
            const cidade = await republica.$relatedQuery<Cidade>('cidade');
            (republica as any).estado = estado;
            (republica as any).cidade = cidade;

            return response.status(200).send(republica ? republica : null);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar o república', message: error.message });
        }
    }

    async upsert(request: Request, response: Response) {
        try {
            const republicaId = request.params.id;
            if (isNaN(+republicaId) || republicaId === null || republicaId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const dados: IUpdateRepublica = request.body;

            if (+request.usuario.republicaId !== +republicaId) {
                return response.status(401).send('Seu usuário não possui permissão para alterar informações da república informada!');
            }

            const republicaAtualizada = await Republica.query()
                .findById(republicaId)
                .patch({
                    nome: dados.nome,
                    anoCriacao: dados.anoCriacao,
                    dataPagamentoContas: dados.dataPagamentoContas,
                    logradouro: dados.logradouro,
                    numero: dados.numero,
                    complemento: dados.complemento,
                    estadoId: dados.estadoId,
                    cidadeId: dados.cidadeId
                });

            if (!republicaAtualizada) {
                throw new Error('Não existe uma república para o id (identificador) informado!');
            }

            return response.status(201).send(true);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao atualizar república', message: error.message });
        }
    }

}