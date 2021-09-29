export interface IConta {
    id?: number;
    descricao: string;
    valor: number;
    situacao: number;
    mesAnoConta: number;
    divisaoPorIgualEntreMoradores?: boolean;
    republicaId: number;
}