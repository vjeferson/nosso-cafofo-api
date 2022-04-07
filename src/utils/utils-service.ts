export default class UtilsSerive {

    constructor() { };

    static gerarCodigoRecuperacaoSenha(): string {
        return Math.random().toString(36).slice(-8);
    }

}