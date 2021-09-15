export interface IUsuario {
    id?: number;
    nome: string;
    email: string;
    senha?: string;
    createTime?: Date;
    updateTime?: Date;
    perfilId: number;
    republicaId?: number;
    moradorId?: number;
}