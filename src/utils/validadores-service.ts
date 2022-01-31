export default class ValidadoresSerive {

    constructor() { };

    static validaSenha(senha: string) {
        if (!senha) {
            throw new Error('Senha não foi informada!');
        }
        if (senha.length < 8) {
            throw new Error('A senha deve possuir o mínimo de 8 caracteres!');
        }
    }

    static validaEmail(email: string) {
        if (!email) {
            throw new Error('Email não foi informado!');
        }
    }

}