export interface IRepublica {
    id?: number;
    nome: string;
    anoCriacao: number;
    dataPagamentoContas: number;
    numero: string;
    logradouro: string;
    complemento?: string;
    estadoId: string;
    cidadeId: number;
}