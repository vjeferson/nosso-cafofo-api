import { query, Request, Response } from 'express';
import moment from 'moment';
import { raw } from 'objection';
import { EnumNumeroMes, EnumTipoPlano } from '../../utils/enums';
import { Assinatura } from '../assinatura/assinatura-model';

export default class EstatisticasController {

    constructor() { };

    async countAssinantes(request: Request, response: Response) {
        try {
            const queryCount = Assinatura.query().alias('a');
            queryCount.where('a.ativa', '=', true);

            const count: any[] = await queryCount.select()
                .count();

            return response.status(200).send({ assinantes: Array.isArray(count) && count.length > 0 ? +count[0].count : 0 });
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar estatísticas de número de assinantes', message: error.message });
        }
    }

    async countPagamentos(request: Request, response: Response) {
        try {
            return response.status(200).send({ pagamentos: 3 });
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar estatísticas de número de pagamentos', message: error.message });
        }
    }

    async ultimaReuniao(request: Request, response: Response) {
        try {
            moment.locale('pt-br');
            const data = moment().format('lll');
            return response.status(200).send({ data });
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar estatísticas de número de usuários', message: error.message });
        }
    }

    async percentualAssinantesPorPlano(request: Request, response: Response) {
        try {
            const queryCount = Assinatura.query().alias('a');
            queryCount.where('a.ativa', '=', true);

            const count: any[] = await queryCount.select()
                .joinRelated('plano', { alias: 'p' })
                .count();
            const totalAssinantesAtivos = Array.isArray(count) && count.length > 0 ? +count[0].count : 0

            const countPorPlano: any[] = await queryCount.select('p.tipoPlano')
                .joinRelated('plano', { alias: 'p' })
                .count()
                .groupBy('p.tipoPlano');

            const mapPercentualPlanos: {[key:number]: number} = {};

            (countPorPlano || []).forEach(item =>{
                mapPercentualPlanos[item.tipoPlano] = (item.count / totalAssinantesAtivos) * 100;
            });
            
            const retorno: { [key: string]: number } = {
                percentualPlanoFree: mapPercentualPlanos[EnumTipoPlano.Free] || 0,
                percentualPlanoMensal: mapPercentualPlanos[EnumTipoPlano.Mensal] || 0,
                percentualPlanoSemestral: mapPercentualPlanos[EnumTipoPlano.Semestral] || 0,
                percentualPlanoAnual: mapPercentualPlanos[EnumTipoPlano.Anual] || 0,
                percentualPlanoPromocionalAnual: mapPercentualPlanos[EnumTipoPlano.PromocionalAnual] || 0,
            };

            return response.status(200).send(retorno);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar estatísticas', message: error.message });
        }
    }


    async assinanturasPorMes(request: Request, response: Response) {
        try {
            const queryCount = Assinatura.query().alias('a');
            const dataInicio = moment().startOf('year');
            const dataFim = moment().endOf('year');
            queryCount.whereBetween('a.dataAssinatura', [dataInicio, dataFim]);
            
            const countPorMes: any[] = await queryCount.select(
                    raw("TO_CHAR(??, 'MM')", 'a.dataAssinatura').as('dataAssinatura')
                )
                .count()
                .groupBy(raw("TO_CHAR(??, 'MM')", 'a.dataAssinatura'));

            const mapAssinaturasMensal: {[key:number]: number} = {};

            (countPorMes || []).forEach(item =>{
                mapAssinaturasMensal[+item.dataAssinatura] = +item.count;
            });

            const retorno: { [key: string]: number } = {
                janeiro: mapAssinaturasMensal[EnumNumeroMes.Janeiro] || 0,
                fevereiro: mapAssinaturasMensal[EnumNumeroMes.Fevereiro] || 0,
                marco: mapAssinaturasMensal[EnumNumeroMes.Marco] || 0,
                abril: mapAssinaturasMensal[EnumNumeroMes.Abril] || 0,
                maio: mapAssinaturasMensal[EnumNumeroMes.Maio] || 0,
                junho: mapAssinaturasMensal[EnumNumeroMes.Junho] || 0,
                julho: mapAssinaturasMensal[EnumNumeroMes.Julho] || 0,
                agosto: mapAssinaturasMensal[EnumNumeroMes.Agosto] || 0
            };

            return response.status(200).send(retorno);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar estatísticas:', message: error.message });
        }
    }

}