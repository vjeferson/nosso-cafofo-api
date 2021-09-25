import { Model } from 'objection';
import { IAssinatura } from '../../interfaces/assinatura-interface';
import { EnumTipoPlano } from '../../utils/enums';
import { Plano } from '../plano/plano-model';
import { Republica } from '../republica/republica.model';

export class Assinatura extends Model implements IAssinatura {
    id?: number;
    validadePlano: Date | string;
    dataAssinatura: Date | string;
    ativa: boolean;
    planoId: number;
    republicaId: number;

    static get tableName() {
        return 'assinatura';
    }

    static jsonSchema = {
        type: 'object',
        required: ['ativa', 'republicaId', 'planoId'],

        properties: {
            id: { type: 'integer' },
            validadePlano: { type: ['string', 'null'], format: 'date' },
            dataAssinatura: { type: ['string', 'null'], format: 'date' },
            ativa: { type: 'boolean', default: 'false' },
            republicaId: { type: 'integer' },
            planoId: { type: 'integer' }
        }
    }

    static relationMappings = {
        republica: {
            relation: Model.HasOneRelation,
            modelClass: Republica,
            join: {
                from: 'assinatura.republicaId',
                to: 'republica.id'
            }
        },
        plano: {
            relation: Model.HasOneRelation,
            modelClass: Plano,
            join: {
                from: 'assinatura.planoId',
                to: 'plano.id'
            }
        }
    };

    async $beforeInsert() {
        const plano = await Plano.query().findById(this.planoId);
        if (plano) {
            if (+plano.tipoPlano !== EnumTipoPlano.Free) {
                this.validadePlano = new Date().toISOString();
            }
        } else {
            throw new Error('Não existe um Plano para o identificador informado!');
        }

        this.dataAssinatura = new Date().toISOString();
    }

}