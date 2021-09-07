
import { IAuthenticateBody } from './auth-body-interface';
import { IAuthenticateResult } from './auth-result-model';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CriptografarSenhasSerive } from '../../utils/criptografar-senhas-service';
import database from '../../database/connection';
import { ValidadoresSerive } from '../../utils/validadores-service';
import { IUsuario } from '../usuario/usuario-interface';

dotenv.config();

export default class AuthService {
    constructor() { };

    async authenticate(filters: IAuthenticateBody): Promise<IAuthenticateResult> {
        try {
            ValidadoresSerive.validaEmail(filters.email);
            ValidadoresSerive.validaSenha(filters.senha);

            const usuario = await database('usuario')
                .select('usuario.*')
                .where('email', filters.email)
                .limit(1)
                .offset(0);

            if (Array.isArray(usuario) && usuario.length > 0) {
                const senhaIsValid = CriptografarSenhasSerive.decrypt(filters.senha, (usuario[0] as IUsuario).senha as string);
                if (senhaIsValid) {
                    const { token, decoded } = this.signToken({ id: usuario[0].id });

                    return {
                        token,
                        expiresIn: moment.unix(decoded.exp).toDate()
                    } as IAuthenticateResult;
                } else {
                    throw new Error('Credenciais inválidas!');
                }
            } else {
                throw new Error('Não existe um usuário para o Email informado!');
            }
        } catch (error) {
            throw error;
        }
    }


    private signToken(dataToken: any, expires: string = '7d') {
        const token = jwt.sign(dataToken, `${process.env.JWT_KEY}`, { expiresIn: expires });
        const decoded = jwt.decode(token) as any;
        return { token, decoded };
    }

}