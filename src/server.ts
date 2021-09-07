import express from 'express';
import routes from './routes';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

const porta = process.env.PORT || 3333;

app.listen(porta, () => {
    console.log(`Server iniciado e escutando em http://localhost:${porta} !`)
});