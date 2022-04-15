export interface IUpdateConta {
    descricao: string;
    valor: number;
    situacao: number;
    dataConta: Date | string;
    mesAnoDivisaoConta: number;
    divisaoPorIgualEntreMoradores: boolean;
    moradorId?: number;
}