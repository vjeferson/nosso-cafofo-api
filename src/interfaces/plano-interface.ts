export interface IPlano {
    id?: number;
    tipoPlano: number
    recorrencia: string;
    descricao: string;
    numeroMaximoParcelasPagamento: number;
    valorPlano: number;
    ativo: boolean;
}