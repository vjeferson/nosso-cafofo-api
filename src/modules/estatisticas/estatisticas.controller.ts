import { Request, Response } from 'express';
import moment from 'moment';

export default class EstatisticasController {

    constructor() { };

    async countAssinantes(request: Request, response: Response) {
        try {
            return response.status(200).send({ assinantes: 3 });
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar estatísticas de número de assinantes', message: error.message });
        }
    }

    async countPagamentos(request: Request, response: Response) {
        try {
            return response.status(200).send({ pagamentos: 3 });
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar estatísticas de número de pagamentos', message: error.message });
        }
    }

    async ultimaReuniao(request: Request, response: Response) {
        try {
            moment.locale('pt-br');
            const data = moment().format('lll');
            return response.status(200).send({ data });
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar estatísticas de número de usuários', message: error.message });
        }
    }

}