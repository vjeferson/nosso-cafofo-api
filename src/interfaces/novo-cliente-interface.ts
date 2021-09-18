export interface INovoCliente {
    nome: string;
    email: string;
    senha: string;

    nomeRepublica: string;
    anoCriacaoRepublica: string;
    diaPagamentoContas: number;
    numero: string;
    logradouro: string;
    complemento?: string;
    estadoId: string;
    cidadeId: number;
    anoEntradaMorador: number;
}