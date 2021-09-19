import { Model } from 'objection';
import { IMorador } from '../../interfaces/morador-interface';

export class Morador extends Model implements IMorador {
    id?: number;
    nome: string;
    anoEntrada: number;
    ativo: boolean;
    republicaId: number;

    static get tableName() {
        return 'morador';
    }

    static jsonSchema = {
        type: 'object',
        required: ['nome', 'anoEntrada', 'republicaId'],

        properties: {
            id: { type: 'integer' },
            nome: { type: 'string', maxLength: 50 },
            anoEntrada: { type: 'integer' },
            ativo: { type: 'boolean', default: true },
            republicaId: { type: 'integer' }
        }
    }

}