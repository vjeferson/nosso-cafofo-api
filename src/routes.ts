import express from 'express';
import authMiddleware from './middlewares/authMiddleware';
import AuthController from './auth/auth-controller';
import PerfilController from './modules/perfil/perfil-controller';
import PingController from './modules/ping/ping-controller';
import UsuarioController from './modules/usuario/usuario-controller';

const routes = express.Router();
const pingController = new PingController();
const authController = new AuthController();
const perfilController = new PerfilController();
const usuarioController = new UsuarioController();


routes.get('/', pingController.ping);
routes.post('/authenticate', authController.authenticate);

routes.get('/perfil', authMiddleware, perfilController.find);
routes.get('/perfil/:id', authMiddleware, perfilController.findOne);

routes.get('/usuario', authMiddleware, usuarioController.find);
routes.get('/usuario/:id', authMiddleware, usuarioController.findOne);
routes.post('/usuario', authMiddleware, usuarioController.create);
routes.post('/cadastro-novo-cliente', authMiddleware, usuarioController.createNewClient);

export default routes;