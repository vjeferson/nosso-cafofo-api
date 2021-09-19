import express from 'express';
import authAdministradorNossoCafofoMiddleware from './middlewares/authAdministradorNossoCafofoMiddleware';
import authMiddleware from './middlewares/authMiddleware';
import AuthController from './modules/auth/auth-controller';
import ClienteController from './modules/cliente/cliente-controller';
import PerfilController from './modules/perfil/perfil-controller';
import PingController from './modules/ping/ping-controller';
import UsuarioController from './modules/usuario/usuario-controller';

const routes = express.Router();
const pingController = new PingController();
const clienteController = new ClienteController();
const authController = new AuthController();
const perfilController = new PerfilController();
const usuarioController = new UsuarioController();

routes.get('/', pingController.ping);
routes.post('/cliente', clienteController.adicionarCliente);
routes.post('/authenticate', authController.authenticate);

routes.get('/perfil', authMiddleware, authAdministradorNossoCafofoMiddleware, perfilController.find);
routes.get('/perfil/:id', authMiddleware, authAdministradorNossoCafofoMiddleware, perfilController.findOne);

routes.get('/usuario', authMiddleware, usuarioController.find);
routes.get('/usuario/:id', authMiddleware, usuarioController.findOne);
routes.post('/usuario', authMiddleware, usuarioController.create);
routes.put('/usuario/:id', authMiddleware, usuarioController.upsert);

export default routes;