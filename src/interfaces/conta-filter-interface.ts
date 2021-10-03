import { IFiltroPadrao } from './filter-padrao-interface';

export interface IFiltroConta extends IFiltroPadrao {
    descricao: string;
    situacao: number;
}