
import { IAuthenticateBody } from '../../interfaces/auth-body-interface';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import CriptografarSenhasSerive from '../../utils/criptografar-senhas-service';
import database from '../../database/connection';
import ValidadoresSerive from '../../utils/validadores-service';
import { IAuthenticateResult } from '../../interfaces/auth-result-interface';
import { IUsuario } from '../../interfaces/usuario-interface';
import { Perfil } from '../perfil/perfil-model';
import { IPerfil } from '../../interfaces/perfil-interface';
import { IMorador } from '../../interfaces/morador-interface';
import { Usuario } from '../usuario/usuario-model';
import { Republica } from '../republica/republica.model';
import { IRepublica } from '../../interfaces/republica-interface';
import { Morador } from '../morador/morador-model';

dotenv.config();

export default class AuthService {
    constructor() { };

    async authenticate(filters: IAuthenticateBody): Promise<IAuthenticateResult> {
        try {
            ValidadoresSerive.validaEmail(filters.email);
            ValidadoresSerive.validaSenha(filters.senha);

            const usuario: Usuario[] = await database('usuario')
                .select('usuario.*')
                .where('usuario.email', filters.email)
                .limit(1)
                .offset(0);

            if (Array.isArray(usuario) && usuario.length > 0) {
                const perfil: IPerfil = await Perfil.query().findById(usuario[0].perfilId);
                let republica!: IRepublica;
                if (usuario[0].republicaId) {
                    republica = await Republica.query().findById(usuario[0].republicaId);
                }

                let morador!: IMorador;
                if (usuario[0].moradorId) {
                    morador = await Morador.query().findById(usuario[0].moradorId);
                }

                const senhaIsValid = CriptografarSenhasSerive.decrypt(filters.senha, (usuario[0] as IUsuario).senha as string);
                if (senhaIsValid) {
                    const { token, decoded } = this.signToken({ id: usuario[0].id });

                    return {
                        token,
                        expiresIn: moment.unix(decoded.exp).toDate(),
                        usuario: {
                            id: usuario[0].id,
                            nome: usuario[0].nome,
                            email: usuario[0].email,
                            descricaoPerfil: perfil.descricao,
                            tipoPerfil: perfil.tipoPerfil,
                            republicaId: republica ? republica.id : null,
                            moradorId: morador ? morador.id : null,
                            anoEntradaRepublica: morador ? morador.anoEntrada : null
                        }
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


    private signToken(dataToken: any, expires: string = '14d') {
        const token = jwt.sign(dataToken, `${process.env.JWT_KEY}`, { expiresIn: expires });
        const decoded = jwt.decode(token) as any;
        return { token, decoded };
    }

}