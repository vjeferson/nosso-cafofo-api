export interface INovaConta {
    descricao: string;
    valor: number;
    mesAnoDivisaoConta: number;
    dataConta: Date | string;
    divisaoPorIgualEntreMoradores?: boolean;
    moradorId?: number;
}