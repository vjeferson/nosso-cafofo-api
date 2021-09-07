import { Request, Response } from 'express';

import dotenv from 'dotenv';
dotenv.config();

export default class PingController {

    constructor() { };

    async ping(request: Request, response: Response) {
        return response.status(200).send(`Aplicação ativa (Ambiente: ${process.env.NODE_ENV === 'dev' ? 'desenvolvimento' : 'produção'})!`);
    }

}