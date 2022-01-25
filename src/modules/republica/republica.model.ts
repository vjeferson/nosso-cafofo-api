import { Model } from 'objection';
import { IRepublica } from '../../interfaces/republica-interface';
import { Cidade } from '../cidade/cidade-model'
import { Estado } from '../estado/estado.model';

export class Republica extends Model implements IRepublica {
    id?: number;
    nome: string;
    anoCriacao: number;
    dataPagamentoContas: number;
    numero: string;
    logradouro: string;
    complemento?: string;
    estadoId: string;
    cidadeId: number;

    static get tableName() {
        return 'republica';
    }

    static jsonSchema = {
        type: 'object',
        required: ['nome', 'anoCriacao', 'dataPagamentoContas', 'numero', 'logradouro', 'estadoId', 'cidadeId'],

        properties: {
            id: { type: 'integer' },
            nome: { type: 'string', maxLength: 50 },
            anoCriacao: { type: 'integer' },
            dataPagamentoContas: { type: 'integer' },
            numero: { type: 'string', maxLength: 10 },
            logradouro: { type: 'string', maxLength: 70 },
            complemento: { type: ['string', 'null'], maxLength: 45 },
            estadoId: { type: 'string', minLength: 2, maxLength: 2 },
            cidadeId: { type: 'integer' }
        }
    }

    static relationMappings = {
        estado: {
            relation: Model.HasOneRelation,
            modelClass: Estado,
            join: {
                from: 'republica.estadoId',
                to: 'estado.id'
            }
        },
        cidade: {
            relation: Model.HasOneRelation,
            modelClass: Cidade,
            join: {
                from: 'republica.cidadeId',
                to: 'cidade.id'
            }
        }
    };

}