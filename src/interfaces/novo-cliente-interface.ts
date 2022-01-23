export interface INovoCliente {
    nome: string;
    email: string;
    senha: string;

    nomeRepublica: string;
    anoCriacaoRepublica: number;
    diaPagamentoContas: number;
    numero: string;
    logradouro: string;
    complemento?: string;
    estadoId: string;
    cidadeId: number;
    anoEntradaMorador: number;
    planoId?: number;
}