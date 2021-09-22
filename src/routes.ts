import express from 'express';
import authAdministradoresMiddleware from './middlewares/authAdministradoresMiddleware';
import authAdministradorNossoCafofoMiddleware from './middlewares/authAdministradorNossoCafofoMiddleware';
import authMiddleware from './middlewares/authMiddleware';
import AuthController from './modules/auth/auth-controller';
import CidadeController from './modules/cidade/cidade-controller';
import ClienteController from './modules/cliente/cliente-controller';
import EstadoController from './modules/estado/estado-controller';
import MoradorController from './modules/morador/morador-controller';
import PerfilController from './modules/perfil/perfil-controller';
import PingController from './modules/ping/ping-controller';
import RepublicaController from './modules/republica/republica-controller';
import UsuarioController from './modules/usuario/usuario-controller';

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

routes.get('/', pingController.ping);
routes.post('/cliente', clienteController.adicionarCliente);
routes.post('/authenticate', authController.authenticate);

routes.get('/estado', authMiddleware, estadoController.find);
routes.get('/estado/:id', authMiddleware, estadoController.findOne);

routes.get('/cidade', authMiddleware, cidadeController.find);
routes.get('/cidade/:id', authMiddleware, cidadeController.findOne);

routes.get('/perfil', authMiddleware, perfilController.find);
routes.get('/perfil/:id', authMiddleware, perfilController.findOne);
routes.post('/perfil', authMiddleware, authAdministradorNossoCafofoMiddleware, perfilController.create);
routes.put('/perfil/:id', authMiddleware, authAdministradorNossoCafofoMiddleware, perfilController.upsert);

routes.get('/republica', authMiddleware, authAdministradorNossoCafofoMiddleware, republicaController.find);
routes.get('/republica/:id', authMiddleware, republicaController.findOne);
routes.put('/republica/:id', authMiddleware, republicaController.upsert);

routes.get('/usuario', authMiddleware, usuarioController.find);
routes.get('/usuario/:id', authMiddleware, usuarioController.findOne);
routes.post('/usuario', authMiddleware, authAdministradoresMiddleware, usuarioController.create);
routes.put('/usuario/:id', authMiddleware, usuarioController.upsert);

export default routes;