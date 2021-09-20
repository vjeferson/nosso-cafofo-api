import { Request, Response } from 'express';
import database from '../../database/connection';
import { IRepublica } from '../../interfaces/republica-interface';
import { Republica } from './republica.model';

export default class RepublicaController {

    constructor() { };

    async find(request: Request, response: Response) {
        try {
            const filters = request.query;
            const republicas = await Republica.query().select();
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

            const republica = await Republica.query().findById(republicaId);
            return response.status(200).send(republica);
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

            const dados: IRepublica = request.body;

            const republicaAtualizada = await Republica.query()
                .findById(republicaId)
                .patch({
                    nome: dados.nome,
                    anoCriacao: dados.anoCriacao,
                    dataPagamentoContas: dados.dataPagamentoContas
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