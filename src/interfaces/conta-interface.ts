export interface IConta {
    id?: number;
    descricao: string;
    valor: number;
    situacao: number;
    dataConta: Date | string;
    mesAnoDivisaoConta: string;
    divisaoPorIgualEntreMoradores?: boolean;
    republicaId: number;
    moradorId?: number;
}