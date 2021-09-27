import { Model, QueryContext, raw } from 'objection';
import { IFesta } from '../../interfaces/festa-interface';
import { EnumSituacaoFesta, EnumSituacaoPagamentoParticipanteFesta } from '../../utils/enums';
import { ParticipantesFesta } from '../festa-participantes/participantes-festa-model';
import { Republica } from '../republica/republica.model';

export class Festa extends Model implements IFesta {
    id?: number;
    descricao: string;
    data: Date | string;
    situacao: number;
    valorTotal: number;
    republicaId: number;

    static get tableName() {
        return 'festa';
    }

    static jsonSchema = {
        type: 'object',
        required: ['descricao', 'data', 'republicaId'],

        properties: {
            id: { type: 'integer' },
            descricao: { type: 'string' },
            data: { type: 'string', format: 'date-time' },
            situacao: { type: 'integer', default: EnumSituacaoFesta.EmAberto },
            valorTotal: { type: 'number', default: 0 },
            republicaId: { type: 'integer' }
        }
    }

    static relationMappings = {
        republica: {
            relation: Model.HasOneRelation,
            modelClass: Republica,
            join: {
                from: 'festa.republicaId',
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

    async $beforeDelete(queryContext: QueryContext) {
        if (this.situacao !== EnumSituacaoFesta.EmAberto) {
            throw new Error('Festa não pode ser excluída, pois não se encontra mais em aberto!');
        } else {
            const participantes = await ParticipantesFesta.query(queryContext.transaction).select()
                .where('festaId', '=', this.id)
                .where('republicaId', '=', this.republicaId)
                .where('situacao', '=', EnumSituacaoPagamentoParticipanteFesta.Pago);

            if (Array.isArray(participantes) && participantes.length > 0) {
                throw new Error('Existem Participantes com status de Pago, não é possível excluir registro da Festa!');
            } else {
                await ParticipantesFesta.query(queryContext.transacting).delete().where('festaId', '=', this.id).where('republicaId', '=', this.republicaId);
            }
        }
    }

}