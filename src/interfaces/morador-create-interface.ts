export interface INovoMorador {
    nome: string;
    anoEntrada: number;
    realizarCadastroDeUsuario: boolean;
    email?: string;
    senha?: string;
    confirmarSenha?: string;
    perfilId?: number;
}