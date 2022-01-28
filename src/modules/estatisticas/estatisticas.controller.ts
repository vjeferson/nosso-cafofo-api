import { Request, Response } from 'express';
import TenantsSerive from '../../utils/tenants-service';

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
            return response.status(400).json({ error: 'Erro ao consultar estatísticas de número de assinantes', message: error.message });
        }
    }

}