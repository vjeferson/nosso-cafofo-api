export interface IUsuarioAutenticado {
    id: number;
    nome: string;
    email: string;
    descricaoPerfil: string;
    tipoPerfil: number;
    republicaId: number;
    moradorId?: number;
    assinaturaId?: number;
    anoEntradaRepublica: number;
    facebookVinculado: boolean;
    googleVinculado: boolean;
}

export interface IAuthenticateResult {
    token: string;
    expiresIn: Date;
    usuario: IUsuarioAutenticado;
}