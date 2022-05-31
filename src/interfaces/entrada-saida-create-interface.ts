export interface INovaEntradaSaida {
    descricao: string;
    tipoMovimento: number;
    valorMovimentado: number;
    dataMovimento: Date | String;

    moradorId?: number;
    mesAnoCobranca?: string;
    considerarNaSomaMensalDoMorador?: boolean;
}