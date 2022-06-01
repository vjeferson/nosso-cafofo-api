import * as AWSSDK from 'aws-sdk';
import { EnumTipoPlano } from './enums';
AWSSDK.config.region = 'sa-east-1';
export const AWS = AWSSDK;

export const LIMIT_MAXIMO = 50;

export const LIMIT_DEFAULT = 15;

export const mapTiposPlanos: { [key: number]: string } = {
    [EnumTipoPlano.Mensal]: 'Mensal',
    [EnumTipoPlano.Semestral]: 'Semestral',
    [EnumTipoPlano.Anual]: 'Anual',
    [EnumTipoPlano.PromocionalAnual]: 'Promocional Anual',
    [EnumTipoPlano.Free]: 'Free (Grátis)'
};