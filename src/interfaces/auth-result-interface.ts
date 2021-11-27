export interface IUsuarioAutenticado {
    id: number;
    nome: string;
    email: string;
    descricaoPerfil: string;
    tipoPerfil: number;
}

export interface IAuthenticateResult {
    token: string;
    expiresIn: Date;
    usuario: IUsuarioAutenticado;
}