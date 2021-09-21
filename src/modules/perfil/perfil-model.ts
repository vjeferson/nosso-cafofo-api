import { Model } from 'objection';
import { IPerfil } from '../../interfaces/perfil-interface';

export class Perfil extends Model implements IPerfil {
    id?: number;
    descricao: string;
    tipoPerfil: number;

    static get tableName() {
        return 'perfil';
    }

    static jsonSchema = {
        type: 'object',
        required: ['descricao', 'tipoPerfil'],

        properties: {
            id: { type: 'integer' },
            descricao: { type: 'string', minLength: 5, maxLength: 50 },
            tipoPerfil: { type: 'integer' }
        }
    }

}