import express from 'express';
import routes from './routes';
import cors from 'cors';
import { createConnection } from 'typeorm';
import dbConfig from './config/database';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

const porta = process.env.PORT || 3333;


createConnection(dbConfig)
    .then((_connection) => {
        app.listen(porta, () => {
            console.log(`Server iniciado e escutando em http://localhost:${porta} !`)
        });
    })
    .catch((err) => {
        console.log("Erro ao conectar a Base de Dados!", err);
        process.exit(1);
    });