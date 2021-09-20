import { Request, Response } from 'express';
import { IMorador } from '../../interfaces/morador-interface';
import ValidadoresSerive from '../../utils/validadores-service';
import { Morador } from './morador-model';

export default class MoradorController {

    constructor() { };

    async find(request: Request, response: Response) {
        try {
            const filters = request.query;

            const moradores = await Morador.query().select();
            return response.status(200).send(moradores);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar moradores', message: error.message });
        }
    }

    async findOne(request: Request, response: Response) {
        try {
            const moradorId = request.params.id;
            if (isNaN(+moradorId) || moradorId === null || moradorId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const morador = await Morador.query().findById(moradorId);
            return response.status(200).send(morador);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar o morador', message: error.message });
        }
    }

    async create(request: Request, response: Response) {
        try {
            const dados: IMorador = request.body;
            const novoMorador = await Morador.query().insert({
                nome: dados.nome,
                anoEntrada: dados.anoEntrada,
                ativo: true,
                republicaId: request.republica.id
            });

            return response.status(201).send(novoMorador);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao criar morador', message: error.message });
        }
    }

    async upsert(request: Request, response: Response) {
        try {
            const moradorId = request.params.id;
            if (isNaN(+moradorId) || moradorId === null || moradorId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const dados: IMorador = request.body;

            const usuarioAtualizado = await Morador.query()
                .findById(moradorId)
                .patch({
                    nome: dados.nome,
                    anoEntrada: dados.anoEntrada,
                    ativo: dados.ativo
                });

            if (!usuarioAtualizado) {
                throw new Error('Não existe um morador para o id (identificador) informado!');
            }

            return response.status(201).send(true);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao atualizar morador', message: error.message });
        }
    }

}