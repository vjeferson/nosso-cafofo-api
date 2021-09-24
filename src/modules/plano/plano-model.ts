import { Model } from 'objection';
import { IPlano } from '../../interfaces/plano-interface';

export class Plano extends Model implements IPlano {
    id?: number;
    tipoPlano: number;
    recorrencia: string;
    descricao: string;
    numeroMaximoParcelasPagamento: number;
    valorPlano: number;
    ativo: boolean;

    static get tableName() {
        return 'plano';
    }

    static jsonSchema = {
        type: 'object',
        required: [
            'tipoPlano',
            'recorrencia',
            'descricao',
            'numeroMaximoParcelasPagamento',
            'valorPlano'
        ],

        properties: {
            id: { type: 'integer' },
            tipoPlano: { type: 'integer' },
            recorrencia: { type: 'string', maxLength: 40 },
            descricao: { type: 'string', maxLength: 70 },
            numeroMaximoParcelasPagamento: { type: 'integer' },
            valorPlano: { type: 'number' },
            ativo: { type: ['boolean', 'null'] }
        }
    }

}