export interface IAssinatura {
    id?: number;
    validadePlano: Date | string;
    dataAssinatura: Date | string;
    ativa: boolean;
    planoId: number;
    republicaId: number;
}