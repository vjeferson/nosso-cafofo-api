import { Model } from 'objection';
import { IReuniao } from '../../interfaces/reuniao-interface';
import { Republica } from '../republica/republica.model';

export class Reuniao extends Model implements IReuniao {
    id?: number;
    descricao: string;
    anotacoes: string;
    data: Date | string;
    republicaId: number;

    static get tableName() {
        return 'reuniao';
    }

    static jsonSchema = {
        type: 'object',
        required: ['descricao', 'data', 'republicaId'],

        properties: {
            id: { type: 'integer' },
            descricao: { type: 'string', maxLength: 50 },
            anotacoes: { type: ['string', 'null'] },
            data: { type: 'string', format: 'date-time' },
            republicaId: { type: 'integer' }
        }
    }

    static relationMappings = {
        republica: {
            relation: Model.HasOneRelation,
            modelClass: Republica,
            join: {
                from: 'reuniao.republicaId',
                to: 'republica.id'
            }
        }
    };

    $beforeInsert() {
        this.data = new Date(this.data).toISOString();
    }

    $beforeUpdate() {
        this.data = new Date(this.data).toISOString();
    }

}