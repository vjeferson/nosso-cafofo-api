export interface IUsuario {
    id?: number;
    nome: string;
    email: string;
    ativo: boolean;
    senha?: string;
    createTime?: string;
    updateTime?: string;
    perfilId: number;
    republicaId?: number;
    moradorId?: number;
}