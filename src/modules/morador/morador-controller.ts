import { Request, Response } from 'express';
import { Transaction } from 'objection';
import { INovoMorador } from '../../interfaces/morador-create-interface';
import { IFiltroMorador } from '../../interfaces/morador-filter-interface';
import { IUpdateMorador } from '../../interfaces/morador-update-interface';
import { LIMIT_DEFAULT, LIMIT_MAXIMO } from '../../utils/consts';
import CriptografarSenhasSerive from '../../utils/criptografar-senhas-service';
import errorHandlerObjection from '../../utils/handler-erros-objection';
import TenantsSerive from '../../utils/tenants-service';
import ValidadoresSerive from '../../utils/validadores-service';
import { Usuario } from '../usuario/usuario-model';
import { Morador } from './morador-model';

export default class MoradorController {

    async find(request: Request, response: Response) {
        try {
            const filters: IFiltroMorador = request.query as any;
            const limit: number = filters.limit && !isNaN(+filters.limit) && filters.limit < LIMIT_MAXIMO ?
                +filters.limit : LIMIT_DEFAULT;
            const offset: number = filters.offset || 0;

            const query = Morador.query();
            const queryCount = Morador.query();

            if (filters.nome) {
                query.where('morador.nome', 'like', `${filters.nome}%`);
                queryCount.where('morador.nome', 'like', `${filters.nome}%`);
            }

            if (!isNaN(+(filters.anoEntrada as any)) && filters.anoEntrada !== null &&
                filters.anoEntrada !== undefined
                && (filters.anoEntrada as any) !== '') {
                query.where('anoEntrada', filters.anoEntrada);
                queryCount.where('anoEntrada', filters.anoEntrada);
            }

            if (filters.ativo !== null && filters.ativo !== undefined &&
                (filters.ativo as any) !== 'todos' &&
                (filters.ativo === true || (filters as any).ativo === 'true' ||
                    filters.ativo === false || (filters.ativo as any) === 'false')
            ) {
                query.where('morador.ativo', filters.ativo);
                queryCount.where('morador.ativo', filters.ativo);
            }

            if (filters.apenasMoradoresNaoVinculadosEmUsuario !== null &&
                filters.apenasMoradoresNaoVinculadosEmUsuario !== undefined &&
                (filters.apenasMoradoresNaoVinculadosEmUsuario === true ||
                    (filters as any).apenasMoradoresNaoVinculadosEmUsuario === 'true')) {
                query.leftJoin('usuario', 'morador.id', 'usuario.moradorId');
                queryCount.leftJoin('usuario', 'morador.id', 'usuario.moradorId');
                query.where('usuario.id', null);
                queryCount.where('usuario.id', null);
            }

            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, query,
                request.usuario.republicaId, 'morador');
            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, queryCount,
                request.usuario.republicaId, 'morador');

            const moradores = await query.select().limit(limit).offset(offset).orderBy('id', 'ASC');
            const countPlanos: any[] = await queryCount.select().count();

            return response.status(200).send({
                rows: moradores,
                count: Array.isArray(countPlanos)
                    && countPlanos.length > 0 ? +countPlanos[0].count : 0
            });
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar moradores', message: error.message });
        }
    }

    async findOne(request: Request, response: Response) {
        try {
            const moradorId = request.params.id;
            if (isNaN(+moradorId) || moradorId === null || moradorId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const query = Morador.query();
            TenantsSerive.aplicarTenantRepublica(request.perfil.tipoPerfil, query, request.usuario.republicaId);
            query.where('id', moradorId);
            const morador = await query.select();

            return response.status(200).send(Array.isArray(morador) && morador.length > 0 ? morador[0] : null);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar o morador', message: error.message });
        }
    }

    async create(request: Request, response: Response) {
        let transaction: Transaction = null;
        try {
            const dados: INovoMorador = request.body;
            transaction = await Morador.startTransaction();

            const novoMorador = await Morador.query(transaction).insert({
                nome: dados.nome,
                anoEntrada: dados.anoEntrada,
                ativo: true,
                republicaId: request.republica.id
            });

            if (dados.realizarCadastroDeUsuario) {
                ValidadoresSerive.validaEmail(dados.email || '');
                ValidadoresSerive.validaSenha(dados.senha || '');
                if (dados.senha !== dados.confirmarSenha) {
                    throw new Error('Senha não confere com a confirmação!');
                }

                const senhaEncriptada = CriptografarSenhasSerive.encrypt(dados.senha as string);

                await Usuario.query(transaction).insert({
                    nome: dados.nome,
                    email: dados.email,
                    senha: senhaEncriptada,
                    perfilId: dados.perfilId,
                    republicaId: request.republica.id,
                    moradorId: novoMorador.id
                });
            }

            await transaction.commit();
            return response.status(201).send(novoMorador);
        } catch (error: any) {
            if (transaction) {
                await transaction.rollback();
            }
            return response.status(400).json({ error: 'Erro ao criar morador', message: error.message });
        }
    }

    async upsert(request: Request, response: Response) {
        try {
            const moradorId = request.params.id;
            if (isNaN(+moradorId) || moradorId === null || moradorId === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            const dados: IUpdateMorador = request.body;

            const morador = await Morador.query().findById(moradorId);

            if (morador) {
                if (+request.usuario.republicaId !== +morador.republicaId) {
                    return response.status(401).send('Seu usuário não pode alterar informações do morador informado!');
                }

                await Morador.query()
                    .findById(morador.id as number)
                    .patch({
                        nome: dados.nome,
                        anoEntrada: dados.anoEntrada,
                        ativo: dados.ativo
                    });
            } else {
                throw new Error('Não existe um morador para o id (identificador) informado!');
            }

            return response.status(200).send(true);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao atualizar morador', message: error.message });
        }
    }

    async ativacaoOuDesativacao(request: Request, response: Response) {
        let transaction: Transaction;
        try {
            const ativo: boolean = request.path.includes('desativar') ? false : true;
            const identificadorRegistro = request.params.id;
            if (isNaN(+identificadorRegistro) || identificadorRegistro === null || identificadorRegistro === undefined) {
                throw new Error('Id (identificador) informado é inválido!');
            }

            transaction = await Morador.startTransaction();
            const registro = await Morador.query(transaction).findById(identificadorRegistro);
            if (!registro) {
                throw new Error('Não existe um registro para o id (identificador) informado!');
            }

            await Morador.query(transaction)
                .patch({ ativo })
                .where('id', '=', registro.id);

            await transaction.commit();
            return response.status(200).send(true);
        } catch (error: any) {
            if (transaction) {
                await transaction.rollback();
            }
            errorHandlerObjection(error, response, 'Erro ao ativar registro');
        }
    }

}