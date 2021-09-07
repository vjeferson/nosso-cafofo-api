import * as crypto from 'crypto';

export class CriptografarSenhasSerive {

    constructor() { };

    static encrypt(senha: string): string {
        const senhaEncriptada = crypto.createHmac('sha256', senha).digest('hex');
        return senhaEncriptada;
    }

    static decrypt(senha: string, senhaEncriptada: string): boolean {
        return senhaEncriptada === crypto.createHmac('sha256', senha).digest('hex');
    }

}