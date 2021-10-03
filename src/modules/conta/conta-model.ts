import { Model } from 'objection';
import { IConta } from '../../interfaces/conta-interface';
import { EnumSituacaoConta } from '../../utils/enums';
import { Republica } from '../republica/republica.model';

export class Conta extends Model implements IConta {
    id?: number;
    descricao: string;
    valor: number;
    situacao: number;
    mesAnoConta: string;
    divisaoPorIgualEntreMoradores?: boolean;
    republicaId: number;

    static get tableName() {
        return 'conta';
    }

    static jsonSchema = {
        type: 'object',
        required: ['descricao', 'valor', 'situacao', 'mesAnoConta', 'republicaId'],

        properties: {
            id: { type: 'integer' },
            descricao: { type: 'string', minLength: 1, maxLength: 70 },
            valor: { type: 'number' },
            situacao: { type: 'integer' },
            mesAnoConta: { type: 'string', minLength: 6, maxLength: 6 },
            divisaoPorIgualEntreMoradores: { type: 'boolean', default: true },
            republicaId: { type: 'integer' }
        }
    }

    static relationMappings = {
        republica: {
            relation: Model.HasOneRelation,
            modelClass: Republica,
            join: {
                from: 'conta.republicaId',
                to: 'republica.id'
            }
        }
    };

    private validaMesAndAnoConta() {
        const mes = this.mesAnoConta.substring(0, 2);
        const ano = this.mesAnoConta.substring(2, 6);

        if (isNaN(+mes) || +mes < 0 || +mes > 12) {
            throw new Error('Valor do mês inválido! Informe de 01(Janeiro) a 12(Dezembro) para representar os meses!');
        } else if (isNaN(+ano)) {
            throw new Error('Valor do ano inválido! Informe os 4 numeros corretamente(Ex: 2021) após o mês.');
        }
    }

    $beforeInsert() {
        this.validaMesAndAnoConta();
    }

    // $beforeUpdate() {
    //     this.validaMesAndAnoConta();
    // }

    $beforeDelete() {
        if (this.situacao !== EnumSituacaoConta.EmAberto) {
            throw new Error('Não é possível excluir a conta, pois já não se encontra mais em aberto!');
        }
    }

}