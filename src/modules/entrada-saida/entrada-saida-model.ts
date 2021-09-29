import { Model } from 'objection';
import { IEntradaSaida } from '../../interfaces/entrada-saida-interface';
import { IMorador } from '../../interfaces/morador-interface';
import { Morador } from '../morador/morador-model';
import { Republica } from '../republica/republica.model';

export class EntradaSaida extends Model implements IEntradaSaida {
    id?: number;
    tipoMovimento: number;
    valorMovimentado: number;
    dataMovimento: Date | String;
    dataPagamento: Date | String;
    considerarNaSomaMensalDoMorador: boolean;
    mesAnoCobranca: string;
    entradaOuSaidaPagamentoMorador?: number;
    republicaId: number;
    moradorId?: number;

    static get tableName() {
        return 'entrada_e_saida';
    }

    static jsonSchema = {
        type: 'object',
        required: [
            'tipoMovimento',
            'valorMovimentado',
            'dataMovimento',
            'mesAnoCobranca',
            'republicaId'
        ],

        properties: {
            id: { type: 'integer' },
            tipoMovimento: { type: 'integer' },
            valorMovimentado: { type: 'number' },
            dataMovimento: { type: 'string', format: 'date' },
            dataPagamento: { type: ['string', 'null'], format: 'date' },
            considerarNaSomaMensalDoMorador: { type: 'boolean', default: false },
            mesAnoCobranca: { type: ['string', 'null'], minLength: 6, maxLength: 6 },
            entradaOuSaidaPagamentoMorador: { type: ['integer', 'null'] },
            moradorId: { type: ['integer', 'null'] },
            republicaId: { type: 'integer' }
        }
    }

    static relationMappings = {
        republica: {
            relation: Model.HasOneRelation,
            modelClass: Republica,
            join: {
                from: 'entrada_e_saida.republicaId',
                to: 'republica.id'
            }
        },
        morador: {
            relation: Model.HasOneRelation,
            modelClass: Morador,
            join: {
                from: 'entrada_e_saida.moradorId',
                to: 'morador.id'
            }
        },
        entradaSaidaPagamentoMorador: {
            relation: Model.HasOneRelation,
            modelClass: EntradaSaida,
            join: {
                from: 'entrada_e_saida.entradaOuSaidaPagamentoMorador',
                to: 'entrada_e_saida.id'
            }
        }
    };

}