import express from 'express';
import swaggerDocs from './swagger.json';
import authAdministradoresMiddleware from './middlewares/authAdministradoresMiddleware';
import authAdministradorNossoCafofoMiddleware from './middlewares/authAdministradorNossoCafofoMiddleware';
import authMiddleware from './middlewares/authMiddleware';
import authMoradorAdministradorMiddleware from './middlewares/authMoradorAdministradorMiddleware';
import AssinaturaController from './modules/assinatura/assinatura-controller';
import AuthController from './modules/auth/auth-controller';
import CidadeController from './modules/cidade/cidade-controller';
import ClienteController from './modules/cliente/cliente-controller';
import ContaController from './modules/conta/conta-controller';
import EstadoController from './modules/estado/estado-controller';
import ParticipantesFestaController from './modules/festa-participantes/participantes-festa-controller';
import FestaController from './modules/festa/festa-controller';
import MoradorController from './modules/morador/morador-controller';
import PerfilController from './modules/perfil/perfil-controller';
import PingController from './modules/ping/ping-controller';
import PlanoController from './modules/plano/plano-controller';
import RepublicaController from './modules/republica/republica-controller';
import ReuniaoController from './modules/reuniao/reuniao-controller';
import UsuarioController from './modules/usuario/usuario-controller';
import EstatisticasController from './modules/estatisticas/estatisticas.controller';
import RelatoriosController from './modules/relatorios/relatorios-controller';

import multer from 'multer';
import {uploadAvatar} from './middlewares/uploadAvatarMiddleware';

const routes = express.Router();
const pingController = new PingController();
const estadoController = new EstadoController();
const cidadeController = new CidadeController();
const perfilController = new PerfilController();
const clienteController = new ClienteController();
const authController = new AuthController();

const republicaController = new RepublicaController();
const usuarioController = new UsuarioController();
const moradorController = new MoradorController();
const reuniaoController = new ReuniaoController();
const assinaturaController = new AssinaturaController();
const planoController = new PlanoController();
const festaController = new FestaController();
const participantesFestaController = new ParticipantesFestaController();
const contaController = new ContaController();
const estatisticasController = new EstatisticasController();
const relatoriosController = new RelatoriosController();

routes.get('/', pingController.ping);

routes.get('/api-docs.json', (request, response) => {
    if (swaggerDocs) {
        delete (swaggerDocs as any).openapi;
        (swaggerDocs as any).swagger = '2.0';
    }
    response.send(swaggerDocs);
});

routes.post('/cliente', clienteController.adicionarCliente);
routes.post('/authenticate', authController.authenticate);
routes.post('/authenticate-conta-social', authController.authenticateComContaSocial);

routes.get('/estado', estadoController.find);
routes.get('/estado/:id', estadoController.findOne);

routes.get('/cidade', cidadeController.find);
routes.get('/cidade/:id', cidadeController.findOne);

routes.get('/perfil', authMiddleware, perfilController.find);
routes.get('/perfil/:id', authMiddleware, perfilController.findOne);
routes.put('/perfil/:id', authMiddleware, authAdministradorNossoCafofoMiddleware, perfilController.upsert);

routes.get('/republica', authMiddleware, authAdministradorNossoCafofoMiddleware, republicaController.find);
routes.get('/republica/:id', authMiddleware, republicaController.findOne);
routes.get('/republica/informacoes-cadastro/:id', authMiddleware, republicaController.informacoesCadastro);
routes.put('/republica/:id', authMiddleware, republicaController.upsert);

routes.get('/usuario', authMiddleware, usuarioController.find);
routes.get('/usuario/:id', authMiddleware, usuarioController.findOne);
routes.post('/usuario', authMiddleware, authAdministradoresMiddleware, usuarioController.create);
routes.put('/usuario/:id', authMiddleware, usuarioController.upsert);
routes.put('/usuario/ativar/:id', authMiddleware, usuarioController.ativacaoOuDesativacao);
routes.put('/usuario/desativar/:id', authMiddleware, usuarioController.ativacaoOuDesativacao);
routes.put('/usuario/:id/troca-senha', authMiddleware, usuarioController.trocaSenha);
routes.post('/usuario/recuperar-senha', usuarioController.recuperaSenha);
routes.post('/usuario/valida-codigo-recuperacao-senha', usuarioController.verificaCodigoRecuperacaoSenha);
routes.post('/usuario/troca-senha-recuperacao', usuarioController.trocaSenhaRecuperacao);
routes.post('/usuario/verifica-vinculo-account-social', usuarioController.verificaExistenciaCadastroSocial);
routes.put('/usuario/:id/vincular-account-social', authMiddleware, usuarioController.vincularAccountSocial);
routes.put('/usuario/:id/desvincular-account-social', authMiddleware, usuarioController.desvincularAccountSocial);
routes.post('/usuario/troca-imagem-profile', authMiddleware,
    multer(uploadAvatar.getConfig).single("avatar"), usuarioController.trocaImagemProfile);

