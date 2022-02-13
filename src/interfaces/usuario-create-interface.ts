export interface INovoUsuario {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha:string;
    perfilId: number;
    moradorId?: number;
}