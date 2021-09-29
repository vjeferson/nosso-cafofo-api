import { Model } from 'objection';
import { IConta } from '../../interfaces/conta-interface';
import { Republica } from '../republica/republica.model';

export class Conta extends Model implements IConta {
    id?: number;
    descricao: string;
    valor: number;
    situacao: number;
    mesAnoConta: number;
    divisaoPorIgualEntreMoradores?: boolean;
    republicaId: number;

    static get tableName() {
        return 'conta';
    }

    static jsonSchema = {
        type: 'object',
        required: ['descricao', 'valor', 'situacao', 'mesAnoConta', 'republicaId'],

        properties: {
            id: { type: 'integer' },
            descricao: { type: 'string', minLength: 1, maxLength: 70 },
            valor: { type: 'number' },
            situacao: { type: 'integer' },
            mesAnoConta: { type: 'string', minLength: 6, maxLength: 6 },
            divisaoPorIgualEntreMoradores: { type: 'boolean', default: true },
            republicaId: { type: 'integer' }
        }
    }

    static relationMappings = {
        republica: {
            relation: Model.HasOneRelation,
            modelClass: Republica,
            join: {
                from: 'conta.republicaId',
                to: 'republica.id'
            }
        }
    };

}