import { Response } from 'express';
import database from '../../database/connection';
import CriptografarSenhasSerive from '../../utils/criptografar-senhas-service';
import ValidadoresSerive from '../../utils/validadores-service';
import moment from 'moment';
import { IUsuario } from '../../interfaces/usuario-interface';
import { IRepublica } from '../../interfaces/republica-interface';

export default class RepublicaService {
    constructor() { };

    async find(filters: any): Promise<IRepublica[]> {
        try {
            return [];
        } catch (error) {
            throw error;
        }
    }

    async findOne(republicaId: number): Promise<IRepublica | null> {
        try {
            return null;
        } catch (error) {
            throw error;
        }
    }

    async upsert(republicaId: number, data: IRepublica): Promise<boolean> {
        try {
            return true;
        } catch (error) {
            throw error;
        }
    }

}