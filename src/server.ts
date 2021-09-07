import express from 'express';
import routes from './routes';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swagger.json';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use(routes);
const porta = process.env.PORT || 3333;

app.listen(porta, () => {
    console.log(`Server iniciado e escutando em http://localhost:${porta} !`)
});