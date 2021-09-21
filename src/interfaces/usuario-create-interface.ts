export interface INovoUsuario {
    nome: string;
    email: string;
    senha: string;
    perfilId: number;
    moradorId?: number;
}