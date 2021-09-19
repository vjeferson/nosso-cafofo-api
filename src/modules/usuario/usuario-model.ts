import { Model } from 'objection';
import { IUsuario } from '../../interfaces/usuario-interface';
import { Perfil } from '../perfil/perfil-model';

export class Usuario extends Model implements IUsuario {
    id?: number;
    nome: string;
    email: string;
    senha?: string;
    createTime?: string;
    updateTime?: string;
    perfilId: number;
    republicaId?: number;
    moradorId?: number;

    perfil?: Perfil;

    static get tableName() {
        return 'usuario';
    }

    static jsonSchema = {
        type: 'object',
        required: ['nome', 'email', 'perfilId'],

        properties: {
            id: { type: 'integer' },
            nome: { type: 'string', maxLength: 50 },
            email: { type: 'string', maxLength: 70 },
            senha: { type: 'string', maxLength: 70 },
            createTime: { type: 'string', format: 'date-time' },
            updateTime: { type: 'string', format: 'date-time' },
            perfilId: { type: 'integer' },
            republicaId: { type: ['integer', 'null'] },
            moradorId: { type: ['integer', 'null'] }
        }
    }

    static relationMappings = {
        perfil: {
            relation: Model.HasOneRelation,
            modelClass: Perfil,
            join: {
                from: 'usuario.perfilId',
                to: 'perfil.id'
            }
        }
    };

    $beforeInsert() {
        this.createTime = new Date().toISOString();
    }

    $beforeUpdate() {
        this.updateTime = new Date().toISOString();
    }
}