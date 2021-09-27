import { Model, raw } from 'objection';
import { IParticipantesFesta } from '../../interfaces/participantes-festa-interface';
import { EnumSituacaoPagamentoParticipanteFesta } from '../../utils/enums';
import { Festa } from '../festa/festa-model';
import { Republica } from '../republica/republica.model';

export class ParticipantesFesta extends Model implements IParticipantesFesta {
    id?: number;
    nome: string;
    valor: number;
    lote: number;
    situacao: number;
    republicaId: number;
    festaId: number;

    static get tableName() {
        return 'participantes_festa';
    }

    static jsonSchema = {
        type: 'object',
        required: [
            'nome',
            'valor',
            'lote',
            'situacao',
            'republicaId',
            'festaId'
        ],

        properties: {
            id: { type: 'integer' },
            nome: { type: 'string' },
            valor: { type: 'number' },
            lote: { type: 'integer' },
            situacao: { type: 'number', default: EnumSituacaoPagamentoParticipanteFesta.EmAberto },
            republicaId: { type: 'integer' },
            festaId: { type: 'integer' }
        }
    }

    static relationMappings = {
        republica: {
            relation: Model.HasOneRelation,
            modelClass: Republica,
            join: {
                from: 'participantes_festa.republicaId',
                to: 'republica.id'
            }
        },
        festa: {
            relation: Model.HasOneRelation,
            modelClass: Festa,
            join: {
                from: 'participantes_festa.festaId',
                to: 'festa.id'
            }
        }
    };

    async $beforeDelete() {
        const participantes = await ParticipantesFesta.query().select()
            .where('festaId', '=', this.festaId)
            .where('republicaId', '=', this.republicaId)
            .where('situacao', '=', EnumSituacaoPagamentoParticipanteFesta.Pago);

        if (Array.isArray(participantes) && participantes.length > 0) {
            throw new Error('Existe(m) Participante(s) com status de Pago, não é possível excluir!');
        }
    }

}