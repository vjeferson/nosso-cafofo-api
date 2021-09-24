import { Response } from 'express';

import {
    ValidationError,
    NotFoundError,
    DBError,
    UniqueViolationError,
    NotNullViolationError,
    ForeignKeyViolationError,
    CheckViolationError,
    DataError
} from 'objection';

const mapConstraints: { [key: string]: string } = {
    'unique_tipo_plano_ativo': 'Não é possível ter ativo mais de um Plano para cada tipo de plano ao mesmo tempo!'
};

export default function errorHandlerObjection(err: any, response: Response,
    messagemErroAdicional: string) {
    if (err instanceof ValidationError) {
        switch (err.type) {
            case 'ModelValidation':
                response.status(400).send({
                    message: err.message,
                    error: err.type
                });
                break;
            case 'RelationExpression':
                response.status(400).send({
                    message: err.message,
                    error: 'RelationExpression'
                });
                break;
            case 'UnallowedRelation':
                response.status(400).send({
                    message: err.message,
                    error: err.type
                });
                break;
            case 'InvalidGraph':
                response.status(400).send({
                    message: err.message,
                    error: err.type
                });
                break;
            default:
                response.status(400).send({
                    message: err.message,
                    error: 'UnknownValidationError'
                });
                break;
        }
    } else if (err instanceof NotFoundError) {
        response.status(400).send({
            message: err.message,
            type: 'NotFound'
        });
    } else if (err instanceof UniqueViolationError) {
        response.status(400).send({
            message:
                mapConstraints[err.constraint] ?
                    `${mapConstraints[err.constraint]} Colunas: ${err.columns}` :
                    `${err.message} Colunas: ${err.columns}`,
            error: `${messagemErroAdicional}: UniqueViolation`
        });
    } else if (err instanceof NotNullViolationError) {
        response.status(400).send({
            message: err.message,
            error: 'NotNullViolation'
        });
    } else if (err instanceof ForeignKeyViolationError) {
        response.status(400).send({
            message: err.message,
            error: 'ForeignKeyViolation'
        });
    } else if (err instanceof CheckViolationError) {
        response.status(400).send({
            message: err.message,
            error: 'CheckViolation'
        });
    } else if (err instanceof DataError) {
        response.status(400).send({
            message: err.message,
            error: 'InvalidData'
        });
    } else if (err instanceof DBError) {
        response.status(400).send({
            message: err.message,
            error: 'UnknownDatabaseError'
        });
    } else {
        response.status(400).send({
            message: err.message,
            error: 'UnknownError'
        });
    }
}