routes.get('/morador', authMiddleware, moradorController.find);
routes.get('/morador/:id', authMiddleware, moradorController.findOne);
routes.post('/morador', authMiddleware, moradorController.create);
routes.put('/morador/:id', authMiddleware, moradorController.upsert);
routes.put('/morador/ativar/:id', authMiddleware, moradorController.ativacaoOuDesativacao);
routes.put('/morador/desativar/:id', authMiddleware, moradorController.ativacaoOuDesativacao);

routes.get('/reuniao', authMiddleware, reuniaoController.find);
routes.get('/reuniao/:id', authMiddleware, reuniaoController.findOne);
routes.post('/reuniao', authMiddleware, reuniaoController.create);
routes.put('/reuniao/:id', authMiddleware, reuniaoController.upsert);
routes.delete('/reuniao/:id', authMiddleware, reuniaoController.delete);

routes.get('/plano/tipo-planos', planoController.tiposPlanos);
routes.get('/plano', planoController.find);
routes.get('/plano/:id', planoController.findOne);
routes.post('/plano', authMiddleware, authAdministradorNossoCafofoMiddleware, planoController.create);
routes.put('/plano/:id', authMiddleware, authAdministradorNossoCafofoMiddleware, planoController.upsert);
routes.put('/plano/ativar/:id', authMiddleware, authAdministradorNossoCafofoMiddleware, planoController.ativar);
routes.put('/plano/desativar/:id', authMiddleware, authAdministradorNossoCafofoMiddleware, planoController.desativar);

routes.get('/assinatura', authMiddleware, assinaturaController.find);
routes.get('/assinatura/:id', authMiddleware, assinaturaController.findOne);
routes.post('/assinatura/assinar-plano', authMiddleware, authMoradorAdministradorMiddleware, assinaturaController.assinar);
routes.get('/assinantes', authMiddleware, authAdministradorNossoCafofoMiddleware, assinaturaController.findAssinantes);
routes.get('/assinantes/:id', authMiddleware, authAdministradorNossoCafofoMiddleware, assinaturaController.findAssinanteEspecifico);

routes.post('/festa', authMiddleware, festaController.create);
routes.get('/festa', authMiddleware, festaController.find);
routes.get('/festa/:id', authMiddleware, festaController.findOne);
routes.put('/festa/:id', authMiddleware, festaController.upsert);
routes.delete('/festa/:id', authMiddleware, festaController.delete);

routes.post('/participantes-festa', authMiddleware, participantesFestaController.create);
routes.get('/participantes-festa/:festaId', authMiddleware, participantesFestaController.find);
routes.get('/participantes-festa/:id/festa/:festaId', authMiddleware, participantesFestaController.findOne);
routes.put('/participantes-festa/:id/festa/:festaId', authMiddleware, participantesFestaController.upsert);
routes.delete('/participantes-festa/:id/festa/:festaId', authMiddleware, participantesFestaController.delete);

routes.post('/conta', authMiddleware, contaController.create);
routes.get('/conta', authMiddleware, contaController.find);
routes.get('/conta/:id', authMiddleware, contaController.findOne);
routes.put('/conta/:id', authMiddleware, contaController.upsert);
routes.delete('/conta/:id', authMiddleware, contaController.delete);

routes.post('/entrada-saida', authMiddleware, contaController.create);
routes.get('/entrada-saida', authMiddleware, contaController.find);
// routes.get('/entrada-saida/:id', authMiddleware, contaController.findOne);
// routes.put('/conta/:id', authMiddleware, contaController.upsert);
// routes.delete('/conta/:id', authMiddleware, contaController.delete);

routes.get('/estatisticas/count-assinantes', authMiddleware, authAdministradorNossoCafofoMiddleware, estatisticasController.countAssinantes);
routes.get('/estatisticas/percentual-assinantes-por-plano', authMiddleware, authAdministradorNossoCafofoMiddleware, estatisticasController.percentualAssinantesPorPlano);
routes.get('/estatisticas/assinanturas-por-mes', authMiddleware, authAdministradorNossoCafofoMiddleware, estatisticasController.assinanturasPorMes);

routes.get('/estatisticas/count-pagamentos', authMiddleware, authAdministradorNossoCafofoMiddleware, estatisticasController.countPagamentos);
routes.get('/estatisticas/ultima-reuniao', authMiddleware, estatisticasController.ultimaReuniao);

routes.get('/relatorios/assinantes', authMiddleware, authAdministradorNossoCafofoMiddleware, relatoriosController.assinantes);

export default routes;