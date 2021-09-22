import { Model } from 'objection';
import { IEstado } from '../../interfaces/estado-interface';

export class Estado extends Model implements IEstado {
    id: string;
    estado: string;

    static get tableName() {
        return 'estado';
    }

    static jsonSchema = {
        type: 'object',
        required: ['id', 'estado'],

        properties: {
            id: { type: 'string', minLenght: 2, maxLength: 2 },
            estado: { type: 'string', minLength: 3, maxLength: 60 }
        }
    }

}