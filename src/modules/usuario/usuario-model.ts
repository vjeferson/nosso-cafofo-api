import { Model } from 'objection';
import { IUsuario } from '../../interfaces/usuario-interface';

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

    $beforeInsert() {
        this.createTime = new Date().toISOString();
    }

    $beforeUpdate() {
        this.updateTime = new Date().toISOString();
    }
}