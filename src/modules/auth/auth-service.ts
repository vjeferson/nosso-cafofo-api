
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
import { Assinatura } from '../assinatura/assinatura-model';
import { IAssinatura } from '../../interfaces/assinatura-interface';
import { IAuthenticateContaSocialBody } from '../../interfaces/auth-conta-social-body-interface';

dotenv.config();

export default class AuthService {
    constructor() { };

    async authenticate(filters: IAuthenticateBody | IAuthenticateContaSocialBody, logarUsandoContaSocial: boolean = false): Promise<IAuthenticateResult> {
        try {
            let usuario: Usuario[];
            if (logarUsandoContaSocial) {
                const mapSocialTypeColumn: any = {
                    'facebook': 'facebookId',
                    'google': 'googleId'
                };

                if (!mapSocialTypeColumn[(filters as IAuthenticateContaSocialBody).socialType]) {
                    throw new Error('Tipo de Conta Social inválida!');
                }

                usuario = await database('usuario')
                    .select('usuario.*')
                    .where(mapSocialTypeColumn[(filters as IAuthenticateContaSocialBody).socialType], (filters as IAuthenticateContaSocialBody).idContaSocial)
                    .limit(1)
                    .offset(0);
            } else {
                ValidadoresSerive.validaEmail((filters as IAuthenticateBody).email);
                ValidadoresSerive.validaSenha((filters as IAuthenticateBody).senha);
                usuario = await database('usuario')
                    .select('usuario.*')
                    .where('usuario.email', (filters as IAuthenticateBody).email)
                    .limit(1)
                    .offset(0);
            }

            if (Array.isArray(usuario) && usuario.length > 0) {
                if (!usuario[0].ativo) {
                    throw new Error('Usuário foi desativado!');
                }
                let usuarioValido: boolean = logarUsandoContaSocial ? true :
                    CriptografarSenhasSerive.decrypt((filters as IAuthenticateBody).senha, (usuario[0] as IUsuario).senha as string);

                if (usuarioValido) {
                    const perfil: IPerfil = await Perfil.query().findById(usuario[0].perfilId);
                    let republica!: IRepublica;
                    let assinatura!: IAssinatura[];
                    if (usuario[0].republicaId) {
                        republica = await Republica.query().findById(usuario[0].republicaId);
                        if (republica) {
                            assinatura = await Assinatura.query().select('a.id').alias('a')
                                .where('a.ativa', '=', true)
                                .where('a.republicaId', '=', republica.id);
                        }
                    }

                    let morador!: IMorador;
                    if (usuario[0].moradorId) {
                        morador = await Morador.query().findById(usuario[0].moradorId);
                    }

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
                            assinaturaId: Array.isArray(assinatura) && assinatura.length > 0 ? assinatura[0].id : null,
                            anoEntradaRepublica: morador ? morador.anoEntrada : null,
                            facebookVinculado: usuario[0] && usuario[0].facebookId ? true : false,
                            googleVinculado: usuario[0] && usuario[0].googleId ? true : false
                        }
                    } as IAuthenticateResult;
                } else {
                    throw new Error('Credenciais inválidas!');
                }
            } else {
                throw new Error(logarUsandoContaSocial ? 'Não existe um usuário vinculado a Conta Social informada!'
                    : 'Não existe um usuário para o Email informado!');
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