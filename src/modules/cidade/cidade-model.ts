import { Model } from 'objection';
import { ICidade } from '../../interfaces/cidade-interface';
import { Estado } from '../estado/estado.model';

export class Cidade extends Model implements ICidade {
    id?: number;
    cidade: string;
    estadoId: string;

    static get tableName() {
        return 'cidade';
    }

    static jsonSchema = {
        type: 'object',
        required: ['id', 'cidade', 'estadoId'],

        properties: {
            id: { type: 'integer' },
            cidade: { type: 'string', minLength: 3, maxLength: 60 },
            estadoId: { type: 'string', minLength: 3, maxLength: 60 }
        }
    }

    static relationMappings = {
        estado: {
            relation: Model.HasOneRelation,
            modelClass: Estado,
            join: {
                from: 'cidade.estadoId',
                to: 'estado.id'
            }
        }
    };

}