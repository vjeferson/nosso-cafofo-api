export interface IEntradaSaida {
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
}