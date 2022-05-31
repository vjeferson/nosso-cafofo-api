import * as AWSSDK from 'aws-sdk';
AWSSDK.config.region = 'sa-east-1';
export const AWS = AWSSDK;

export const LIMIT_MAXIMO = 50;

export const LIMIT_DEFAULT = 15;